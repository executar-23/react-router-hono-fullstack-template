import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { Hono } from "hono";
import { apiError, ERR, log } from "./http";
import {
	authClient,
	clearSession,
	isAdmin,
	originAllowed,
	OAUTH_COOKIE,
	writeTokens,
	type TokenVerifier,
} from "./session";
import type { ApiBindings } from "./types";

/** Login por redirecionamento ao OpenAuth (code + PKCE); sessão em cookies HttpOnly. */
export function authRoutes(verify: TokenVerifier) {
	const routes = new Hono<ApiBindings>();

	routes.get("/login", async (c) => {
		const redirectUri = new URL("/api/auth/callback", c.req.url).toString();
		const { challenge, url } = await authClient(c.env).authorize(
			redirectUri,
			"code",
			{ pkce: true },
		);
		setCookie(c, OAUTH_COOKIE, JSON.stringify(challenge), {
			httpOnly: true,
			secure: new URL(c.req.url).protocol === "https:",
			sameSite: "Lax",
			path: "/api/auth",
			maxAge: 600,
		});
		return c.redirect(url, 302);
	});

	routes.get("/callback", async (c) => {
		const code = c.req.query("code");
		const state = c.req.query("state");
		const raw = getCookie(c, OAUTH_COOKIE);
		deleteCookie(c, OAUTH_COOKIE, { path: "/api/auth" });
		let challenge: { state: string; verifier?: string } | null = null;
		try {
			challenge = raw ? JSON.parse(raw) : null;
		} catch {
			challenge = null;
		}
		if (!code || !state || !challenge || challenge.state !== state) {
			return apiError(c, 400, ERR.badRequest, "Invalid login callback");
		}
		const redirectUri = new URL("/api/auth/callback", c.req.url).toString();
		const exchanged = await authClient(c.env).exchange(
			code,
			redirectUri,
			challenge.verifier,
		);
		if (exchanged.err) {
			return apiError(c, 401, ERR.unauthorized, "Login failed");
		}
		writeTokens(c, exchanged.tokens);
		log("info", "auth.login", { requestId: c.get("requestId") });
		return c.redirect("/", 302);
	});

	routes.get("/me", async (c) => {
		const access = getCookie(c, "hub_at");
		if (!access) return apiError(c, 401, ERR.unauthorized, "Not signed in");
		const outcome = await verify(c.env, access, getCookie(c, "hub_rt")).catch(
			() => undefined,
		);
		if (outcome === undefined) {
			return apiError(c, 503, ERR.unavailable, "Auth service unavailable");
		}
		if (!outcome) {
			clearSession(c);
			return apiError(c, 401, ERR.unauthorized, "Session expired");
		}
		if (!isAdmin(c.env, outcome.actor)) {
			return apiError(c, 403, ERR.forbidden, "Not an administrator");
		}
		if (outcome.tokens) writeTokens(c, outcome.tokens);
		return c.json({ success: true, result: { email: outcome.actor.email } });
	});

	routes.post("/logout", (c) => {
		if (!originAllowed(c)) {
			return apiError(c, 403, ERR.forbidden, "Origin not allowed");
		}
		clearSession(c);
		return c.json({ success: true, result: { signedOut: true } });
	});

	return routes;
}

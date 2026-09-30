import { createClient, type Tokens } from "@openauthjs/openauth/client";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { MiddlewareHandler } from "hono";
import { subjects } from "../../shared/subjects";
import { apiError, ERR, log } from "./http";
import type { Actor, ApiBindings, ApiEnv, AppContext } from "./types";

const ACCESS_COOKIE = "hub_at";
const REFRESH_COOKIE = "hub_rt";
const OAUTH_COOKIE = "hub_oauth";
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30;

export interface VerifyOutcome {
	actor: Actor;
	tokens?: Tokens;
}

/** Contrato injetável: produção usa OpenAuth; testes passam um verificador falso. */
export type TokenVerifier = (
	env: ApiEnv,
	access: string,
	refresh?: string,
) => Promise<VerifyOutcome | null>;

export const openAuthVerifier: TokenVerifier = async (env, access, refresh) => {
	const client = createClient({
		clientID: env.AUTH_CLIENT_ID,
		issuer: env.AUTH_ISSUER_URL,
	});
	const result = await client.verify(subjects, access, { refresh });
	if (result.err) return null;
	return {
		actor: {
			id: result.subject.properties.id,
			email: result.subject.properties.email,
		},
		tokens: result.tokens,
	};
};

export function isAdmin(env: ApiEnv, actor: Actor): boolean {
	return (
		actor.email.trim().toLowerCase() === env.ADMIN_EMAIL.trim().toLowerCase()
	);
}

function secure(c: AppContext): boolean {
	return new URL(c.req.url).protocol === "https:";
}

function writeTokens(c: AppContext, tokens: Tokens) {
	const opts = {
		httpOnly: true,
		secure: secure(c),
		sameSite: "Lax" as const,
		path: "/",
	};
	setCookie(c, ACCESS_COOKIE, tokens.access, {
		...opts,
		maxAge: Math.max(60, tokens.expiresIn),
	});
	setCookie(c, REFRESH_COOKIE, tokens.refresh, {
		...opts,
		maxAge: REFRESH_MAX_AGE,
	});
}

export function clearSession(c: AppContext) {
	deleteCookie(c, ACCESS_COOKIE, { path: "/" });
	deleteCookie(c, REFRESH_COOKIE, { path: "/" });
}

export { writeTokens, OAUTH_COOKIE };

const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/** Defesa CSRF: cookie SameSite=Lax + Origin obrigatório em métodos que alteram estado. */
export function originAllowed(c: AppContext): boolean {
	if (!MUTATING.has(c.req.method)) return true;
	const origin = c.req.header("origin");
	if (!origin) return false;
	try {
		return origin === new URL(c.env.ALLOWED_ORIGIN).origin;
	} catch {
		return false;
	}
}

export function requireAdmin(
	verify: TokenVerifier,
): MiddlewareHandler<ApiBindings> {
	return async (c, next) => {
		if (!originAllowed(c)) {
			return apiError(c, 403, ERR.forbidden, "Origin not allowed");
		}
		const access = getCookie(c, ACCESS_COOKIE);
		if (!access) return apiError(c, 401, ERR.unauthorized, "Not signed in");
		const refresh = getCookie(c, REFRESH_COOKIE);
		let outcome: VerifyOutcome | null = null;
		try {
			outcome = await verify(c.env, access, refresh);
		} catch (err) {
			log("error", "auth.verify_failed", {
				requestId: c.get("requestId"),
				error: err instanceof Error ? err.message : "unknown",
			});
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
		c.set("actor", outcome.actor);
		await next();
	};
}

export function authClient(env: ApiEnv) {
	return createClient({
		clientID: env.AUTH_CLIENT_ID,
		issuer: env.AUTH_ISSUER_URL,
	});
}

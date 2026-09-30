import { ApiException, fromHono } from "chanfana";
import { Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { authRoutes } from "./auth-routes";
import {
	HubDeleteRecord,
	HubImport,
	HubListAll,
	HubListModule,
	HubUpsertRecord,
	VocabList,
	VocabPut,
} from "./hub";
import { ERR, log } from "./http";
import { openAuthVerifier, requireAdmin, type TokenVerifier } from "./session";
import type { ApiBindings } from "./types";
import { PublishStart, PublishStatus } from "./workflows";

/** Monta a API. `verify` é injetável para testes; produção usa OpenAuth. */
export function createApiApp(verify: TokenVerifier = openAuthVerifier) {
	const app = new Hono<ApiBindings>();

	// Contexto e log estruturado por requisição (sem cookies, tokens ou corpo).
	app.use("*", async (c, next) => {
		const started = Date.now();
		const requestId = c.req.header("cf-ray") ?? crypto.randomUUID();
		c.set("requestId", requestId);
		await next();
		c.res.headers.set("x-request-id", requestId);
		log("info", "http.request", {
			requestId,
			method: c.req.method,
			path: new URL(c.req.url).pathname,
			status: c.res.status,
			ms: Date.now() - started,
		});
	});

	app.onError((err, c) => {
		if (err instanceof ApiException) {
			return c.json(
				{ success: false, errors: err.buildResponse() },
				err.status as ContentfulStatusCode,
			);
		}
		log("error", "http.unhandled", {
			requestId: c.get("requestId"),
			error: err instanceof Error ? err.message : "unknown",
		});
		return c.json(
			{ success: false, errors: [{ code: ERR.internal, message: "Internal Server Error" }] },
			500,
		);
	});

	// Público: healthcheck (sem dados) e fluxo de login.
	app.get("/health", async (c) => {
		try {
			await c.env.DB.prepare("SELECT 1").first();
			return c.json({ success: true, result: { status: "ok" } });
		} catch {
			return c.json(
				{ success: false, errors: [{ code: ERR.unavailable, message: "db unavailable" }] },
				503,
			);
		}
	});
	app.route("/auth", authRoutes(verify));

	// Todo o resto exige o administrador.
	app.use("/hub", requireAdmin(verify));
	app.use("/hub/*", requireAdmin(verify));
	app.use("/vocab", requireAdmin(verify));
	app.use("/vocab/*", requireAdmin(verify));
	app.use("/workflows/*", requireAdmin(verify));

	const openapi = fromHono(app, {
		docs_url: "/docs",
		openapi_url: "/openapi.json",
		schema: {
			info: {
				title: "Hub Editorial API",
				version: "1.0.0",
				description: "API do Hub Editorial do Risco Cognitivo (ADR-001).",
			},
		},
	});
	openapi.get("/hub", HubListAll);
	openapi.post("/hub/import", HubImport);
	openapi.get("/hub/:module", HubListModule);
	openapi.put("/hub/:module/:id", HubUpsertRecord);
	openapi.delete("/hub/:module/:id", HubDeleteRecord);
	openapi.get("/vocab", VocabList);
	openapi.put("/vocab/:name", VocabPut);
	openapi.post("/workflows/publish", PublishStart);
	openapi.get("/workflows/:id", PublishStatus);

	return app;
}

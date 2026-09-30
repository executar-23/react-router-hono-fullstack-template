import { Hono } from "hono";
import { createRequestHandler } from "react-router";
import { createApiApp } from "./api/app";
import type { ApiEnv } from "./api/types";

export { HubPublishWorkflow } from "./workflows/hub-publish";

const app = new Hono<{ Bindings: ApiEnv }>();

// API do Hub (D1 + OpenAuth + Workflows). Tudo em /api/*.
app.route("/api", createApiApp());

app.get("*", (c) => {
	const requestHandler = createRequestHandler(
		() => import("virtual:react-router/server-build"),
		import.meta.env.MODE,
	);

	return requestHandler(c.req.raw, {
		cloudflare: { env: c.env, ctx: c.executionCtx },
	});
});

export default app;

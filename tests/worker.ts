// Worker de teste: monta só a API (sem o build do React Router) com verificador falso.
import { Hono } from "hono";
import { createApiApp } from "../workers/api/app";
import type { ApiEnv } from "../workers/api/types";

export { HubPublishWorkflow } from "../workers/workflows/hub-publish";

export const ADMIN = "executar-rotina@outlook.com";

const app = new Hono<{ Bindings: ApiEnv }>();
app.route(
	"/api",
	createApiApp(async (_env, access) => {
		if (access === "admin-token") return { actor: { id: "u1", email: ADMIN } };
		if (access === "other-token") return { actor: { id: "u2", email: "outra@pessoa.dev" } };
		return null;
	}),
);
export default app;

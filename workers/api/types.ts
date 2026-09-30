import type { Context } from "hono";
import type { HubPublishParams } from "../workflows/hub-publish";

export interface ApiEnv {
	DB: D1Database;
	HUB_PUBLISH_WORKFLOW: Workflow<HubPublishParams>;
	ENVIRONMENT: string;
	ALLOWED_ORIGIN: string;
	AUTH_ISSUER_URL: string;
	AUTH_CLIENT_ID: string;
	ADMIN_EMAIL: string;
	PROJECT_CONTACT: string;
}

export interface Actor {
	id: string;
	email: string;
}

export type ApiVariables = { actor: Actor; requestId: string };
export type ApiBindings = { Bindings: ApiEnv; Variables: ApiVariables };
export type AppContext = Context<ApiBindings>;

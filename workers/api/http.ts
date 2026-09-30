import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { AppContext } from "./types";

/** Envelope de erro estável: { success:false, errors:[{code,message}] }. */
export function apiError(
	c: AppContext,
	status: ContentfulStatusCode,
	code: number,
	message: string,
) {
	return c.json({ success: false, errors: [{ code, message }] }, status);
}

export const ERR = {
	badRequest: 4000,
	unauthorized: 4010,
	forbidden: 4030,
	notFound: 4040,
	conflict: 4090,
	unavailable: 5030,
	internal: 7000,
} as const;

/** Log JSON estruturado; nunca inclua token, cookie ou corpo de requisição. */
export function log(
	level: "info" | "warn" | "error",
	message: string,
	fields: Record<string, unknown> = {},
) {
	console[level](JSON.stringify({ level, message, ...fields }));
}

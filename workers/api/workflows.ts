import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { apiError, ERR, log } from "./http";
import type { AppContext } from "./types";

const idParam = z.string().regex(/^[A-Za-z0-9_-]{1,64}$/);
const instanceIdParam = z.string().regex(/^publish-[A-Za-z0-9_-]{1,92}$/);

const statusOut = z.object({
	success: z.literal(true),
	result: z.object({
		instanceId: z.string().nullable(),
		status: z.string(),
		error: z.string().optional(),
	}),
});

export class PublishStart extends OpenAPIRoute {
	schema = {
		tags: ["Workflows"],
		summary: "Inicia (ou retoma) a publicação de um conteúdo",
		request: {
			body: {
				content: {
					"application/json": { schema: z.object({ recordId: idParam }) },
				},
			},
		},
		responses: {
			"202": {
				description: "Instância aceita",
				content: { "application/json": { schema: statusOut } },
			},
		},
	};
	async handle(c: AppContext) {
		const { body } = await this.getValidatedData<typeof this.schema>();
		const db = c.env.DB;
		const row = await db
			.prepare(
				"SELECT updated_at, json_extract(data, '$.Status_editorial') AS status FROM records WHERE module = 'content' AND id = ?",
			)
			.bind(body.recordId)
			.first<{ updated_at: string; status: string | null }>();
		if (!row) return apiError(c, 404, ERR.notFound, "Content not found");
		// O próprio workflow altera updated_at; depois de publicado não há o que repetir.
		if (row.status === "PUBLICADO") {
			return c.json({
				success: true,
				result: { instanceId: null, status: "already-published" },
			});
		}

		// Id determinístico: repetir a chamada devolve a mesma instância.
		const stamp = row.updated_at.replace(/[^0-9A-Za-z]/g, "");
		const instanceId = `publish-${body.recordId}-${stamp}`.slice(0, 100);
		// Idempotente sem depender de texto de erro: reaproveita a instância se ela já existe.
		let instance: WorkflowInstance | undefined;
		try {
			instance = await c.env.HUB_PUBLISH_WORKFLOW.get(instanceId);
		} catch {
			instance = undefined; // não existe ainda
		}
		if (!instance) {
			try {
				instance = await c.env.HUB_PUBLISH_WORKFLOW.create({
					id: instanceId,
					params: { recordId: body.recordId, actor: c.get("actor").email },
				});
			} catch (err) {
				log("error", "workflow.create_failed", {
					requestId: c.get("requestId"),
					error: err instanceof Error ? err.message : "unknown",
				});
				return apiError(c, 503, ERR.unavailable, "Workflow unavailable");
			}
		}
		const s = await instance.status();
		return c.json(
			{ success: true, result: { instanceId, status: s.status } },
			202,
		);
	}
}

export class PublishStatus extends OpenAPIRoute {
	schema = {
		tags: ["Workflows"],
		summary: "Status de uma publicação",
		request: { params: z.object({ id: instanceIdParam }) },
		responses: {
			"200": {
				description: "Status",
				content: { "application/json": { schema: statusOut } },
			},
		},
	};
	async handle(c: AppContext) {
		const { params } = await this.getValidatedData<typeof this.schema>();
		try {
			const instance = await c.env.HUB_PUBLISH_WORKFLOW.get(params.id);
			const s = await instance.status();
			return c.json({
				success: true,
				result: {
					instanceId: params.id,
					status: s.status,
					...(s.error ? { error: String(s.error.message ?? s.error) } : {}),
				},
			});
		} catch {
			return apiError(c, 404, ERR.notFound, "Workflow instance not found");
		}
	}
}

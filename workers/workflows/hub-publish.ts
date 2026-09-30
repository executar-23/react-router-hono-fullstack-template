// Base: vendor/cloudflare-templates/workflows-starter-template (worker/workflow.ts)
// Adaptado: sem Durable Object/WebSocket (o status é consultado por polling).
import {
	WorkflowEntrypoint,
	type WorkflowEvent,
	type WorkflowStep,
} from "cloudflare:workers";
import { NonRetryableError } from "cloudflare:workflows";

export interface HubPublishParams {
	recordId: string;
	actor: string;
}

/** Status a partir dos quais um conteúdo pode ser publicado. */
export const PUBLISHABLE = ["ACEITO", "VALIDADA", "PRONTO", "AGENDADO"];

interface PublishEnv {
	DB: D1Database;
}

export class HubPublishWorkflow extends WorkflowEntrypoint<
	PublishEnv,
	HubPublishParams
> {
	async run(event: WorkflowEvent<HubPublishParams>, step: WorkflowStep) {
		const { recordId, actor } = event.payload;
		const db = this.env.DB;

		// 1. Validar: o conteúdo existe e está em um status publicável.
		const title = await step.do("validate", async () => {
			const row = await db
				.prepare("SELECT data FROM records WHERE module = 'content' AND id = ?")
				.bind(recordId)
				.first<{ data: string }>();
			if (!row) throw new NonRetryableError("content not found");
			const data = JSON.parse(row.data) as Record<string, unknown>;
			const status = String(data.Status_editorial ?? "");
			if (status !== "PUBLICADO" && !PUBLISHABLE.includes(status)) {
				throw new NonRetryableError(`status ${status || "vazio"} não é publicável`);
			}
			return String(data.Titulo_final || data.Titulo_trabalho || recordId);
		});

		// 2. Atualizar status (idempotente: define um valor constante).
		await step.do(
			"set-status",
			{ retries: { limit: 3, delay: "2 seconds", backoff: "exponential" } },
			async () => {
				await db
					.prepare(
						`UPDATE records
						 SET data = json_set(data, '$.Status_editorial', 'PUBLICADO'),
						     updated_at = ?
						 WHERE module = 'content' AND id = ?`,
					)
					.bind(new Date().toISOString(), recordId)
					.run();
			},
		);

		// 3. Auditoria (idempotente: uma linha por instância de workflow).
		await step.do("audit", async () => {
			await db
				.prepare(
					`INSERT INTO audit_log (at, actor, action, module, record_id, detail)
					 SELECT ?, ?, 'publish', 'content', ?, ?
					 WHERE NOT EXISTS (
					   SELECT 1 FROM audit_log WHERE action = 'publish' AND detail = ?
					 )`,
				)
				.bind(new Date().toISOString(), actor, recordId, event.instanceId, event.instanceId)
				.run();
		});

		return { recordId, title, status: "PUBLICADO" };
	}
}

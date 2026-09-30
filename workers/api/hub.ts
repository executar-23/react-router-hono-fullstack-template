import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { apiError, ERR, log } from "./http";
import { codeFieldOf, isModuleId, MODULE_IDS } from "./modules";
import type { Actor, AppContext } from "./types";

// ---------- esquemas ----------
const fieldValue = z.union([z.string().max(20000), z.number(), z.null()]);
const fields = z
	.record(z.string().regex(/^[A-Za-z0-9_]{1,64}$/), fieldValue)
	.refine((v) => Object.keys(v).length <= 100, "too many fields");

const moduleParam = z.enum(MODULE_IDS);
const idParam = z.string().regex(/^[A-Za-z0-9_-]{1,64}$/);

const recordOut = z.object({ _id: z.string() }).passthrough();
const ok = (result: z.ZodTypeAny) =>
	z.object({ success: z.literal(true), result });

type Row = { id: string; data: string };
const toRecord = (r: Row) => ({ _id: r.id, ...JSON.parse(r.data) });

const now = () => new Date().toISOString();

function auditStmt(
	db: D1Database,
	actor: Actor,
	action: string,
	module: string | null,
	recordId: string | null,
	detail?: string,
) {
	return db
		.prepare(
			"INSERT INTO audit_log (at, actor, action, module, record_id, detail) VALUES (?, ?, ?, ?, ?, ?)",
		)
		.bind(now(), actor.email, action, module, recordId, detail ?? null);
}

function codeOf(moduleId: string, data: Record<string, unknown>) {
	const field = codeFieldOf(moduleId);
	const v = field ? data[field] : undefined;
	return typeof v === "string" && v.trim() !== "" ? v : null;
}

function isUniqueViolation(err: unknown) {
	return err instanceof Error && /UNIQUE constraint failed/i.test(err.message);
}

async function guarded(c: AppContext, fn: () => Promise<Response>) {
	try {
		return await fn();
	} catch (err) {
		if (isUniqueViolation(err)) {
			return apiError(c, 409, ERR.conflict, "Code already in use");
		}
		const message = err instanceof Error ? err.message : "unknown";
		if (!/^D1_|D1 |Network connection lost|storage/i.test(message)) {
			throw err; // defeito nosso: vira 500 no handler global (e é logado lá)
		}
		log("error", "hub.db_error", { requestId: c.get("requestId"), error: message });
		return apiError(c, 503, ERR.unavailable, "Database unavailable");
	}
}

// ---------- endpoints ----------
export class HubListAll extends OpenAPIRoute {
	schema = {
		tags: ["Hub"],
		summary: "Todos os módulos (uma consulta)",
		responses: {
			"200": {
				description: "Registros por módulo",
				content: {
					"application/json": {
						schema: ok(z.record(z.array(recordOut))),
					},
				},
			},
		},
	};
	async handle(c: AppContext) {
		return guarded(c, async () => {
			const { results } = await c.env.DB.prepare(
				"SELECT module, id, data FROM records ORDER BY module, updated_at DESC, id",
			).all<Row & { module: string }>();
			const out: Record<string, unknown[]> = {};
			for (const id of MODULE_IDS) out[id] = [];
			for (const r of results) (out[r.module] ??= []).push(toRecord(r));
			const vocabRows = await c.env.DB.prepare(
				"SELECT name, items FROM vocab",
			).all<{ name: string; items: string }>();
			const vocab = Object.fromEntries(
				vocabRows.results.map((v) => [v.name, JSON.parse(v.items)]),
			);
			return c.json({ success: true, result: out, vocab });
		});
	}
}

export class HubListModule extends OpenAPIRoute {
	schema = {
		tags: ["Hub"],
		summary: "Registros de um módulo",
		request: { params: z.object({ module: moduleParam }) },
		responses: {
			"200": {
				description: "Registros",
				content: {
					"application/json": { schema: ok(z.array(recordOut)) },
				},
			},
		},
	};
	async handle(c: AppContext) {
		const { params } = await this.getValidatedData<typeof this.schema>();
		return guarded(c, async () => {
			const { results } = await c.env.DB.prepare(
				"SELECT id, data FROM records WHERE module = ? ORDER BY updated_at DESC, id",
			)
				.bind(params.module)
				.all<Row>();
			return c.json({ success: true, result: results.map(toRecord) });
		});
	}
}

export class HubUpsertRecord extends OpenAPIRoute {
	schema = {
		tags: ["Hub"],
		summary: "Cria ou substitui um registro (idempotente; último a gravar vence)",
		request: {
			params: z.object({ module: moduleParam, id: idParam }),
			body: {
				content: { "application/json": { schema: z.object({ fields }) } },
			},
		},
		responses: {
			"200": {
				description: "Registro gravado",
				content: { "application/json": { schema: ok(recordOut) } },
			},
			"409": { description: "Código já usado neste módulo" },
		},
	};
	async handle(c: AppContext) {
		const { params, body } = await this.getValidatedData<typeof this.schema>();
		const data = body.fields as Record<string, unknown>;
		delete data._id;
		return guarded(c, async () => {
			const db = c.env.DB;
			await db.batch([
				db
					.prepare(
						`INSERT INTO records (module, id, code, data, updated_at) VALUES (?, ?, ?, ?, ?)
						 ON CONFLICT (module, id) DO UPDATE SET code = excluded.code, data = excluded.data, updated_at = excluded.updated_at`,
					)
					.bind(
						params.module,
						params.id,
						codeOf(params.module, data),
						JSON.stringify(data),
						now(),
					),
				auditStmt(db, c.get("actor"), "upsert", params.module, params.id),
			]);
			return c.json({ success: true, result: { _id: params.id, ...data } });
		});
	}
}

export class HubDeleteRecord extends OpenAPIRoute {
	schema = {
		tags: ["Hub"],
		summary: "Exclui um registro (idempotente)",
		request: { params: z.object({ module: moduleParam, id: idParam }) },
		responses: {
			"200": {
				description: "Resultado",
				content: {
					"application/json": {
						schema: ok(z.object({ deleted: z.boolean() })),
					},
				},
			},
		},
	};
	async handle(c: AppContext) {
		const { params } = await this.getValidatedData<typeof this.schema>();
		return guarded(c, async () => {
			const db = c.env.DB;
			const [res] = await db.batch([
				db
					.prepare("DELETE FROM records WHERE module = ? AND id = ?")
					.bind(params.module, params.id),
				auditStmt(db, c.get("actor"), "delete", params.module, params.id),
			]);
			return c.json({
				success: true,
				result: { deleted: (res.meta.changes ?? 0) > 0 },
			});
		});
	}
}

export class VocabList extends OpenAPIRoute {
	schema = {
		tags: ["Vocab"],
		summary: "Listas controladas",
		responses: {
			"200": {
				description: "Vocabulários",
				content: {
					"application/json": { schema: ok(z.record(z.array(z.string()))) },
				},
			},
		},
	};
	async handle(c: AppContext) {
		return guarded(c, async () => {
			const { results } = await c.env.DB.prepare(
				"SELECT name, items FROM vocab ORDER BY name",
			).all<{ name: string; items: string }>();
			return c.json({
				success: true,
				result: Object.fromEntries(
					results.map((v) => [v.name, JSON.parse(v.items)]),
				),
			});
		});
	}
}

export class VocabPut extends OpenAPIRoute {
	schema = {
		tags: ["Vocab"],
		summary: "Substitui uma lista controlada",
		request: {
			params: z.object({ name: z.string().regex(/^[A-Za-z0-9_]{1,64}$/) }),
			body: {
				content: {
					"application/json": {
						schema: z.object({
							items: z.array(z.string().min(1).max(100)).max(500),
						}),
					},
				},
			},
		},
		responses: {
			"200": {
				description: "Lista gravada",
				content: {
					"application/json": {
						schema: ok(z.object({ name: z.string(), items: z.array(z.string()) })),
					},
				},
			},
		},
	};
	async handle(c: AppContext) {
		const { params, body } = await this.getValidatedData<typeof this.schema>();
		return guarded(c, async () => {
			const db = c.env.DB;
			await db.batch([
				db
					.prepare(
						`INSERT INTO vocab (name, items, updated_at) VALUES (?, ?, ?)
						 ON CONFLICT (name) DO UPDATE SET items = excluded.items, updated_at = excluded.updated_at`,
					)
					.bind(params.name, JSON.stringify(body.items), now()),
				auditStmt(db, c.get("actor"), "vocab.put", null, params.name),
			]);
			return c.json({
				success: true,
				result: { name: params.name, items: body.items },
			});
		});
	}
}

export class HubImport extends OpenAPIRoute {
	schema = {
		tags: ["Hub"],
		summary: "Substitui todos os dados (importação de JSON exportado)",
		request: {
			body: {
				content: {
					"application/json": {
						schema: z.object({
							data: z.record(z.array(fields)),
							vocab: z.record(z.array(z.string().max(100)).max(500)).optional(),
						}),
					},
				},
			},
		},
		responses: {
			"200": {
				description: "Importado",
				content: {
					"application/json": {
						schema: ok(z.object({ records: z.number() })),
					},
				},
			},
		},
	};
	async handle(c: AppContext) {
		const { body } = await this.getValidatedData<typeof this.schema>();
		const db = c.env.DB;
		const stamp = now();
		const total = Object.values(body.data).reduce((n, rows) => n + rows.length, 0);
		if (total > 2000) {
			return apiError(c, 400, ERR.badRequest, "Too many records (max 2000)");
		}
		const stmts: D1PreparedStatement[] = [db.prepare("DELETE FROM records")];
		let count = 0;
		for (const [moduleId, rows] of Object.entries(body.data)) {
			if (!isModuleId(moduleId)) {
				return apiError(c, 400, ERR.badRequest, `Unknown module: ${moduleId}`);
			}
			for (const row of rows) {
				const data = { ...(row as Record<string, unknown>) };
				const id =
					typeof data._id === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(data._id)
						? data._id
						: crypto.randomUUID();
				delete data._id;
				stmts.push(
					db
						.prepare(
							"INSERT INTO records (module, id, code, data, updated_at) VALUES (?, ?, ?, ?, ?)",
						)
						.bind(moduleId, id, codeOf(moduleId, data), JSON.stringify(data), stamp),
				);
				count += 1;
			}
		}
		if (body.vocab) {
			stmts.push(db.prepare("DELETE FROM vocab"));
			for (const [name, items] of Object.entries(body.vocab)) {
				stmts.push(
					db
						.prepare("INSERT INTO vocab (name, items, updated_at) VALUES (?, ?, ?)")
						.bind(name, JSON.stringify(items), stamp),
				);
			}
		}
		stmts.push(auditStmt(db, c.get("actor"), "import", null, null, String(count)));
		return guarded(c, async () => {
			await db.batch(stmts);
			return c.json({ success: true, result: { records: count } });
		});
	}
}

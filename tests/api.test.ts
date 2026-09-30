import { env, SELF } from "cloudflare:test";
import { beforeEach, describe, expect, it } from "vitest";
import seedSql from "../db/seed.sql?raw";

const ORIGIN = new URL(env.ALLOWED_ORIGIN).origin;
const BASE = "http://local.test/api";

type Init = { method?: string; body?: unknown; cookie?: string | null; origin?: string | null };

function call(path: string, { method = "GET", body, cookie = "hub_at=admin-token", origin = ORIGIN }: Init = {}) {
	const headers: Record<string, string> = { "content-type": "application/json" };
	if (cookie) headers.cookie = cookie;
	if (origin) headers.origin = origin;
	return SELF.fetch(`${BASE}${path}`, {
		method,
		headers,
		body: body === undefined ? undefined : JSON.stringify(body),
	});
}
const json = async <T = any>(r: Response) => (await r.json()) as T;

beforeEach(async () => {
	await env.DB.batch([
		env.DB.prepare("DELETE FROM records"),
		env.DB.prepare("DELETE FROM vocab"),
	]);
});

describe("público", () => {
	it("GET /health responde ok sem login", async () => {
		const r = await call("/health", { cookie: null });
		expect(r.status).toBe(200);
		expect((await json(r)).result.status).toBe("ok");
		expect(r.headers.get("x-request-id")).toBeTruthy();
	});
});

describe("autenticação e autorização", () => {
	it("sem cookie → 401", async () => {
		const r = await call("/hub", { cookie: null });
		expect(r.status).toBe(401);
		expect((await json(r)).errors[0].code).toBe(4010);
	});
	it("token inválido → 401", async () => {
		expect((await call("/hub", { cookie: "hub_at=lixo" })).status).toBe(401);
	});
	it("usuário que não é o administrador → 403", async () => {
		expect((await call("/hub", { cookie: "hub_at=other-token" })).status).toBe(403);
	});
	it("escrita sem Origin ou com Origin errado → 403", async () => {
		const body = { fields: { Titulo: "x" } };
		const put = (origin: string | null) =>
			call("/hub/content/abc", { method: "PUT", body, origin });
		expect((await put(null)).status).toBe(403);
		expect((await put("https://evil.example")).status).toBe(403);
	});
	it("documentação e OpenAPI exigem só o esperado", async () => {
		const r = await call("/openapi.json", { cookie: null });
		expect(r.status).toBe(200);
		expect((await json(r)).info.title).toBe("Hub Editorial API");
	});
});

describe("registros", () => {
	it("PUT cria, GET lista, PUT repetido é idempotente e atualiza", async () => {
		const fields = { Content_ID: "CNT-T-1", Titulo_trabalho: "Teste", Status_editorial: "IDEIA" };
		const a = await call("/hub/content/t1", { method: "PUT", body: { fields } });
		expect(a.status).toBe(200);
		const b = await call("/hub/content/t1", {
			method: "PUT",
			body: { fields: { ...fields, Titulo_trabalho: "Teste 2" } },
		});
		expect(b.status).toBe(200);
		const list = await json(await call("/hub/content"));
		expect(list.result).toHaveLength(1);
		expect(list.result[0]).toMatchObject({ _id: "t1", Titulo_trabalho: "Teste 2" });
	});

	it("código duplicado no mesmo módulo → 409", async () => {
		const f = { Content_ID: "CNT-DUP" };
		expect((await call("/hub/content/a", { method: "PUT", body: { fields: f } })).status).toBe(200);
		const r = await call("/hub/content/b", { method: "PUT", body: { fields: f } });
		expect(r.status).toBe(409);
		expect((await json(r)).errors[0].code).toBe(4090);
	});

	it("módulo desconhecido e corpo inválido → 400", async () => {
		expect((await call("/hub/nope", { method: "GET" })).status).toBe(400);
		expect((await call("/hub/content/x", { method: "PUT", body: { fields: { "bad key!": "x" } } })).status).toBe(400);
		expect((await call("/hub/content/x", { method: "PUT", body: {} })).status).toBe(400);
	});

	it("DELETE é idempotente", async () => {
		await call("/hub/brief/d1", { method: "PUT", body: { fields: { Titulo: "x" } } });
		expect((await json(await call("/hub/brief/d1", { method: "DELETE" }))).result.deleted).toBe(true);
		expect((await json(await call("/hub/brief/d1", { method: "DELETE" }))).result.deleted).toBe(false);
	});

	it("GET /hub devolve todos os módulos (uma consulta) e o vocabulário", async () => {
		await call("/hub/brief/b1", { method: "PUT", body: { fields: { Titulo: "B" } } });
		await call("/vocab/prioridade", { method: "PUT", body: { items: ["ALTA", "BAIXA"] } });
		const all = await json(await call("/hub"));
		expect(all.result.brief).toHaveLength(1);
		expect(all.result.content).toEqual([]);
		expect(all.vocab.prioridade).toEqual(["ALTA", "BAIXA"]);
	});

	it("import substitui tudo e rejeita módulo desconhecido", async () => {
		await call("/hub/brief/old", { method: "PUT", body: { fields: { Titulo: "velho" } } });
		const ok = await call("/hub/import", {
			method: "POST",
			body: { data: { brief: [{ Titulo: "novo" }] }, vocab: { canal: ["Blog"] } },
		});
		expect(ok.status).toBe(200);
		const brief = await json(await call("/hub/brief"));
		expect(brief.result.map((r: any) => r.Titulo)).toEqual(["novo"]);
		const bad = await call("/hub/import", { method: "POST", body: { data: { nope: [] } } });
		expect(bad.status).toBe(400);
	});
});

describe("auditoria e seed", () => {
	it("audit_log registra escritas e é append-only", async () => {
		await call("/hub/brief/au1", { method: "PUT", body: { fields: { Titulo: "x" } } });
		const row = await env.DB.prepare(
			"SELECT actor, action FROM audit_log WHERE record_id = 'au1'",
		).first<{ actor: string; action: string }>();
		expect(row).toEqual({ actor: "executar-rotina@outlook.com", action: "upsert" });
		await expect(env.DB.prepare("UPDATE audit_log SET actor = 'x'").run()).rejects.toThrow(/append-only/);
		await expect(env.DB.prepare("DELETE FROM audit_log").run()).rejects.toThrow(/append-only/);
	});

	it("o seed é idempotente (rodar duas vezes não duplica)", async () => {
		const statements = seedSql
			.split("\n")
			.filter((l) => l.startsWith("INSERT"))
			.join("\n");
		await env.DB.exec(statements);
		const first = await env.DB.prepare("SELECT COUNT(*) AS n FROM records").first<{ n: number }>();
		await env.DB.exec(statements);
		const second = await env.DB.prepare("SELECT COUNT(*) AS n FROM records").first<{ n: number }>();
		expect(first!.n).toBeGreaterThan(0);
		expect(second!.n).toBe(first!.n);
	});
});

describe("workflow de publicação", () => {
	async function waitDone(id: string) {
		for (let i = 0; i < 40; i++) {
			const r = await json(await call(`/workflows/${id}`));
			if (["complete", "errored", "terminated"].includes(r.result.status)) return r.result;
			await new Promise((res) => setTimeout(res, 100));
		}
		throw new Error("workflow não terminou");
	}

	it("publica um conteúdo PRONTO e é reexecutável sem duplicar", async () => {
		await call("/hub/content/p1", {
			method: "PUT",
			body: { fields: { Content_ID: "CNT-P-1", Titulo_trabalho: "Pub", Status_editorial: "PRONTO" } },
		});
		const start = await json(await call("/workflows/publish", { method: "POST", body: { recordId: "p1" } }));
		const again = await json(await call("/workflows/publish", { method: "POST", body: { recordId: "p1" } }));
		// Mesma instância (ainda em execução) ou "já publicado": nunca uma segunda execução.
		expect([start.result.instanceId, null]).toContain(again.result.instanceId);
		const done = await waitDone(start.result.instanceId);
		expect(done.status).toBe("complete");
		const rec = await json(await call("/hub/content"));
		expect(rec.result[0].Status_editorial).toBe("PUBLICADO");
		const audits = await env.DB.prepare(
			"SELECT COUNT(*) AS n FROM audit_log WHERE action = 'publish' AND record_id = 'p1'",
		).first<{ n: number }>();
		expect(audits!.n).toBe(1);
	});

	it("conteúdo inexistente → 404; status não publicável → workflow falha sem alterar", async () => {
		expect((await call("/workflows/publish", { method: "POST", body: { recordId: "nada" } })).status).toBe(404);
		await call("/hub/content/p2", {
			method: "PUT",
			body: { fields: { Content_ID: "CNT-P-2", Status_editorial: "IDEIA" } },
		});
		const start = await json(await call("/workflows/publish", { method: "POST", body: { recordId: "p2" } }));
		const done = await waitDone(start.result.instanceId);
		expect(done.status).toBe("errored");
		const rec = await json(await call("/hub/content"));
		expect(rec.result[0].Status_editorial).toBe("IDEIA");
	});
});

describe("rotas de sessão (/api/auth)", () => {
	it("/auth/me: 401 sem cookie, 403 para não-admin, 200 para o admin", async () => {
		expect((await call("/auth/me", { cookie: null })).status).toBe(401);
		expect((await call("/auth/me", { cookie: "hub_at=other-token" })).status).toBe(403);
		const ok = await call("/auth/me");
		expect(ok.status).toBe(200);
		expect((await json(ok)).result.email).toBe("executar-rotina@outlook.com");
	});

	it("/auth/me com token inválido → 401 e limpa os cookies", async () => {
		const r = await call("/auth/me", { cookie: "hub_at=lixo" });
		expect(r.status).toBe(401);
		expect(r.headers.get("set-cookie") ?? "").toMatch(/hub_at=;/);
	});

	it("/auth/logout exige Origin e limpa a sessão", async () => {
		expect((await call("/auth/logout", { method: "POST", origin: null })).status).toBe(403);
		const r = await call("/auth/logout", { method: "POST" });
		expect(r.status).toBe(200);
		expect(r.headers.get("set-cookie") ?? "").toMatch(/hub_at=;/);
	});

	it("/auth/callback com state inválido ou sem cookie → 400", async () => {
		const r = await SELF.fetch(`${BASE}/auth/callback?code=abc&state=nope`, { redirect: "manual" });
		expect(r.status).toBe(400);
		expect((await json(r)).errors[0].code).toBe(4000);
	});
});

describe("limites e validações extras", () => {
	it("GET /workflows/:id só aceita ids de publicação (prefixo publish-)", async () => {
		expect((await call("/workflows/qualquer-coisa")).status).toBe(400);
		expect((await call("/workflows/publish-inexistente")).status).toBe(404);
	});

	it("import acima do teto → 400 sem tocar nos dados", async () => {
		await call("/hub/brief/keep", { method: "PUT", body: { fields: { Titulo: "fica" } } });
		const rows = Array.from({ length: 2001 }, (_, i) => ({ Titulo: `t${i}` }));
		const r = await call("/hub/import", { method: "POST", body: { data: { brief: rows } } });
		expect(r.status).toBe(400);
		const list = await json(await call("/hub/brief"));
		expect(list.result.map((x: any) => x._id)).toEqual(["keep"]);
	});
});

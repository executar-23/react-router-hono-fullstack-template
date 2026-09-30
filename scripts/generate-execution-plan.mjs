#!/usr/bin/env node
// Estratégia 07: gera 07-execucao/* e .handoff/backlog.md a partir da fonte única plan.source.json.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const src = JSON.parse(readFileSync("07-execucao/plan.source.json", "utf8"));
const ICON = { NOT_READY: "⬜", READY: "⬜", IN_PROGRESS: "🔄", BLOCKED: "⛔", USER_ACTION_REQUIRED: "⛔", DECLARED_DONE: "🟨", VERIFIED: "✅" };
const repo = "executar-23/react-router-hono-fullstack-template";
const gh = (n) => (n ? `[#${n}](https://github.com/${repo}/issues/${n})` : "A_DEFINIR");
const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
for (const d of ["EPICS", "ISSUES", "REGISTRIES"]) mkdirSync(`07-execucao/${d}`, { recursive: true });

const body = (x, kind) => `# ${x.id} — ${x.title}

- **Tipo:** ${kind}
- **Status:** ${x.status ?? "derivado das issues"}
- **Dono:** ${x.owner ?? "—"}
- **GitHub:** ${gh(x.github)}
${x.stages?.length ? `- **Estágios:** ${x.stages.join(", ")}\n` : ""}${x.gaps?.length ? `- **GAPs:** ${x.gaps.join(", ")}\n` : ""}${x.depends_on ? `- **Depende de:** ${x.depends_on.join(", ") || "—"}\n` : ""}${x.automation ? `- **Automação:** ${x.automation}\n` : ""}
## OBJECTIVE
${x.title}.

## INPUT
Contratos em \`vendor/agentic-package-v2/\` (workflow v0.2, taxonomia, checklists) e o stack atual (ADR-001).

## CONSTRAINTS
WIP=1; nada inventado (\`A_DEFINIR\`); nenhuma ação externa sem aprovação; divergências vão para \`07-execucao/DECISOES.md\`.

## EXECUTION
Ciclo agent-handoff: \`/plan\` → \`/execute\` → \`/verify\` (contexto limpo).

## OUTPUT CONTRACT / DoD
${x.dod}

## VALIDATION
Evidência registrada em \`REGISTRIES/evidence-log.md\` e no ESTADO: ${x.evidence ?? "ver issues"}.

## STOP CONDITIONS
Decisão que muda a arquitetura, ação externa sem aprovação, ou a mesma etapa falhar duas vezes.
`;

const rows = [];
const backlog = [];
for (const e of src.epics) {
	writeFileSync(`07-execucao/EPICS/${e.id}-${slug(e.title)}.md`, body(e, "Épico"));
	for (const i of e.issues) {
		writeFileSync(`07-execucao/ISSUES/${i.id}-${slug(i.title)}.md`, body({ ...i, stages: e.stages, gaps: e.gaps }, `Issue de ${e.id}`));
		rows.push(`| ${i.id} | ${e.id} | ${i.title} | ${ICON[i.status]} ${i.status} | ${i.owner} | ${i.evidence} | ${gh(i.github)} |`);
		if (i.status !== "VERIFIED") backlog.push(`- [${i.status === "IN_PROGRESS" ? "🔄" : " "}] #${i.github ?? i.id} ${i.id} ${i.title}`);
	}
}
const next = src.epics.flatMap((e) => e.issues).find((i) => ["READY", "IN_PROGRESS"].includes(i.status));
writeFileSync("07-execucao/ESTADO.md", `# ESTADO — ${src.target}

> Fonte única de progresso (Estratégia 07). Gerado de \`plan.source.json\` por \`scripts/generate-execution-plan.mjs\`; não editar à mão.
> Legenda: ⬜ pendente · 🔄 em execução · ⛔ bloqueado · 🟨 declarado · ✅ verificado. WIP = 1.

**Próximo nó elegível:** ${next ? `${next.id} — ${next.title}` : "nenhum"}

| Issue | Épico | Título | Status | Dono | Evidência | GitHub |
|---|---|---|---|---|---|---|
${rows.join("\n")}
`);
writeFileSync(".handoff/backlog.md", `# Improvement Backlog\n\n## ${new Date().toISOString().slice(0, 10)} (from 07-execucao)\n\n${backlog.join("\n")}\n`);

const REG = {
	"skill-dependency": "skill_id | version | source_repository | source_path | owner | stack | runtime | dependencies | connectors | tools | plugins | permissions | validation_state",
	agent: "agent_id | nome | papel | input | output | skills | tools | permissões | handoff",
	skill: "skill_id | nome | origem | versão | instalada em | status",
	"tool-connector-plugin": "nome | tipo | versão | disponível | autorizado | onde é usado",
	"permission-matrix": "agente/skill | recurso | leitura | escrita | ação externa | aprovação",
	workflow: "workflow_id | estágio | ator | gate | estado",
	risk: "risk_id | descrição | probabilidade | impacto | mitigação | dono",
	"run-log": "data | issue | ciclo | resultado | commit",
	"evidence-log": "data | issue | evidência | caminho/URL",
};
for (const [k, cols] of Object.entries(REG)) {
	const p = `07-execucao/REGISTRIES/${k}.md`;
	if (existsSync(p)) continue; // registries são vivos: gerados uma vez, depois editados
	writeFileSync(p, `# Registry — ${k}\n\nNada é inventado: campos sem fonte = \`A_DEFINIR\`.\n\n| ${cols} |\n|${cols.split("|").map(() => "---").join("|")}|\n`);
}
console.log(`07-execucao: ${rows.length} issues, próximo = ${next?.id ?? "—"}`);

#!/usr/bin/env node
// Regras da Estratégia 07 sobre plan.source.json (e ESTADO.md gerado dele).
import { readFileSync } from "node:fs";
const src = JSON.parse(readFileSync("07-execucao/plan.source.json", "utf8"));
const issues = src.epics.flatMap((e) => e.issues);
const ids = new Set(issues.map((i) => i.id));
const errors = [];
const STATES = ["NOT_READY", "READY", "IN_PROGRESS", "BLOCKED", "USER_ACTION_REQUIRED", "DECLARED_DONE", "VERIFIED"];
if (issues.filter((i) => i.status === "IN_PROGRESS").length > 1) errors.push("WIP > 1");
for (const i of issues) {
	if (!STATES.includes(i.status)) errors.push(`${i.id}: status inválido ${i.status}`);
	if (!i.owner) errors.push(`${i.id}: sem dono`);
	if (!i.evidence) errors.push(`${i.id}: sem evidência (use A_DEFINIR)`);
	if (i.status === "VERIFIED" && /A_DEFINIR/.test(i.evidence)) errors.push(`${i.id}: VERIFIED sem evidência`);
	for (const d of i.depends_on ?? []) if (!ids.has(d)) errors.push(`${i.id}: dependência desconhecida ${d}`);
	if (i.status === "VERIFIED") for (const d of i.depends_on ?? []) {
		const dep = issues.find((x) => x.id === d);
		if (dep && dep.status !== "VERIFIED") errors.push(`${i.id}: VERIFIED com dependência ${d} em ${dep.status}`);
	}
}
const estado = readFileSync("07-execucao/ESTADO.md", "utf8");
for (const i of issues) if (!estado.includes(`| ${i.id} |`)) errors.push(`${i.id}: fora do ESTADO.md (regere)`);
if (errors.length) { console.error("validate-execution-state FALHOU\n - " + errors.join("\n - ")); process.exit(1); }
console.log(`validate-execution-state ok — ${issues.length} issues`);

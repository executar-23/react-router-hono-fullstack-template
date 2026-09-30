#!/usr/bin/env node
// Gera db/seed.sql a partir de app/data/hub (seed do Hub). Idempotente: INSERT OR IGNORE.
// Ids estáveis (`<módulo>-<índice>`) coincidem com o seed local do frontend.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const modules = JSON.parse(readFileSync("app/data/hub/modules.json", "utf8"));
const seed = JSON.parse(readFileSync("app/data/hub/seed.json", "utf8"));
const q = (s) => `'${String(s).replaceAll("'", "''")}'`;
const stamp = "2026-01-01T00:00:00.000Z";
const lines = ["-- Gerado por scripts/generate-seed.mjs — não edite à mão."];

for (const m of modules) {
	(seed.seed[m.id] ?? []).forEach((row, i) => {
		const code = m.idField && typeof row[m.idField] === "string" ? row[m.idField] : "";
		lines.push(
			`INSERT OR IGNORE INTO records (module, id, code, data, updated_at) VALUES (${q(m.id)}, ${q(`${m.id}-${i}`)}, ${code ? q(code) : "NULL"}, ${q(JSON.stringify(row))}, ${q(stamp)});`,
		);
	});
}
for (const [name, items] of Object.entries(seed.vocab)) {
	lines.push(
		`INSERT OR IGNORE INTO vocab (name, items, updated_at) VALUES (${q(name)}, ${q(JSON.stringify(items))}, ${q(stamp)});`,
	);
}
mkdirSync("db", { recursive: true });
writeFileSync("db/seed.sql", lines.join("\n") + "\n");
console.log(`db/seed.sql: ${lines.length - 1} statements`);

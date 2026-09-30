#!/usr/bin/env node
// Gera docs/adr/INSTALLED.md com as versões instaladas (package.json × node_modules).
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const rows = (deps) =>
	Object.entries(deps ?? {})
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([name, range]) => {
			const p = `node_modules/${name}/package.json`;
			const v = existsSync(p) ? JSON.parse(readFileSync(p, "utf8")).version : "não instalado";
			return `| \`${name}\` | \`${range}\` | ${v} |`;
		})
		.join("\n");

const out = `# Dependências instaladas (geradas)

Gerado por \`node scripts/generate-installed.mjs\` — não edite à mão. Node ${process.version}.

## dependencies
| Pacote | Faixa | Instalado |
|---|---|---|
${rows(pkg.dependencies)}

## devDependencies
| Pacote | Faixa | Instalado |
|---|---|---|
${rows(pkg.devDependencies)}
`;
writeFileSync("docs/adr/INSTALLED.md", out);
console.log("docs/adr/INSTALLED.md atualizado");

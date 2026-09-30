#!/usr/bin/env node
// Garante (ADR-001 §Ambiente) que toda variável usada pelo código, declarada no wrangler ou exigida
// pelo deploy existe em todos os templates de ambiente, e que segredos só têm valor placeholder.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const PLACEHOLDERS = new Set(["", "CHANGE_ME", "TBD", "REPLACE_IN_PRODUCTION", "REPLACE_IN_PREVIEW"]);
const SECRET_KEY = /(KEY|TOKEN|SECRET|PASSWORD)/;
const EXTRA_REQUIRED = ["CLOUDFLARE_ACCOUNT_ID", "CLOUDFLARE_API_TOKEN", "CLOUD_AI_BASE_URL", "CLOUD_AI_API_KEY"];
const IGNORED_ENV = new Set(["MODE", "DEV", "PROD", "SSR", "BASE_URL"]);

const problems = [];
const stripJsonc = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const readJsonc = (p) => JSON.parse(stripJsonc(readFileSync(p, "utf8")));

function walk(dir, out = []) {
	if (!existsSync(dir)) return out;
	for (const name of readdirSync(dir)) {
		const p = join(dir, name);
		if (statSync(p).isDirectory()) walk(p, out);
		else if (/\.(ts|tsx|mjs)$/.test(name)) out.push(p);
	}
	return out;
}

function usedVars(files, bindings) {
	const found = new Set();
	for (const f of files) {
		const src = readFileSync(f, "utf8");
		for (const m of src.matchAll(/\b(?:c\.)?env\.([A-Z][A-Z0-9_]+)\b/g)) found.add(m[1]);
		for (const m of src.matchAll(/process\.env\.([A-Z][A-Z0-9_]+)/g)) found.add(m[1]);
	}
	for (const b of bindings) found.delete(b);
	for (const i of IGNORED_ENV) found.delete(i);
	return found;
}

function bindingsOf(cfg) {
	return new Set([
		...(cfg.d1_databases ?? []).map((d) => d.binding),
		...(cfg.kv_namespaces ?? []).map((k) => k.binding),
		...(cfg.workflows ?? []).map((w) => w.binding),
	]);
}

function parseEnvFile(path) {
	const map = new Map();
	for (const line of readFileSync(path, "utf8").split("\n")) {
		const m = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
		if (m) map.set(m[1], m[2].trim());
	}
	return map;
}

const main = readJsonc("wrangler.jsonc");
const auth = readJsonc("auth/wrangler.jsonc");
const mainVars = new Set([
	...usedVars([...walk("workers"), ...walk("app"), ...walk("shared")], bindingsOf(main)),
	...Object.keys(main.vars ?? {}),
]);
const authVars = new Set([
	...usedVars(walk("auth"), bindingsOf(auth)),
	...Object.keys(auth.vars ?? {}),
]);
const previewVars = Object.keys(main.previews?.vars ?? {});
for (const v of mainVars) if (!previewVars.includes(v) && !SECRET_KEY.test(v)) {
	problems.push(`wrangler.jsonc: previews.vars não define ${v}`);
}

const all = new Set([...mainVars, ...authVars, ...EXTRA_REQUIRED]);
const TEMPLATES = [
	".env.example", ".env.local.example", ".env.development.example", ".env.development",
	".env.test.example", ".env.test", ".env.preview.example", ".env.production.example",
];
for (const t of TEMPLATES) {
	if (!existsSync(t)) { problems.push(`falta ${t}`); continue; }
	const vars = parseEnvFile(t);
	for (const v of all) if (!vars.has(v)) problems.push(`${t}: falta ${v}`);
	for (const [k, val] of vars) {
		if (SECRET_KEY.test(k) && !PLACEHOLDERS.has(val)) problems.push(`${t}: ${k} parece um segredo real`);
	}
}
for (const [file, set] of [[".dev.vars.example", mainVars], ["auth/.dev.vars.example", authVars]]) {
	if (!existsSync(file)) { problems.push(`falta ${file}`); continue; }
	const vars = parseEnvFile(file);
	for (const v of set) if (!vars.has(v) && !SECRET_KEY.test(v)) problems.push(`${file}: falta ${v}`);
	for (const [k, val] of vars) {
		if (SECRET_KEY.test(k) && !PLACEHOLDERS.has(val)) problems.push(`${file}: ${k} parece um segredo real`);
	}
}
// Segredos não podem estar em wrangler vars.
for (const [name, cfg] of [["wrangler.jsonc", main], ["auth/wrangler.jsonc", auth]]) {
	for (const k of Object.keys(cfg.vars ?? {})) if (SECRET_KEY.test(k)) problems.push(`${name}: segredo ${k} em vars`);
}

if (problems.length) {
	console.error("check:env FALHOU\n - " + problems.join("\n - "));
	process.exit(1);
}
console.log(`check:env ok — ${all.size} variáveis em ${TEMPLATES.length + 2} arquivos`);

#!/usr/bin/env node
// Valida a instalação do workflow completo (ADR-001 §Instalação): plugin Backend Design,
// hooks, ferramentas e referências em vendor/. Não usa credenciais.
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const results = [];
const check = (name, fn) => {
	try {
		const detail = fn();
		results.push({ name, ok: true, detail: detail ?? "" });
	} catch (e) {
		results.push({ name, ok: false, detail: e.message });
	}
};
const same = (a, b) => readFileSync(a).equals(readFileSync(b));
const PLUGIN = "vendor/claude-plugins/backend-design";

check("plugin: cópia íntegra 0.2.0", () => {
	const v = JSON.parse(readFileSync(`${PLUGIN}/.claude-plugin/plugin.json`, "utf8")).version;
	if (v !== "0.2.0") throw new Error(`versão ${v}`);
	if (!existsSync(`${PLUGIN}/LICENSE`)) throw new Error("LICENSE ausente");
	return `versão ${v}`;
});
check("plugin: 13 skills instaladas em .claude/skills", () => {
	const names = readdirSync(`${PLUGIN}/skills`);
	for (const n of names) if (!same(`${PLUGIN}/skills/${n}/SKILL.md`, `.claude/skills/${n}/SKILL.md`)) throw new Error(`${n} divergente/ausente`);
	if (names.length !== 13) throw new Error(`${names.length} skills`);
	return names.length;
});
for (const [kind, n] of [["commands", 5], ["agents", 6]]) {
	check(`plugin: ${n} ${kind} instalados em .claude/${kind}`, () => {
		const files = readdirSync(`${PLUGIN}/${kind}`);
		for (const f of files) if (!same(`${PLUGIN}/${kind}/${f}`, `.claude/${kind}/${f}`)) throw new Error(`${f} divergente/ausente`);
		if (files.length !== n) throw new Error(`${files.length} arquivos`);
		return files.length;
	});
}
check("plugin: hooks idênticos à origem e ligados no settings.json", () => {
	const settings = JSON.parse(readFileSync(".claude/settings.json", "utf8"));
	const cmds = settings.hooks.PreToolUse.flatMap((h) => h.hooks.map((x) => x.command)).join("\n");
	for (const f of readdirSync(`${PLUGIN}/hooks`).filter((f) => f.endsWith(".py"))) {
		if (!same(`${PLUGIN}/hooks/${f}`, `.claude/hooks/${f}`)) throw new Error(`${f} divergente`);
		if (!cmds.includes(f)) throw new Error(`${f} não configurado`);
	}
});
check("hooks: python3 executa e sinaliza segredo (exit 0)", () => {
	const input = JSON.stringify({ tool_name: "Write", tool_input: { file_path: "/x/a.ts", content: "const k='AKIAABCDEFGHIJKLMNOP'" } });
	const out = execFileSync("python3", [".claude/hooks/check_security.py"], { input, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
	return out || "warn em stderr";
});
for (const t of ["workflows-starter-template", "chanfana-openapi-template", "d1-template", "openauth-template", "saas-admin-template", "remix-starter-template"]) {
	check(`vendor: ${t} com STATUS.md`, () => {
		const s = readFileSync(`vendor/cloudflare-templates/${t}/STATUS.md`, "utf8");
		const m = s.match(/`(BASE_FOR_INTEGRATION|REFERENCE_FOR_ADAPTATION)`/);
		if (!m) throw new Error("status ausente");
		return m[1];
	});
}
check("ADR-001 e inventário existem", () => {
	for (const f of ["docs/adr/ADR-001-hub-backend-cloudflare.md", "docs/adr/ENV-INVENTORY.md", "docs/adr/INSTALLED.md", "docs/adr/SECRETS.md"]) {
		if (!existsSync(f)) throw new Error(`${f} ausente`);
	}
});
for (const [name, args] of [["wrangler", ["wrangler", "--version"]], ["vitest", ["vitest", "--version"]], ["eslint", ["eslint", "--version"]]]) {
	check(`ferramenta: ${name}`, () => execFileSync("npx", ["--no-install", ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim().split("\n").pop());
}
check("dependências do backend instaladas", () => {
	const pkg = JSON.parse(readFileSync("package.json", "utf8"));
	const want = ["chanfana", "zod", "@openauthjs/openauth", "valibot", "hono"];
	return want.map((d) => {
		const p = join("node_modules", d, "package.json");
		if (!existsSync(p) || !pkg.dependencies[d]) throw new Error(`${d} ausente`);
		return `${d}@${JSON.parse(readFileSync(p, "utf8")).version}`;
	}).join(", ");
});

const width = Math.max(...results.map((r) => r.name.length));
for (const r of results) console.log(`${r.ok ? "✔" : "✘"} ${r.name.padEnd(width)}  ${r.detail}`);
const failed = results.filter((r) => !r.ok);
if (failed.length) {
	console.error(`\nvalidate:workflow FALHOU (${failed.length})`);
	process.exit(1);
}
console.log(`\nvalidate:workflow ok — ${results.length} verificações`);

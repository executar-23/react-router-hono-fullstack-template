import path from "node:path";
import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-pool-workers";
import { defineConfig } from "vitest/config";

const migrations = await readD1Migrations(path.join(__dirname, "migrations"));

export default defineConfig({
	plugins: [
		cloudflareTest({
			main: "./tests/worker.ts",
			wrangler: { configPath: "./wrangler.jsonc" },
			miniflare: {
				compatibilityFlags: ["nodejs_compat"],
				bindings: { MIGRATIONS: migrations },
			},
		}),
	],
	esbuild: { target: "esnext" },
	test: {
		include: ["tests/**/*.test.ts"],
		setupFiles: ["./tests/apply-migrations.ts"],
	},
});

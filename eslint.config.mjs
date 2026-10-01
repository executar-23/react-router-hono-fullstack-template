import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{
		// vendor/ = referências preservadas; .claude/ = plugin instalado (não é código do app).
		ignores: [
			"build/**",
			".react-router/**",
			".wrangler/**",
			"node_modules/**",
			"vendor/**",
			".claude/**",
			"worker-configuration.d.ts",
			// Clones do design system do blog (ADR-002/005): mantidos idênticos à origem.
			"app/components/ui/**",
			"app/components/plain/**",
			"app/lib/plain/**",
			"app/hooks/**",
			"app/components/design-system/component-gallery.tsx",
			"app/components/design-system/data-gallery.tsx",
		],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ["**/*.{ts,tsx}"],
		languageOptions: { globals: { ...globals.browser, ...globals.worker } },
		plugins: { "react-hooks": reactHooks },
		rules: {
			...reactHooks.configs.recommended.rules,
			// Ler localStorage/tema após a montagem (evita divergência de hidratação) é intencional.
			"react-hooks/set-state-in-effect": "off",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{ argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true },
			],
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-empty-object-type": "off",
		},
	},
	{
		files: ["scripts/**/*.mjs", "*.mjs"],
		languageOptions: { globals: globals.node },
	},
);

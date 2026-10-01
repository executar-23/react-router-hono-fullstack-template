# DESIGN_SYSTEM

Apontador da fonte de verdade do design system deste repositório (ADR-DS-ROOT-MIGRATION-001).
O registro legível por máquina está em `design-system.manifest.json`.

| Campo | Valor |
| --- | --- |
| SOURCE_REPOSITORY | `executar-23/Risco-cognitivo-blog` |
| SOURCE_BRANCH | `main` (ver nota abaixo) |
| SOURCE_COMMIT | `530afe1708ed24111f9b6756948908ab7e9b3afe` |
| CANONICAL_TOKEN_FILE | `app/app.css` |
| COMPONENT_DIRECTORY | `app/components/ui` |
| DESIGN_SYSTEM_ROUTE | `/admin/design-system` |
| CLASSIFICATION | `COMPATIBLE_NATIVE` |
| INTEGRATION_STATUS | `IMPLEMENTED_DEFAULT` |
| LAST_SYNC | 2026-10-01 |
| TARGET_COMMIT_BEFORE | `07ede47c1657292c7c69e677e4c650cdb3bd1c60` |

> Nota sobre a branch: em 2026-10-01 a default branch do GitHub da origem era
> `claude/youthful-archimedes-qksrsl` (`11f78e4`), ancestral direto da `main` (`530afe1`, 7 commits
> à frente). A `main` é a branch de integração declarada no `CLAUDE.md` da origem e traz a versão
> mais nova do design system (tokens `--area-*`, `ScrollArea` com `viewportProps`), por isso é a
> fonte usada aqui.

## Fonte canônica na origem

| Caminho na origem | Caminho aqui | Situação |
| --- | --- | --- |
| `src/styles/global.css` | `app/app.css` | idêntico (importado em `app/root.tsx`, entrypoint global) |
| `src/components/ui/` | `app/components/ui/` | idêntico; `sidebar.tsx` só troca o import de `VariantProps` para `import type` |
| `src/components/plain/` | `app/components/plain/` | idêntico |
| `src/lib/plain/` | `app/lib/plain/` | idêntico, exceto `remarkPlain.ts` (não há Markdown/MDX aqui) |
| `src/lib/utils.ts`, `src/hooks/` | `app/lib/utils.ts`, `app/hooks/` | idênticos |
| `src/components/design-system/` | `app/components/design-system/` | galerias idênticas + `catalog.tsx` (port da página Astro) e `theme-toggle.tsx` |
| `src/pages/admin/design-system.astro` | `app/routes/admin/design-system.tsx` | recriada como rota do React Router |
| `public/fonts/dm-sans/` | `public/fonts/dm-sans/` | idêntico |
| `components.json` | `components.json` | mesmos aliases; só `tailwind.css` aponta para `app/app.css` |
| `docs/design-system/` | `docs/design-system/` | idêntico (`ROUTES-HUB-WORKFLOW-001.md` vale só para a origem) |

## Regras

- Componente novo de UI parte de `app/components/ui` e dos tokens de `app/app.css`. Não criar cor, raio ou sombra local em página.
- Os clones (`ui/`, `plain/`, `lib/plain/`, `hooks/`, galerias) ficam idênticos à origem e fora do ESLint; para mudar, mude na origem e ressincronize.
- Ressincronizar: comparar com o commit da origem, copiar só os arquivos alterados e atualizar `SOURCE_COMMIT`, `LAST_SYNC` e o manifesto no mesmo commit.
- `/admin/design-system` existe só no app React Router (`npm run dev:fullstack` / `build:fullstack`). O preview estático (`npm run build`) não tem essa rota.

## Lacunas conhecidas

- Mood board e storyboard da origem usam imagens e rotas do blog; o catálogo traz no lugar a seção "Tema".
- `remarkPlain.ts` não foi copiado: o app não renderiza Markdown/MDX.
- `/admin/*` não tem guarda de autenticação, como na origem.

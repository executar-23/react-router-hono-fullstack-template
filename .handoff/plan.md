# Implementar o MVP do Sistema Editorial Agentic (código) com o workflow agent-handoff

> Created: 2026-09-30 · Author: plan skill (agent-handoff 0.4.2) — vira `.handoff/plan.md`
> Repo: executar-23/react-router-hono-fullstack-template · branch `claude/modest-turing-678xav` · PR #1

## Background

Implementar em código, no stack atual (React Router 7 + Hono/chanfana + D1 + OpenAuth + Cloudflare Workflows + DS do blog), o `APP-EDITORIAL-MVP-001` do pacote V2: uma campanha piloto percorre STG-000…180 com IDs, estados, entregáveis, gates humanos e evidência rastreáveis. Execução pelo ciclo **/setup-handoff → /plan → /execute → /verify** (estado em `.handoff/`), uma fase por ciclo, WIP=1 (Estratégia 07). O LLM não é o motor de estados: estados/gates/retries ficam no D1 + Workflows. Épicos e issues do plano são salvos no repo (`07-execucao/`) e no GitHub como parte da Fase 0.

## Phases

- [🔄] Phase 0: Tooling — instalar agent-handoff, `.handoff/config.md`, pacote V2 (texto) em `vendor/`, `07-execucao/` (ESTADO + épicos/issues) + GitHub Issues
- [ ] Phase 1: Modelo de dados da campanha (D1 migration `0002_campaign.sql`)
- [ ] Phase 2: API de campanha (chanfana) + máquina de estados
- [ ] Phase 3: Workflow de campanha (Cloudflare Workflows) com gates humanos
- [ ] Phase 4: UI `/campanhas` no Hub (DS do blog)
- [ ] Phase 5: Plano Operacional (CSV) e analytics mínimos + ADR-002 + verificação final
- [ ] Phase 6: **Deploy de produção** (autorizado pelo usuário; repo alvo confirmado)

## Change list — Phase 6 (deploy de produção)

1. Pré-condição: `npm run check` verde, CI e Workers Builds verdes no head do PR #1.
2. D1 remoto (`hub-editorial-db`): aplicar `0001` (já aplicada) e `0002_campaign.sql` + `db/stages.sql` + `db/seed.sql` via MCP Cloudflare (idempotentes).
3. Worker de auth `hub-editorial-auth`: build com `wrangler deploy --dry-run --outdir` e upload pela API Cloudflare (MCP `cloudflare.execute`) com bindings `AUTH_DB`, `AUTH_STORAGE`, vars; sem `RESEND_API_KEY` o login falha fechado (registrado como pendência do usuário).
4. App: merge do PR #1 em `main` (sai do rascunho) → Workers Builds faz o deploy de produção de `react-router-hono-fullstack-template`; se o build de produção não estiver ligado a `main`, disparar build de produção pela API de builds.
5. Verificar em produção: `GET /api/health` = 200, `GET /api/hub` sem login = 401, `/` renderiza, `/api/openapi.json` = 200; registrar evidência em `07-execucao/REGISTRIES/evidence-log.md` e `ESTADO.md`.
6. Rollback: `wrangler rollback`/versão anterior pela API; migrações são aditivas.

## Change list — Phase 0 (atual)

### `vendor/claude-plugins/agent-handoff/`, `.claude/skills/{setup-handoff,plan,execute,verify}/`, `.claude/hooks/auto-approve-handoff.js`, `.claude/settings.json` — Create/Modify
Instalação idêntica ao padrão do Backend Design (cópia íntegra + STATUS.md; hook só para `.handoff/**`). `scripts/validate-workflow.mjs` passa a checar o plugin.
- **Risk**: medium — permissão de escrita automática em `.handoff/**`. **Rollback**: remover a entrada do hook.

### `.handoff/config.md` — Create
`test: npm test` · `typecheck: npm run typecheck` · `lint: npm run lint` · `build: npm run build` · `response_language: pt-BR` · convention_docs: `docs/adr/ADR-001-hub-backend-cloudflare.md`, `README.md`.

### `vendor/agentic-package-v2/` — Create
Só MD/JSON/CSV/TXT do pacote + `STATUS.md` com binários omitidos e checksums.

### `07-execucao/` + `.handoff/backlog.md` + GitHub — Create
`plan.source.json` → `scripts/generate-execution-plan.mjs` gera `ESTADO.md`, `EPICS/`, `ISSUES/`, `REGISTRIES/` (A_DEFINIR), `DECISOES.md`, `backlog.md`; `scripts/validate-execution-state.mjs`. Issues/épicos/milestone `APP-EDITORIAL-MVP-001` no GitHub; cada fase 1–5 abaixo = uma issue.

## Change list — Phases 1–5 (detalhadas no /plan de cada fase)

- **P1** `migrations/0002_campaign.sql` (aditiva): `campaigns(id CMP-…, pillar, objective, status)`, `deliverables(id DLV-…, campaign_id FK, stage_id STG-…, type, status, payload JSON, evidence JSON)`, `stage_runs(campaign_id, stage_id, status NOT_READY|READY|IN_PROGRESS|BLOCKED|USER_ACTION_REQUIRED|DECLARED_DONE|VERIFIED, updated_at)`; CHECKs de estado, FKs, índices. Seed `db/stages.sql` com os 19 estágios do `03_EDITORIAL_CAMPAIGN_WORKFLOW_v0.2.json`. Aplicar local, preview e remoto (IF NOT EXISTS). `/review-migration`.
- **P2** `workers/api/campaigns.ts`: `POST /api/campaigns`, `GET /api/campaigns/:id` (estágios + entregáveis), `PUT /api/campaigns/:id/deliverables/:dlv`, `POST /api/campaigns/:id/stages/:stg/approve` (gate humano), transições validadas por tabela (sem pular estágio; VERIFIED exige evidência). Reusa `requireAdmin`, `apiError`, `guarded`, `auditStmt` de `workers/api/hub.ts`/`session.ts`.
- **P3** `workers/workflows/campaign.ts` (`CampaignWorkflow`): um `step.do` por estágio automatizável (CLP) e `step.waitForEvent("approve-STG-xxx")` nos estágios do Creator (STG-000/030/040/050/060/140); estágios com ator `A_DEFINIR` (vídeo, visual) ficam `USER_ACTION_REQUIRED`. Binding `CAMPAIGN_WORKFLOW` em `wrangler.jsonc`. Nada publica externamente.
- **P4** `app/components/hub/campaigns/*` + item de navegação "Campanhas": lista, criação, linha do tempo dos 19 estágios (status em texto + pill), aprovar gate, anexar evidência. Só primitivos do DS (`Button`, `Callout`, `ds-table`).
- **P5** `GET /api/campaigns/:id/plan.csv` (Plano Operacional Rastreável com campaign_id/content_id/asset_id/…/status/depends_on/evidence), painel de contagens por estado; ADR-002; README.

## Parallelization

- Group A: Phase 0 (tooling/docs) · Group B (depende de A): P1 → P2 → P3 → P4 → P5 (sequencial, WIP=1).

## Test strategy

- `tests/campaign.test.ts` (vitest-pool-workers): criação, transições válidas/ inválidas (409), gate humano via evento, VERIFIED sem evidência → 400, CSV com cabeçalho e IDs, auth 401/403.
- Suíte existente (22 testes) continua verde; `validate:workflow`, `validate-execution-state`.

## Verification plan

- `npm test` — todos passam
- `npm run lint` — limpo
- `npm run build` && `npx wrangler deploy --dry-run` — ok
- `npm run validate:workflow` && `node scripts/validate-execution-state.mjs` — ok
- /verify de cada fase em subagente com contexto limpo → `.handoff/review.md`

## Não faz

Publicação de conteúdo, e-mail, escrita em `Sas-Executar/*`, dependência de Skill inventada, ✅ sem evidência, automação de vídeo/visual (plugin A_DEFINIR).

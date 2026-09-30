# ADR-002 — Execução agentic do sistema editorial (Estratégia 07 + agent-handoff)

- **Status:** Aceita — em execução
- **Data:** 2026-09-30 · **Contato:** executar-rotina@outlook.com

## Decisões
1. **Contrato:** `vendor/agentic-package-v2/` (pacote v2.0.0, só texto) é o contrato local do MVP `APP-EDITORIAL-MVP-001`. Binários ficam fora do git (lista e checksums no `STATUS.md`).
2. **Estado único (Estratégia 07):** `07-execucao/plan.source.json` → gera `ESTADO.md`, épicos, issues e `.handoff/backlog.md`. Status: `NOT_READY → READY → IN_PROGRESS → BLOCKED | USER_ACTION_REQUIRED → DECLARED_DONE → VERIFIED`. `VERIFIED` exige evidência; WIP = 1. Validação: `npm run validate:state`.
3. **Workflow de execução:** plugin **agent-handoff 0.4.2** (`/setup-handoff → /plan → /execute → /verify`, estado em `.handoff/`), junto com o **Backend Design 0.2.0** (design/audit/review-migration).
4. **O LLM não é o motor de estados:** estados, gates, retries e aprovações da campanha ficam no D1 (`stage_runs`) e no `CampaignWorkflow` (Cloudflare Workflows, `waitForEvent` nos gates humanos).
5. **SoT de Skills:** candidata `Sas-Executar/02-Exe-Maestro` **não verificada** (fora do acesso desta sessão) → `ISS-001` bloqueada; nenhuma dependência de Skill é inventada.
6. **Capabilities Anthropic:** `Agent Design`, `Make Agents`, `Three Steps Workflows` → `SKILL_UNAVAILABLE` (não descobertos); `brand-guidelines` e `web-artifacts-builder` disponíveis, não usados (o produto segue o DS do blog). Ver `07-execucao/REGISTRIES/tool-connector-plugin.md`.
7. **Issues:** épicos e issues também no GitHub (milestone `APP-EDITORIAL-MVP-001`), com número gravado de volta na fonte única.
8. **Deploy de produção** autorizado pelo usuário em 2026-09-30 para este repositório.

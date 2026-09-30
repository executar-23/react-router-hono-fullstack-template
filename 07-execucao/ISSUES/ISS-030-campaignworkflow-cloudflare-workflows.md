# ISS-030 — CampaignWorkflow (Cloudflare Workflows)

- **Tipo:** Issue de EPIC-03
- **Status:** NOT_READY
- **Dono:** Claude
- **GitHub:** [#16](https://github.com/executar-23/react-router-hono-fullstack-template/issues/16)
- **Estágios:** STG-000, STG-180
- **GAPs:** GAP-011
- **Depende de:** ISS-020
- **Automação:** A4

## OBJECTIVE
CampaignWorkflow (Cloudflare Workflows).

## INPUT
Contratos em `vendor/agentic-package-v2/` (workflow v0.2, taxonomia, checklists) e o stack atual (ADR-001).

## CONSTRAINTS
WIP=1; nada inventado (`A_DEFINIR`); nenhuma ação externa sem aprovação; divergências vão para `07-execucao/DECISOES.md`.

## EXECUTION
Ciclo agent-handoff: `/plan` → `/execute` → `/verify` (contexto limpo).

## OUTPUT CONTRACT / DoD
Workflow testado: pausa no gate, retoma com evento, estágios A_DEFINIR ficam USER_ACTION_REQUIRED.

## VALIDATION
Evidência registrada em `REGISTRIES/evidence-log.md` e no ESTADO: A_DEFINIR.

## STOP CONDITIONS
Decisão que muda a arquitetura, ação externa sem aprovação, ou a mesma etapa falhar duas vezes.

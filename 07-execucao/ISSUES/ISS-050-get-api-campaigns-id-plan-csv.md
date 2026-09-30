# ISS-050 — GET /api/campaigns/:id/plan.csv

- **Tipo:** Issue de EPIC-05
- **Status:** NOT_READY
- **Dono:** Claude
- **GitHub:** [#18](https://github.com/executar-23/react-router-hono-fullstack-template/issues/18)
- **Estágios:** STG-090
- **GAPs:** GAP-009, GAP-010, GAP-015
- **Depende de:** ISS-020
- **Automação:** A4

## OBJECTIVE
GET /api/campaigns/:id/plan.csv.

## INPUT
Contratos em `vendor/agentic-package-v2/` (workflow v0.2, taxonomia, checklists) e o stack atual (ADR-001).

## CONSTRAINTS
WIP=1; nada inventado (`A_DEFINIR`); nenhuma ação externa sem aprovação; divergências vão para `07-execucao/DECISOES.md`.

## EXECUTION
Ciclo agent-handoff: `/plan` → `/execute` → `/verify` (contexto limpo).

## OUTPUT CONTRACT / DoD
CSV testado com cabeçalho canônico e uma linha por entregável.

## VALIDATION
Evidência registrada em `REGISTRIES/evidence-log.md` e no ESTADO: A_DEFINIR.

## STOP CONDITIONS
Decisão que muda a arquitetura, ação externa sem aprovação, ou a mesma etapa falhar duas vezes.

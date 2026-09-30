# EPIC-03 — Workflow de campanha com gates humanos

- **Tipo:** Épico
- **Status:** derivado das issues
- **Dono:** —
- **GitHub:** [#5](https://github.com/executar-23/react-router-hono-fullstack-template/issues/5)
- **Estágios:** STG-000, STG-180
- **GAPs:** GAP-011

## OBJECTIVE
Workflow de campanha com gates humanos.

## INPUT
Contratos em `vendor/agentic-package-v2/` (workflow v0.2, taxonomia, checklists) e o stack atual (ADR-001).

## CONSTRAINTS
WIP=1; nada inventado (`A_DEFINIR`); nenhuma ação externa sem aprovação; divergências vão para `07-execucao/DECISOES.md`.

## EXECUTION
Ciclo agent-handoff: `/plan` → `/execute` → `/verify` (contexto limpo).

## OUTPUT CONTRACT / DoD
CampaignWorkflow avança estágios automatizáveis e espera aprovação humana nos estágios do Creator.

## VALIDATION
Evidência registrada em `REGISTRIES/evidence-log.md` e no ESTADO: ver issues.

## STOP CONDITIONS
Decisão que muda a arquitetura, ação externa sem aprovação, ou a mesma etapa falhar duas vezes.

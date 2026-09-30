# ISS-091 — Deploy de produção + smoke tests

- **Tipo:** Issue de EPIC-09
- **Status:** NOT_READY
- **Dono:** Claude
- **GitHub:** [#23](https://github.com/executar-23/react-router-hono-fullstack-template/issues/23)
- **Depende de:** ISS-050, ISS-040, ISS-030
- **Automação:** A3

## OBJECTIVE
Deploy de produção + smoke tests.

## INPUT
Contratos em `vendor/agentic-package-v2/` (workflow v0.2, taxonomia, checklists) e o stack atual (ADR-001).

## CONSTRAINTS
WIP=1; nada inventado (`A_DEFINIR`); nenhuma ação externa sem aprovação; divergências vão para `07-execucao/DECISOES.md`.

## EXECUTION
Ciclo agent-handoff: `/plan` → `/execute` → `/verify` (contexto limpo).

## OUTPUT CONTRACT / DoD
/api/health 200 e /api/hub 401 em produção, evidência registrada.

## VALIDATION
Evidência registrada em `REGISTRIES/evidence-log.md` e no ESTADO: A_DEFINIR.

## STOP CONDITIONS
Decisão que muda a arquitetura, ação externa sem aprovação, ou a mesma etapa falhar duas vezes.

# ISS-010 — Migração 0002_campaign + seed dos 19 estágios

- **Tipo:** Issue de EPIC-01
- **Status:** IN_PROGRESS
- **Dono:** Claude
- **GitHub:** [#14](https://github.com/executar-23/react-router-hono-fullstack-template/issues/14)
- **Estágios:** STG-000, STG-010
- **Depende de:** ISS-002
- **Automação:** A4

## OBJECTIVE
Migração 0002_campaign + seed dos 19 estágios.

## INPUT
Contratos em `vendor/agentic-package-v2/` (workflow v0.2, taxonomia, checklists) e o stack atual (ADR-001).

## CONSTRAINTS
WIP=1; nada inventado (`A_DEFINIR`); nenhuma ação externa sem aprovação; divergências vão para `07-execucao/DECISOES.md`.

## EXECUTION
Ciclo agent-handoff: `/plan` → `/execute` → `/verify` (contexto limpo).

## OUTPUT CONTRACT / DoD
Tabelas criadas, testes de schema verdes e migração aplicada local/preview/produção.

## VALIDATION
Evidência registrada em `REGISTRIES/evidence-log.md` e no ESTADO: A_DEFINIR.

## STOP CONDITIONS
Decisão que muda a arquitetura, ação externa sem aprovação, ou a mesma etapa falhar duas vezes.

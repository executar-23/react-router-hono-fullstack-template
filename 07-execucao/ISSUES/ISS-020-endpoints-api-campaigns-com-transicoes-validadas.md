# ISS-020 — Endpoints /api/campaigns com transições validadas

- **Tipo:** Issue de EPIC-02
- **Status:** NOT_READY
- **Dono:** Claude
- **GitHub:** [#15](https://github.com/executar-23/react-router-hono-fullstack-template/issues/15)
- **Estágios:** STG-000, STG-180
- **Depende de:** ISS-010
- **Automação:** A4

## OBJECTIVE
Endpoints /api/campaigns com transições validadas.

## INPUT
Contratos em `vendor/agentic-package-v2/` (workflow v0.2, taxonomia, checklists) e o stack atual (ADR-001).

## CONSTRAINTS
WIP=1; nada inventado (`A_DEFINIR`); nenhuma ação externa sem aprovação; divergências vão para `07-execucao/DECISOES.md`.

## EXECUTION
Ciclo agent-handoff: `/plan` → `/execute` → `/verify` (contexto limpo).

## OUTPUT CONTRACT / DoD
Testes de transição válidos/ inválidos, gate humano e evidência obrigatória passando.

## VALIDATION
Evidência registrada em `REGISTRIES/evidence-log.md` e no ESTADO: A_DEFINIR.

## STOP CONDITIONS
Decisão que muda a arquitetura, ação externa sem aprovação, ou a mesma etapa falhar duas vezes.

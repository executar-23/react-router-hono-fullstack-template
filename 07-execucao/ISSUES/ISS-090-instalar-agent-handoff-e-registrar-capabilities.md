# ISS-090 — Instalar agent-handoff e registrar capabilities

- **Tipo:** Issue de EPIC-09
- **Status:** VERIFIED
- **Dono:** Claude
- **GitHub:** [#22](https://github.com/executar-23/react-router-hono-fullstack-template/issues/22)
- **Depende de:** —
- **Automação:** A4

## OBJECTIVE
Instalar agent-handoff e registrar capabilities.

## INPUT
Contratos em `vendor/agentic-package-v2/` (workflow v0.2, taxonomia, checklists) e o stack atual (ADR-001).

## CONSTRAINTS
WIP=1; nada inventado (`A_DEFINIR`); nenhuma ação externa sem aprovação; divergências vão para `07-execucao/DECISOES.md`.

## EXECUTION
Ciclo agent-handoff: `/plan` → `/execute` → `/verify` (contexto limpo).

## OUTPUT CONTRACT / DoD
Plugin íntegro e ligado.

## VALIDATION
Evidência registrada em `REGISTRIES/evidence-log.md` e no ESTADO: npm run validate:workflow (18 verificações).

## STOP CONDITIONS
Decisão que muda a arquitetura, ação externa sem aprovação, ou a mesma etapa falhar duas vezes.

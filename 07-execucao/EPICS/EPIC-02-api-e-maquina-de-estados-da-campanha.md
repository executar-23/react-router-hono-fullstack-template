# EPIC-02 — API e máquina de estados da campanha

- **Tipo:** Épico
- **Status:** derivado das issues
- **Dono:** —
- **GitHub:** [#4](https://github.com/executar-23/react-router-hono-fullstack-template/issues/4)
- **Estágios:** STG-000, STG-180

## OBJECTIVE
API e máquina de estados da campanha.

## INPUT
Contratos em `vendor/agentic-package-v2/` (workflow v0.2, taxonomia, checklists) e o stack atual (ADR-001).

## CONSTRAINTS
WIP=1; nada inventado (`A_DEFINIR`); nenhuma ação externa sem aprovação; divergências vão para `07-execucao/DECISOES.md`.

## EXECUTION
Ciclo agent-handoff: `/plan` → `/execute` → `/verify` (contexto limpo).

## OUTPUT CONTRACT / DoD
API cria campanha, lista estágios, aceita entregáveis e aprova gates com transições validadas.

## VALIDATION
Evidência registrada em `REGISTRIES/evidence-log.md` e no ESTADO: ver issues.

## STOP CONDITIONS
Decisão que muda a arquitetura, ação externa sem aprovação, ou a mesma etapa falhar duas vezes.

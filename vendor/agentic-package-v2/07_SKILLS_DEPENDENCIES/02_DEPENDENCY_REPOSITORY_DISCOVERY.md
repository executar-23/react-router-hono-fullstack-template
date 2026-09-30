# Skill Dependency Repository — Discovery Contract

ID: DEP-REPO-DISCOVERY-001
Version: 1.0.0
Status: VERIFY_FIRST

## Requirement

As dependências de cada Skill NÃO devem ser inventadas nem inferidas apenas pelo nome da Skill. Elas devem ser coletadas do repositório que contém a database/Source of Truth do ecossistema.

## Repositório candidato já descoberto

`Sas-Executar/02-Exe-Maestro`

Razões para tratá-lo como candidato primário a verificar:

- contém `60-dados/` com `10-raw`, `20-normalized`, `40-canonical`, `50-warehouse`, `70-schemas` e `90-evidence`;
- contém `30-editorial-marketing/08-skills-assets`;
- contém `70-operacao-governanca/02-workflows`;
- contém `90-assets-compartilhados/`;
- a organização é compatível com a arquitetura de dados e governança do pacote.

## Regra obrigatória

Antes da coleta, o agente deve confirmar que este é de fato o repositório/database indicado pelo projeto. Se README, ponteiros privados, CLAUDE.md, Master Index ou configuração do projeto apontarem para outra SoT, usar a SoT real e registrar a troca.

Nunca transformar este candidato em certeza por inferência silenciosa.

## Caminhos mínimos a inspecionar

1. `60-dados/40-canonical`
2. `60-dados/50-warehouse`
3. `60-dados/70-schemas`
4. `60-dados/90-evidence`
5. `30-editorial-marketing/08-skills-assets`
6. `70-operacao-governanca/02-workflows`
7. `90-assets-compartilhados/`
8. `98-private-pointers/` quando autorizado e necessário

## Saída da coleta

Para cada Skill elegível registrar:

- SKILL_ID
- nome canônico
- versão
- source_path
- owner
- objetivo
- input schema
- output schema
- stack
- runtime
- file tree
- dependencies
- connectors
- tools
- plugins
- permissões
- agentes compatíveis
- nível de automação
- acceptance criteria
- evidence
- validation state
- next handoff

Status permitidos: `FOUND`, `PARTIAL`, `CONFLICT`, `BLOCKED`, `VERIFIED`.

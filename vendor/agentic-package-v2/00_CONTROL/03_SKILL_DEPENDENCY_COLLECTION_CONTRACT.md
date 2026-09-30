# Skill Dependency Collection Contract

```yaml
ID: SKILL-DEPENDENCY-COLLECTION-001
VERSION: 1.0.0
STATUS: ACTIVE
OWNER: Leonardo
AUTOMATION_LEVEL: A4
SOURCE_POLICY: REPOSITORY_DATABASE_FIRST
```

## Objective

Transformar o inventário de Skills em um registro verificável de dependências técnicas e operacionais.

## Source rule

A fonte principal é o repositório/database canônico do ecossistema. O agente deve localizar e verificar a SoT antes de preencher qualquer dependência. O candidato descoberto é `Sas-Executar/02-Exe-Maestro`; confirmar antes do uso definitivo.

## Required record

```yaml
skill_dependency_record:
  skill_id: A_DEFINIR
  name: A_DEFINIR
  version: A_DEFINIR
  source_repository: A_DEFINIR
  source_path: A_DEFINIR
  owner: A_DEFINIR
  purpose: A_DEFINIR
  input_schema: A_DEFINIR
  output_schema: A_DEFINIR
  stack: []
  runtime: A_DEFINIR
  file_tree: []
  dependencies: []
  connectors: []
  tools: []
  plugins: []
  permissions: []
  compatible_agents: []
  automation_level: A_DEFINIR
  acceptance_criteria: []
  evidence: []
  validation_state: NOT_READY
```

## Verification

Each dependency must have at least one source path or repository evidence. A dependency without source evidence is `UNVERIFIED`. Conflicts between Skill files and database records must be registered, not silently reconciled.

## Eligibility gate

A Skill can enter automated production only when:

- identity/version resolved;
- input/output known;
- required dependencies resolved;
- permissions known;
- required connector/tool availability checked;
- acceptance criteria defined;
- evidence source registered.

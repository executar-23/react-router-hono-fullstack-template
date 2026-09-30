# Agent Prompt Contract — WF Asset Store Pilot

ID: WF-ASSET-STORE-PILOT-001
VERSION: 1.0.0
STATUS: READY_FOR_EXECUTION
AUTOMATION_LEVEL: A4

## Objective
Formalizar schema, arquitetura visual, componentes e modelo de dados; selecionar exatamente 10 Skills elegíveis; popular o artefato; gerar UI funcional; gerar HTML standalone e arquivos fonte; documentar e validar. É PILOTO, não migração completa.

## Parent contracts
ASSET-CTA-STORE-SCHEMA-001; DEP-CHECK-ASSET-STORE-001; EXECUTAR-TOOLS-STORE-UX-001.

## Mandatory commands
/Brand Guidelines → extrair identidade/tokens/restrições → aplicar project override → /Web Artifact Builder → construir artefato.

## Skill selection policy
Selecionar exatamente 10 Skills priorizando arquivo real, objetivo/input/output identificáveis, utilidade demonstrável, diversidade e ausência de dependência impossível. Se <10 suficientemente documentadas, BLOCKED_PARTIAL.

## Core public schema
ITEM_ID, SKILL_ID, NAME, VERSION, TYPE, AREA, ICP, RELEVANCE_TAGS, EXECUTIVE_FUNCTION_TAGS, SHORT_DESCRIPTION, BENEFITS, COGNITIVE_RISK, EVIDENCE_SUMMARY, TECHNIQUE, PROBLEM, PROCESS[3], TARGET_PROGRESS PDCA, SYMBOL, CTA, MEDIA, VALIDATION_STATE.

## Public/private boundary
Private records não devem ir no bundle/browser. Não esconder apenas com CSS.

## Outputs mínimos
artifact/index.html; assets/styles/scripts; src components/features/data/schemas; schemas public/private/process/cta/store; data selected-skills.json/pilot-public-data.json; docs README, DESIGN-HANDOFF, PRF, FRD, SPECS, COMPONENT-MAP, DESIGN-TOKENS, DATA-CONTRACT, PUBLIC-PRIVATE-BOUNDARY, PILOT-REPORT, GAP-REGISTER, VALIDATION-REPORT.

## Quality gates
Schema, Design, Content, Functional, Publishability. DONE somente com 10 skills + artifact implemented + HTML + responsive + public/private + Dev Check + Asset Store Check + docs + evidence.

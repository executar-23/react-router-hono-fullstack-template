# Agent Prompt Contract — Assets, CTA e Store

ID: ASSET-CTA-STORE-SCHEMA-001
VERSION: 0.1.0
STATUS: PREPARED

## Objective
Criar esquema visual e operacional para Assets, CTAs, Skills/Agents e itens da Store com duas camadas vinculadas: PUBLIC e PRIVATE. Cada item compartilha ITEM_ID, SCHEMA_VERSION e VALIDATION_STATE; quando aplicável também SKILL_ID e ROLE_ID.

## Product classes
HTML (quantidade A_DEFINIR), PDF×3, AI Prompt×3, Skill/Agent×3, e-book via workflow específico.

## Public schema
1. Product Name
2. Area tag (mostrar apenas valor)
3. ICP tag
4. Evidence-relevance tag (TDAH/dislexia/autismo etc somente com evidência; não diagnosticar)
5. Executive-function tag
6. Description até 70 palavras, SQCA interno sem exibir sigla
7. 3–5 benefit bullets
8. Associated cognitive risk até 7 palavras
9. Scientific evidence: title, source link/type, professional/institution, conclusion até 100 palavras
10. Applied technique até 50 palavras
11. Problem solved até 15 palavras
12. Process exatamente 3 etapas com índice semântico 1/2/3
13. Target progress em PDCA
14. CTA com CTA_ID, label, action, target, type

## Private schema
Identity; ICP granular; technical architecture; project management mapping quando aplicável; human operational capacity; executive function mapping; clinical/scientific provenance; operational impact chain; compensation model; product; design; epistemic class; validation state; observation.

## Evidence protocol
Wide Search com preferência a fontes primárias; registrar construct, população, contexto, método, sample, outcome, limitações, conclusão, Evidence_ID e claim support. Claim sem evidência adequada = UNSUPPORTED.

## Agentic BPM
Receber item candidato → classificar produto → assign ITEM_ID → area+ICP → hipótese de relevância → Wide Search → gate evidência suficiente? → private evidence record → public card → technical mapping → process 1/2/3 → PDCA → CTA → gate public/private → claim validation → human review → gate approved → Store record → Public route + Internal SoT → evidence → END.

## Public/Private rule
Nunca expor stack interno, file tree, connectors sensíveis, secrets, permissões internas, dados clínicos individuais, reasoning interno, private notes.

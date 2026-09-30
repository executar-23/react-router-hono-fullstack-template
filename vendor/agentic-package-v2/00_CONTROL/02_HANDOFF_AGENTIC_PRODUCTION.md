# HANDOFF — Agentic Editorial Production

```yaml
ID: HANDOFF-AGENTIC-EDITORIAL-001
VERSION: 1.0.0
AREA: Editorial / Skills / Assets / Store / Agentic Production
OWNER: Leonardo
STATUS: READY_FOR_EXECUTION
AUTOMATION_LEVEL_TARGET: A4
WIP: 1
MISSING_DATA: A_DEFINIR
```

## Command

Execute the agentic production workflow using this package as the local contract and the repository/database as the Source of Truth for Skill dependencies.

### 1. Inspect before execution

Read, in order:

1. `00_CONTROL/00_INDEX.md`
2. `00_CONTROL/03_SKILL_DEPENDENCY_COLLECTION_CONTRACT.md`
3. `00_CONTROL/04_ANTHROPIC_AGENTIC_TOOLCHAIN.md`
4. `03_AGENTIC_ARCHITECTURE/01_EDITORIAL_AGENTIC_TAXONOMY_v1.json`
5. `03_AGENTIC_ARCHITECTURE/03_EDITORIAL_CAMPAIGN_WORKFLOW_v0.2.json`
6. `04_EDITORIAL_PRODUCTION/01_MASTER_DEPENDENCY_CHECKLIST.md`
7. `04_EDITORIAL_PRODUCTION/02_ASSET_STORE_SKILL_DEPENDENCY_CHECKLIST.md`
8. `02_STRATEGY_BRIEFING/02_PROCESS_DOC_PADRAO_MULTIPLATAFORMA.docx`
9. Design/UI and route/copy contracts only when the current node requires them.

### 2. Resolve the dependency database

Do not infer Skill dependencies from names, previous chat context or generic knowledge.

Verify the canonical repository/database first. Candidate discovered: `Sas-Executar/02-Exe-Maestro`, especially `60-dados`, `30-editorial-marketing/08-skills-assets`, `70-operacao-governanca/02-workflows` and `90-assets-compartilhados`.

If repository metadata points to another canonical database, use that database and register the decision.

For each eligible Skill, collect and verify:

`SKILL_ID → VERSION → SOURCE_PATH → OWNER → INPUT → OUTPUT → STACK → RUNTIME → FILE_TREE → DEPENDENCIES → CONNECTORS → TOOLS → PLUGINS → PERMISSIONS → AGENTS → AUTOMATION_LEVEL → ACCEPTANCE_CRITERIA → EVIDENCE → VALIDATION_STATE`.

No database evidence = no dependency claim. Use `A_DEFINIR` and create a GAP.

### 3. Discover Anthropic agentic capabilities

Discover in the active Anthropic/Claude environment and register availability for:

- Agent Design
- Make Agents
- Three Steps Workflows
- /Brand Guidelines
- /Web Artifact Builder

Discover additional Anthropic skills/tools/plugins only when relevant. Availability does not equal authorization.

Use these capabilities to support the agentic production workflow, not to replace governance.

### 4. Build the agent stack from verified data

For each workflow node:

1. determine deterministic vs non-deterministic responsibility;
2. select the correct agent/subagent;
3. select the verified Skill;
4. select tool/connector/plugin;
5. apply least privilege;
6. execute one WIP node;
7. verify result;
8. record evidence;
9. update dependency graph;
10. continue to the next unblocked node.

The LLM is not the workflow engine. States, gates, retries, timeouts, idempotency, approvals and irreversible actions stay under explicit workflow control.

### 5. Production chain

Preserve the chain:

`Strategic Pillar → Research/Wide Search → Topic/Data Map → Mother Piece → Storyboard + Quick Frameworks + Assets/CTA → Conversion Skills → Traceable Operational Plan → IDs/CSV → Visual Production → Human Gate → Video Production → Final Review → Multiplatform Distribution → Tracking → Analytics → Learning`.

The Process Doc supplements this with the 5-phase production chain and the 22-task Phase 1 checklist.

### 6. Public/private and evidence controls

- Never publish internal Skill stack, file tree, connectors, permissions, secrets or private evidence notes.
- Scientific/clinical claims require evidence appropriate to the wording.
- Do not infer individual neurodivergent diagnosis or deficit.
- Unsupported claim = remove/rewrite or `BLOCKED_EVIDENCE`.

### 7. Artifacts

At minimum produce/update:

- Skill Dependency Registry
- Agent Registry
- Skill Registry
- Tool/Connector/Plugin Registry
- Permission Matrix
- Workflow Registry
- Risk Register
- Execution/Run log
- Evidence log
- Updated operational CSV
- Design/route/copy outputs when those nodes are activated

### 8. Status rules

Use:

`NOT_READY → READY → IN_PROGRESS → BLOCKED | USER_ACTION_REQUIRED → DECLARED_DONE → VERIFIED`.

DONE requires: executed + expected state reached + verified + evidence recorded.

### 9. Stop conditions

Stop only when the current authorized scope is complete, verified and evidenced, or when a real human-only decision/credential/approval blocks the next node. Do not automatically deploy, publish, send email or write to external systems unless the current authorization explicitly permits it.

### 10. Final handoff

Return:

- status;
- dependencies found and source paths;
- Anthropic capabilities discovered/used;
- agents/skills instantiated;
- artifacts produced;
- tests/verification;
- evidence locations;
- gaps/conflicts;
- blocked nodes;
- next executable node.

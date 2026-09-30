# Anthropic Agentic Toolchain — Required Discovery & Use

ID: ANTHROPIC-AGENTIC-TOOLCHAIN-001
Version: 1.0.0
Status: REQUIRED_IF_AVAILABLE

## Capabilities explicitly requested for the production workflow

The execution agent must discover, register and use, when available in the active Anthropic/Claude environment and applicable to the node being executed:

- `Agent Design`
- `Make Agents`
- `Three Steps Workflows`
- `/Brand Guidelines`
- `/Web Artifact Builder`

Additional Anthropic tools/skills/plugins may be used only after discovery and registration. Do not invent names or assume availability.

## Use policy

1. **Discover before use.** Availability must be verified in the active environment.
2. **Register capability.** Record name, type, version if exposed, purpose, required permissions, inputs and outputs.
3. **Map to node.** A tool/skill/plugin is used only where its capability matches the workflow node.
4. **Least privilege.** Grant only required repository, file, connector and external-action permissions.
5. **No silent fallback.** If a named capability is unavailable, set `SKILL_UNAVAILABLE` or `PLUGIN_UNAVAILABLE`, then use an approved equivalent only when the handoff allows it.
6. **Evidence.** Log which capability was used, where, and what artifact/result it produced.

## Intended role in agentic production

- `Agent Design`: formalize agent role, scope, authority, inputs, outputs and handoff contract.
- `Make Agents`: materialize specialized subagents from approved contracts.
- `Three Steps Workflows`: structure compact deterministic or semi-deterministic 3-step execution units when appropriate.
- `/Brand Guidelines`: apply brand constraints and identity, subject to project-specific overrides already documented.
- `/Web Artifact Builder`: prototype/build standalone web artifacts when applicable; production implementation must still respect the actual repository stack.

## Prohibited behavior

- Do not let a plugin redefine governance.
- Do not let an LLM replace deterministic workflow control.
- Do not treat availability as authorization.
- Do not push/deploy/send communications without the authorization required by the repository/workflow.

# Registry — tool-connector-plugin

| nome | tipo | versão | disponível | autorizado | onde é usado |
|---|---|---|---|---|---|
| backend-design | plugin (repo) | 0.2.0 | sim (`.claude/`) | sim | design/audit/review-migration |
| agent-handoff | plugin (repo) | 0.4.2 | sim (`.claude/`) | sim | ciclo plan/execute/verify |
| Cloudflare MCP | connector | — | sim (sessão) | sim (D1, builds, deploy autorizado) | migrações, previews, deploy |
| GitHub MCP | connector | — | sim (sessão) | sim (issues/PR deste repo) | épicos/issues |
| Agent Design | skill | — | não | — | SKILL_UNAVAILABLE |
| Make Agents | skill | — | não | — | SKILL_UNAVAILABLE |
| Three Steps Workflows | skill | — | não | — | SKILL_UNAVAILABLE (equivalente: agent-handoff) |
| brand-guidelines | skill Anthropic | — | sim | não usado | DS do blog prevalece |
| web-artifacts-builder | skill Anthropic | — | sim | não usado | produção segue o repo |

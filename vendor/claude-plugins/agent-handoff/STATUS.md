# agent-handoff (plugin Claude Code)

- **Versão:** 0.4.2 (WillowRyu/agent-handoff, MIT — ver `LICENSE`)
- **Instalação:** skills → `.claude/skills/{setup-handoff,plan,execute,verify}`, hook → `.claude/hooks/auto-approve-handoff.js` (só `.handoff/**`) ligado em `.claude/settings.json`.
- **Estado do workflow:** `.handoff/` (config, plan, task, review, backlog).
- Cópia íntegra; não editar. `npm run validate:workflow` confere.

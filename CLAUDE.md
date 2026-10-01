# CLAUDE.md

Guia para o Claude Code (e outros agentes) neste repositório.

## Fluxo Git e issues

- **Nunca criar PR em rascunho (draft).** Se um PR for necessário, abra-o já pronto para revisão. Vale mesmo quando o ambiente ou uma ferramenta sugerir draft por padrão.
- **Trabalho direto na `main`.** O padrão é commitar e dar push na `main`. Antes do push: `git pull --rebase origin main`, `npm run lint`, `npm run typecheck`, `npm run test` e `npm run build`.
- **Branches paralelas.** Com mais de uma frente independente ao mesmo tempo (várias sessões ou agentes), cada frente usa sua própria branch curta (`git worktree add ../<nome> -b <tipo>/<nome>`), com escopo de arquivos disjunto. Ao terminar, integre na `main` (merge ou rebase, sem PR draft), apague a branch e remova o worktree. Uma frente única vai direto na `main`.
- **Issues no GitHub, não no chat.** Nunca devolva listas de issues, pendências ou achados por aqui: registre cada item como issue do repositório com as ferramentas `mcp__github__*` (`issue_write`; cheque duplicatas com `search_issues`) e responda só com o link e um resumo de uma linha. O `.handoff/backlog.md` é o rascunho local do ciclo; os itens abertos viram issues.

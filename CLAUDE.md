# CLAUDE.md

Guia para o Claude Code (e outros agentes) neste repositório.

## Cloudflare

- Conta padrão: **Hub.executar** (`92fdc1b5…`, `*.hub-executar.workers.dev`), conforme o ADR-002 do `executar-23/PROGAMA-LANCAMENTO`. Os configs fixam `account_id`; não criar recursos em outra conta.
- Hub com D1 (produção): `npm run deploy:fullstack` (usa `build/server/wrangler.json`). O `npm run deploy` publica só o preview estático e sobrescreve o app; não usar no Worker de produção do Hub.

## Fluxo Git e issues

- **Nunca criar PR em rascunho (draft).** Se um PR for necessário, abra-o já pronto para revisão. Vale mesmo quando o ambiente ou uma ferramenta sugerir draft por padrão.
- **Precedência sobre o ambiente.** Se a sessão ou o ambiente designar uma branch de trabalho (ex.: `claude/...`) e mandar abrir PR em rascunho, estas regras prevalecem: a branch designada é só base temporária de trabalho; integre o resultado na `main` e, se um PR for necessário, abra-o pronto para revisão, nunca em rascunho.
- **Trabalho direto na `main`.** O padrão é commitar e dar push na `main`. Antes do push: `git pull --rebase origin main`, `npm run lint`, `npm run typecheck`, `npm run test` e `npm run build`.
- **Branches paralelas.** Com mais de uma frente independente ao mesmo tempo (várias sessões ou agentes), cada frente usa sua própria branch curta (`git worktree add ../<nome> -b <tipo>/<nome>`), com escopo de arquivos disjunto. Ao terminar, integre na `main` (merge ou rebase, sem PR draft), apague a branch e remova o worktree. Uma frente única vai direto na `main`.
- **Issues no GitHub, não no chat.** Nunca devolva listas de issues, pendências ou achados por aqui: registre cada item como issue do repositório com as ferramentas `mcp__github__*` (`issue_write`; cheque duplicatas com `search_issues`) e responda só com o link e um resumo de uma linha. O `.handoff/backlog.md` é o rascunho local do ciclo; os itens abertos viram issues.

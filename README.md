# Hub Editorial — Risco Cognitivo

## Preview local sem env — modo padrão atual

```bash
python scripts/preview-local.py
```

Abra **http://localhost:8080/**. Não execute `npm ci`, não copie `.env`/`.dev.vars` e não inicie
OpenAuth, banco ou Workflows para este preview. É a aplicação EXECUTAR de duas visões publicada nesta conversa;
o Hub React/Hono completo continua disponível apenas no modo fullstack.

Alternativas: `npm run dev` ou `npm run preview` (Python 3); `npm run build` gera `dist-preview`
com Node, sem pacotes externos. `npm run check` valida o preview e gera esse pacote. A CI verifica esse fluxo e também o empacotamento com Wrangler em dry-run, sem publicação remota.

A configuração padrão `wrangler.jsonc` agora publica **somente arquivos estáticos**, sem `vars`,
D1, KV, Workflows, API ou OpenAuth. No Workers Builds, use build `npm run build` e deploy
`npm exec --yes --package=wrangler@4.136.1 -- wrangler deploy --config=wrangler.jsonc`.
O build do painel é explícito; `build.command` no Wrangler não é utilizado pelo Workers Builds.
No Pages, diretório de saída `dist-preview`.

**Guia ilustrado e comandos completos:** [Publicação Cloudflare](docs/executar-editorial/CLOUDFLARE-PUBLICACAO.md).
`npm run deploy:check` valida o pacote; `npm run deploy` publica intencionalmente;
`npm run deploy:version` cria uma versão sem ativá-la.
Publicação hospedada continua exigindo autenticação da conta Cloudflare; o uso local não exige.
Nenhum deploy remoto foi executado nesta alteração.

O modo completo foi preservado em `wrangler.fullstack.jsonc`, com comandos `dev:fullstack`,
`build:fullstack`, `preview:fullstack`, `check:fullstack` e `deploy:fullstack`. Os arquivos de env antigos
permanecem para esse modo, mas não são lidos nem exigidos pelo preview local. A configuração do painel Cloudflare
não foi alterada: remova do comando de build qualquer `check:env` ou migração que tenha sido configurada lá.

21 verificações de lógica e teste HTTP do servidor Python passaram. Testes visuais, instalação PWA e
paginação em navegador continuam pendentes. Dados são salvos por navegador/origem; exporte backup antes de mudar a origem.

Hub editorial (conteúdos, argumentos, evidências, derivados por canal, calendário, distribuição) sobre
**React Router 7 + Hono + Cloudflare Workers**, com **D1**, **OpenAuth** e **Workflows**. Design system e tokens clonados do
`Risco-cognitivo-blog` (`app/app.css`, `app/components/ui`, `app/components/plain`).

- Decisões, riscos e critérios: [`docs/adr/ADR-001-hub-backend-cloudflare.md`](docs/adr/ADR-001-hub-backend-cloudflare.md)
- Variáveis e credenciais: [`docs/adr/ENV-INVENTORY.md`](docs/adr/ENV-INVENTORY.md) · [`docs/adr/SECRETS.md`](docs/adr/SECRETS.md)
- Versões instaladas: [`docs/adr/INSTALLED.md`](docs/adr/INSTALLED.md)

## Estrutura
| Caminho | O que é |
|---|---|
| `app/` | frontend (rota `/`, Hub Editorial) |
| `workers/app.ts`, `workers/api/` | Worker principal: React Router + API `/api/*` (chanfana + zod) |
| `workers/workflows/` | `HubPublishWorkflow` |
| `auth/` | servidor OpenAuth (Worker separado) |
| `migrations/`, `auth/migrations/`, `db/seed.sql` | D1 (schema e seed idempotente) |
| `vendor/cloudflare-templates/` | os 6 templates Cloudflare preservados (ver `STATUS.md` de cada) |
| `vendor/claude-plugins/backend-design/` + `.claude/` | plugin Backend Design instalado (skills, comandos, agentes, hooks) |

## Desenvolvimento fullstack (opcional, requer env)
```bash
npm ci
cp .dev.vars.example .dev.vars && cp auth/.dev.vars.example auth/.dev.vars
npm run db:migrate:local && npm run db:seed:local
npm run dev:auth      # terminal 1: OpenAuth em :8788 (o código de login sai no log)
npm run dev:fullstack # terminal 2: app em :5173
```
Sem login, a tela de entrada oferece o **modo local** (dados só no navegador).

## Qualidade
`npm run check:fullstack` roda lint, typecheck, testes, build, `check:env` e `wrangler deploy --dry-run` (app e `auth/`).
Também: `npm test`, `npm run lint`, `npm run check:env`, `npm run validate:workflow`.

## ✅ Antes do lançamento fullstack (checklist — tudo que ainda precisa ser adicionado)
A estrutura, os arquivos de ambiente e os scripts já existem. Falta **somente** substituir placeholders por valores reais:

### 1. Segredos e chaves
| Item | Onde | Como |
|---|---|---|
| `RESEND_API_KEY` | Worker `auth/` | `npx wrangler secret put RESEND_API_KEY -c auth/wrangler.jsonc` |
| Domínio/remetente verificado no Resend para `EMAIL_FROM` (hoje `executar-rotina@outlook.com`) | Resend | o Resend exige domínio próprio verificado; um endereço `@outlook.com` não pode ser remetente. Troque `EMAIL_FROM` por um endereço do seu domínio |
| `CLOUDFLARE_API_TOKEN` | GitHub Actions / máquina de deploy | Workers Scripts:Edit, D1:Edit, Workers KV:Edit |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub Actions / máquina de deploy | ID da conta |
| `CLOUD_AI_BASE_URL`, `CLOUD_AI_API_KEY` | reservadas | confirmar o que é "cloud.ai" (ADR-001 §7) |

### 2. Variáveis públicas (em `wrangler.fullstack.jsonc` e `auth/wrangler.jsonc`)
`ALLOWED_ORIGIN`, `AUTH_ISSUER_URL`, `AUTH_CLIENT_ID`, `ADMIN_EMAIL` (`executar-rotina@outlook.com`), `EMAIL_FROM`, `PROJECT_CONTACT`, `ENVIRONMENT`.
Confirme as URLs `*.workers.dev` (ou domínio customizado) depois do primeiro deploy do `auth/`.

### 3. Recursos Cloudflare (já criados na sua conta)
D1 `hub-editorial-db` e `hub-auth-db` (schema aplicado) e KV `hub-auth-storage`. IDs em `wrangler.fullstack.jsonc` / `auth/wrangler.jsonc`.

### 4. Comandos de lançamento (na ordem)
```bash
npm run db:migrate:remote && npm run db:migrate:auth:remote   # idempotentes
npm run db:seed:remote                                        # opcional: dados de exemplo
npm run deploy:auth                                           # Worker de autenticação
npm run deploy:fullstack                                       # app + API
curl https://<seu-app>/api/health                             # {"success":true,...}
```

### 5. Dependências (já instaladas e versionadas)
`chanfana`, `zod`, `@openauthjs/openauth`, `valibot`, `hono`, `vitest`, `@cloudflare/vitest-pool-workers`, `eslint` (+ `typescript-eslint`,
`eslint-plugin-react-hooks`). Lista completa com versões: `docs/adr/INSTALLED.md`. O `.npmrc` usa `legacy-peer-deps=true`.

### 6. Rate limiting do login (painel Cloudflare)
Crie uma regra de rate limiting para o Worker `hub-editorial-auth` (pedido de código) — protege o e-mail do admin e a cota do Resend (ADR-001, auditoria).

### 7. Opcional
Habilitar o plugin **Cloudflare** e o **Backend Design** na conta (claude.ai → Settings → Plugins). O plugin já está instalado neste repositório.

> Limitação conhecida: em previews do Workers Builds o login não funciona (origem diferente de `ALLOWED_ORIGIN`); a API e o `/api/health` funcionam.

## EXECUTAR · Scroll Task e plano mental

A PWA local está em [`public/executar-editorial/index.html`](public/executar-editorial/index.html).
No preview estático, abra `/executar-editorial/index.html` na mesma origem do Hub.
Para testar isoladamente: `python -m http.server 8080 --directory public` e abra
`http://localhost:8080/executar-editorial/index.html`.

Duas visões sincronizadas, 49 nós do Xmind, 14 dependências FS, timer, notas, edição,
backup JSON e relatório para impressão. Persistência no navegador, sem execução de agentes externos.
O service worker fica restrito a `/executar-editorial/` e não intercepta o Hub ou a API.

- [Uso, instalação e limites](docs/executar-editorial/LEIA-ME.md)
- [Evidência de verificação](docs/executar-editorial/VERIFICACAO.json)
- [Component Registry Handoff original](docs/executar-editorial/handoff/README.md)

A publicação destes arquivos no GitHub não comprova um deploy Cloudflare nem a instalação PWA.



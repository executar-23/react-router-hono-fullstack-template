# Inventário de variáveis e credenciais (ADR-001)

Fonte da verdade dos contratos de configuração. `npm run check:env` compara este inventário com o código, os `wrangler` e os templates.

## Onde cada coisa é lida
| Variável | Tipo | Consumida por | Descrição | Valor esperado |
|---|---|---|---|---|
| `ENVIRONMENT` | var | `workers/api`, `auth/` | `development`/`preview`/`test`/`production` | por ambiente |
| `ALLOWED_ORIGIN` | var | `workers/api/session.ts` (CSRF), `auth/` (`allow`) | origem do app, sem barra final | URL do app |
| `AUTH_ISSUER_URL` | var | `workers/api/session.ts`, `auth-routes.ts` | URL do OpenAuth (`auth/`) | URL do Worker de auth |
| `AUTH_CLIENT_ID` | var | API e `auth/` | client id (igual nos dois) | `hub-editorial` |
| `ADMIN_EMAIL` | var | API (`isAdmin`) e `auth/` (login/e-mail) | único administrador | `executar-rotina@outlook.com` |
| `PROJECT_CONTACT` | var | declarada (`ApiEnv`) | contato do projeto | `executar-rotina@outlook.com` |
| `EMAIL_FROM` | var | `auth/` | remetente do código de login | `executar-rotina@outlook.com` (domínio verificado) |
| `RESEND_API_KEY` | **segredo** | `auth/` | envio de e-mail via Resend | **CHANGE_ME** → `wrangler secret put` |
| `CLOUDFLARE_ACCOUNT_ID` | CI/deploy | wrangler | conta Cloudflare | **CHANGE_ME** |
| `CLOUDFLARE_API_TOKEN` | **segredo** CI/deploy | wrangler | Workers Scripts:Edit, D1:Edit, Workers KV:Edit | **CHANGE_ME** |
| `CLOUD_AI_BASE_URL` | reservada | — (nenhum código) | integração "cloud.ai" a confirmar | **TBD** |
| `CLOUD_AI_API_KEY` | reservada/segredo | — | idem | **CHANGE_ME** |

Frontend: nenhuma variável `VITE_*`/`import.meta.env` é lida (o app fala só com `/api`). Analytics e storage de arquivos: não usados.
Bindings (não são variáveis): `DB`, `HUB_PUBLISH_WORKFLOW` (app); `AUTH_DB`, `AUTH_STORAGE` (auth).

## Arquivos de ambiente
| Arquivo | Versionado | Uso |
|---|---|---|
| `.env.example` | sim | modelo geral (todas as variáveis) |
| `.env.local.example` | sim | overrides locais (o `.env.local` real não é versionado) |
| `.env.development` / `.env.development.example` | sim (sem segredos) | desenvolvimento |
| `.env.test` / `.env.test.example` | sim (sem segredos) | testes |
| `.env.preview.example` | sim | previews (Workers Builds) |
| `.env.production.example` | sim | produção |
| `.dev.vars.example` | sim | Worker principal, `wrangler dev` (copiar para `.dev.vars`) |
| `auth/.dev.vars.example` | sim | Worker `auth/`, `wrangler dev` |
| `wrangler.jsonc` / `auth/wrangler.jsonc` | sim | `vars` públicas e bindings (segredos nunca aqui) |

Placeholders válidos: `CHANGE_ME`, `TBD`, `REPLACE_IN_PRODUCTION`, `REPLACE_IN_PREVIEW`. Nenhum valor real de credencial no repositório.

## Estado das únicas pendências reais
Substituir apenas: `RESEND_API_KEY`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (CI), domínio/remetente verificado, e confirmar `CLOUD_AI_*`.

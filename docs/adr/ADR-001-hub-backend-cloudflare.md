# ADR-001 — Backend do Hub Editorial na Cloudflare (D1 + API + OpenAuth + Workflow)

- **Status:** Aceita — implementada; produção depende de credenciais externas (ver §Pendências)
- **Data:** 2026-09-30
- **Contato / administrador:** `executar-rotina@outlook.com`
- **Fonte formal:** este ADR e os arquivos `docs/adr/ENV-INVENTORY.md`, `INSTALLED.md`, `SECRETS.md`.

## 1. Contexto
O Hub Editorial (rota `/`) guardava tudo em `localStorage`. Os 6 templates do catálogo Cloudflare
(`Cloudflare_IMPORT.zip`, origem `github.com/cloudflare/templates`) foram usados como base de um backend real.
O plugin **Backend Design 0.2.0** (Anthropic Plugin Directory, MIT) conduziu o desenho (`/design`, 6 passos).

## 2. Decisões
1. **Stack oficial:** React Router 7 + Hono no Cloudflare Workers, D1, Workflows, OpenAuth. Nada de outro framework no runtime.
2. **Um administrador** (`ADMIN_EMAIL`). Leitura e escrita exigem login; o OpenAuth só conclui o login desse e-mail.
3. **Concorrência: último a gravar vence** (PUT idempotente por id de cliente). Aceitável com um único editor.
   **Reavaliar** (coluna `version` + 409) se houver múltiplos editores concorrentes.
4. **API:** `PUT/DELETE /api/hub/:module/:id` (upsert idempotente em vez de POST+PATCH), `GET /api/hub`, `GET /api/vocab`,
   `PUT /api/vocab/:name`, `POST /api/hub/import`, `POST /api/workflows/publish`, `GET /api/workflows/:id`,
   `GET /api/health` (público), OpenAPI em `/api/openapi.json` e docs em `/api/docs`. Envelope de erro `{success:false, errors:[{code,message}]}`.
5. **Sessão:** login por redirecionamento (OAuth code + PKCE); tokens em cookies `HttpOnly`, `SameSite=Lax`, `Secure` em HTTPS;
   defesa CSRF por `Origin` obrigatório nas escritas (`ALLOWED_ORIGIN`).
6. **Workflow de publicação** (`HubPublishWorkflow`): validar → definir `PUBLICADO` → auditar. Instância determinística por
   `recordId + updated_at`; conteúdo já publicado não reexecuta. Status por polling (sem Durable Object).
7. **Auditoria append-only** (`audit_log`, triggers bloqueiam UPDATE/DELETE).
8. **Fallback local:** se a API estiver indisponível (ou por escolha na tela de entrada), o Hub funciona em `localStorage`.

## 3. Design (blueprint Backend Design)
| Passo | Resposta |
|---|---|
| Contexto | API HTTP síncrona (Hono+chanfana/zod), Workflow assíncrono, Worker de auth separado; carga mínima |
| Dados | `records(module,id,code,data JSON,updated_at)`, `vocab`, `audit_log`; PK, `CHECK(json_valid)`, `UNIQUE` parcial por `(module, code)`; migração aditiva `migrations/0001_hub.sql` |
| Falhas | 400 payload · 401 sem sessão · 403 não-admin/origem · 404 · 409 código duplicado · 503 D1/auth fora (cliente cai para local) |
| Autorização | principal = admin; enforcement = middleware `requireAdmin` em tudo exceto `/api/health` e `/api/auth/*` |
| Idempotência | id do cliente + upsert; delete idempotente; publish com instance id determinístico |
| Observabilidade | log JSON por request (`cf-ray`/uuid, rota, status, ms; nunca token/cookie/corpo), `x-request-id`, `/api/health` (`SELECT 1`), Workers Observability ligado |

## 4. Plugins, skills e workflow instalados
Instalado **no repositório** (não só referência):
- `vendor/claude-plugins/backend-design/` — cópia íntegra 0.2.0 + `LICENSE` (MIT) + `STATUS.md`.
- `.claude/skills/` (13), `.claude/commands/` (`/design`, `/audit`, `/review-migration`, `/explain-this-query`, `/hunt-n-plus-one`),
  `.claude/agents/` (6), `.claude/hooks/` (3 scripts Python) ligados em `.claude/settings.json` (PreToolUse `Write|Edit`; só avisam, exit 0).
- Validação: `npm run validate:workflow` (confere cópias idênticas à origem, hooks, `python3`, `wrangler`, `vitest`, `eslint`, dependências, `vendor/`).
- **Não instalado (depende da conta):** plugin **Cloudflare** do Anthropic Directory (skills `workers-best-practices`, `wrangler`, `durable-objects`)
  e o MCP `Cloudflare` — habilitar em claude.ai → Settings → Plugins. O código não depende deles em runtime.
- Versões de todos os pacotes: `docs/adr/INSTALLED.md` (gerado).

## 5. Frameworks e templates
| Template (Cloudflare) | Status | Uso |
|---|---|---|
| `chanfana-openapi-template` | `BASE_FOR_INTEGRATION` | padrão chanfana/zod, testes com `vitest-pool-workers` |
| `d1-template` | `BASE_FOR_INTEGRATION` | migrações D1 |
| `openauth-template` | `BASE_FOR_INTEGRATION` | `auth/` (adaptado: só admin, e-mail via Resend) |
| `workflows-starter-template` | `BASE_FOR_INTEGRATION` | `HubPublishWorkflow` (sem Durable Object) |
| `saas-admin-template` (Astro) | `REFERENCE_FOR_ADAPTATION` | referência de layout/fluxos de admin |
| `remix-starter-template` (To-Do, Remix) | `REFERENCE_FOR_ADAPTATION` | referência de UX de lista |

### Estratégia de adaptação (Astro e Remix)
- Os projetos originais **permanecem preservados** em `vendor/cloudflare-templates/` (`STATUS.md` = `REFERENCE_FOR_ADAPTATION`).
- **Astro e Remix não entram no runtime principal** nesta etapa. **A diferença de framework é o único motivo** — não é descarte.
- Quando uma funcionalidade for necessária, ela é **adaptada/reimplementada** no stack oficial (React Router + Hono + shadcn/tokens do blog).
- Preserva-se o **comportamento funcional e a experiência pretendida**, não a implementação original.
- Toda adaptação futura mantém **referência explícita à origem em `vendor/`** (comentário de cabeçalho + link no PR).
- Fluxo: `VENDOR REFERENCE → ANALYSIS → ADAPTATION → INTEGRATION → TEST → VERIFIED`.
- `vendor/` fica fora de `tsconfig`, lint, build e do `vite-tsconfig-paths`.

## 6. Integrações, arquivos e variáveis
- Bindings: `DB` (D1 `hub-editorial-db`), `HUB_PUBLISH_WORKFLOW`; auth: `AUTH_DB` (D1 `hub-auth-db`), `AUTH_STORAGE` (KV `hub-auth-storage`).
- Configuração: `wrangler.jsonc`, `auth/wrangler.jsonc`, `migrations/`, `auth/migrations/`, `db/seed.sql` (gerado), `vitest.config.mts`, `eslint.config.mjs`, `.github/workflows/ci.yml`, `.npmrc` (`legacy-peer-deps`, por causa do npm 10 × peers do vitest).
- Variáveis, credenciais, ambientes e templates: **`docs/adr/ENV-INVENTORY.md`** e **`docs/adr/SECRETS.md`**. `npm run check:env` falha se alguma variável usada no código não estiver em todos os templates.
- E-mail do administrador/remetente/contato: `executar-rotina@outlook.com` (`ADMIN_EMAIL`, `EMAIL_FROM`, `PROJECT_CONTACT`).

## 7. Premissas
- **"cloud.ai"**: nenhum código consome isso hoje. Interpretado como integração com a plataforma Claude/Anthropic e Cloudflare.
  Reservadas `CLOUD_AI_BASE_URL` / `CLOUD_AI_API_KEY` (placeholders, sem uso). **A confirmar** com o usuário antes de qualquer implementação.
- O plugin Backend Design **não estava habilitado na conta**; foi instalado por cópia do zip enviado.

## 8. Riscos
- Login por código exige provedor de e-mail e domínio verificado; sem isso não há login em produção (em dev o código sai no log).
- `wrangler preview`/Workers Builds: previews têm origem diferente de `ALLOWED_ORIGIN`, então o **login não funciona em previews**
  (a API e o `/api/health` funcionam). O app cai no modo local.
- Último a gravar vence pode sobrescrever edições concorrentes (aceito com 1 editor).
- Um único D1 sem réplica de leitura (carga mínima).

### Auditoria (`/audit` do Backend Design, 2026-09-30)
Corrigidos: (1) login não expõe mais o código no log fora de `development`/`test` (falha fechada); (2) publish idempotente sem depender de texto de erro;
(3) só erros do D1 viram 503, o resto é 500 logado; (4) `set-status` não publica se o status mudou após a validação; (5) testes das rotas `/api/auth/*` e teto de import (2000) antes de montar o batch.
**Abertos (aceitos):** `PUT` pode gravar `PUBLICADO` direto (sem allowlist de campos/transições, 1 admin); listas sem paginação;
métrica de negócio e propagação do `requestId` ao workflow. **Pendente de configuração (não resolvível em código):** regra de **rate limiting**
da Cloudflare em `hub-editorial-auth` (POST de pedido de código) para evitar e-mail-bombing do administrador e consumo da cota do Resend.

## 9. Critérios de validação
`npm run lint` · `npm run typecheck` · `npm test` (22 testes: 401/403/400/404/409, CSRF, sessão `/api/auth/*`, CRUD idempotente, auditoria append-only, seed idempotente, workflow) ·
`npm run build` · `npm run check:env` · `npm run validate:workflow` · `wrangler deploy --dry-run` (app e `auth/`) · `/api/health` = 200 no ambiente publicado.

## 10. Condições para produção (o que ainda depende de credencial externa)
1. `RESEND_API_KEY` (segredo do Worker `auth/`) e **domínio/remetente verificado** para `EMAIL_FROM`.
2. Deploy do Worker `auth/` (`npm run deploy:auth`) com `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID`; confirmar a URL e ajustar `AUTH_ISSUER_URL` se diferir de `https://hub-editorial-auth.executar-rotina-8b7.workers.dev`.
3. Confirmar `ALLOWED_ORIGIN` (ou domínio customizado) no app **e** em `auth/wrangler.jsonc`.
4. `npm run db:seed:remote` (opcional, dados de exemplo) e `npm run db:migrate:remote` (D1 do app já tem o schema aplicado).
5. Confirmar a interpretação de **cloud.ai** (§7).
6. Criar a regra de **rate limiting** no Worker `hub-editorial-auth` (painel Cloudflare → Security → WAF → Rate limiting).
7. Habilitar o plugin Cloudflare na conta (opcional).

## 11. Recursos criados na conta Cloudflare
D1 `hub-editorial-db` (`e1e1d9c4-3ff3-4055-bd11-0613b93ca2fe`, schema aplicado), D1 `hub-auth-db` (`12ace2c0-2d3f-4f6a-ac07-748af5a39ea7`, schema aplicado),
KV `hub-auth-storage` (`3cae01e853154d62acd06d5e3be4664e`), D1 `hub-editorial-db-preview` (`4266dc35-c9f3-4f4e-83a8-8468f8da4478`, staging só para previews; `npm run db:migrate:preview`). Nenhum recurso existente foi alterado.
Previews não têm o binding do Workflow (só pode apontar para um Workflow já existente, isto é, depois do 1º deploy de produção); `POST /api/workflows/publish` responde 503 no preview.

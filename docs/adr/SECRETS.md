# Segredos — como e onde configurar (ADR-001)

Nada aqui contém valores reais. Substitua os placeholders só nos destinos abaixo.

## Worker `auth/` (Cloudflare)
```bash
npx wrangler secret put RESEND_API_KEY -c auth/wrangler.jsonc      # cola a chave do Resend
```

## GitHub Actions (deploy/CI)
Repositório → Settings → Secrets and variables → Actions:
| Nome | Origem |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens (Workers Scripts:Edit, D1:Edit, Workers KV:Edit) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare → Workers & Pages → Account ID |
| `RESEND_API_KEY` | resend.com → API Keys (só se o CI for fazer deploy do `auth/`) |

O workflow `ci.yml` atual **não usa segredos** (só validação).

## Workers Builds (Cloudflare)
As variáveis públicas vêm do `wrangler.jsonc`. Não há segredo no Worker principal.

## Reservadas
`CLOUD_AI_BASE_URL`, `CLOUD_AI_API_KEY`: sem uso; ver ADR-001 §7.

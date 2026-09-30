# Handoff Config

## Verification Commands

test: npm test
typecheck: npm run typecheck
lint: npm run lint
build: npm run build

## Conventions

response_language: pt-BR
handoff_dir:       .handoff
commit_style:      imperative, English subject + Co-Authored-By trailer
convention_docs:   docs/adr/ADR-001-hub-backend-cloudflare.md

## Project Documentation Index

### Agent guidance
- [.claude/skills/](.claude/skills/) — Backend Design (13) + agent-handoff (4)
- [.claude/agents/](.claude/agents/) — agentes do Backend Design + CLP
- [07-execucao/ESTADO.md](07-execucao/ESTADO.md) — estado único (Estratégia 07)

### Project docs
- [README.md](README.md) — visão geral e checklist de lançamento
- [docs/adr/ADR-001-hub-backend-cloudflare.md](docs/adr/ADR-001-hub-backend-cloudflare.md) — backend
- [docs/adr/ADR-002-agentic-editorial-execution.md](docs/adr/ADR-002-agentic-editorial-execution.md) — execução agentic
- [docs/adr/ENV-INVENTORY.md](docs/adr/ENV-INVENTORY.md) — variáveis
- [vendor/agentic-package-v2/](vendor/agentic-package-v2/) — contratos do pacote V2

### Detected toolchain
- package manager: npm (package-lock.json, `.npmrc` legacy-peer-deps)
- runtime: Cloudflare Workers (wrangler 4), React Router 7, Hono, chanfana/zod, D1, Workflows, OpenAuth
- tests: vitest + @cloudflare/vitest-pool-workers

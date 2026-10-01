# Decisões pendentes e divergências (Estratégia 07)

| ID | Divergência / decisão | Situação |
|---|---|---|
| DEC-001 | SoT de Skills: pacote aponta `Sas-Executar/02-Exe-Maestro` como candidata; não verificável daqui | Pendente — USER_ACTION_REQUIRED (ISS-001) |
| DEC-002 | Toolchain pedida (`Agent Design`, `Make Agents`, `Three Steps Workflows`) não existe como skill/plugin descoberto | Registrado `SKILL_UNAVAILABLE`; equivalente usado: agent-handoff (3 estágios) + agentes do Backend Design |
| DEC-003 | `/Brand Guidelines` (Anthropic) × DS do blog (ADR-02/03 do blog) | DS do blog prevalece (override de marca do pacote, `01_GOVERNANCE/04_BRAND_TECHNICAL_OVERRIDE.md`) |
| DEC-004 | Atores `A_DEFINIR` em STG-100/120/130 (visual, vídeo) | Estágios ficam `USER_ACTION_REQUIRED` no workflow |
| DEC-005 | Remetente de e-mail `@outlook.com` não pode ser verificado no Resend | Pendente do usuário (domínio próprio) |
| DEC-006 | IDs de D1/KV do repo apontavam para outra conta Cloudflare (`hub-executar`), e o Worker roda na conta `executar-rotina-8b7` → preview com `db unavailable` | Recursos recriados na conta do Worker (ADR-001 §11); preview fullstack com `build:fullstack` + `wrangler preview -c build/server/wrangler.json`; `/api/health` ok |
| DEC-007 | Conta Cloudflare padrão | Hub.executar (`92fdc1b5…`), conforme o ADR-002 do PROGAMA-LANCAMENTO; bindings, URLs e `account_id` migrados; DEC-006 superada |

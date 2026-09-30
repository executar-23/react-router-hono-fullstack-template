import { applyD1Migrations, env } from "cloudflare:test";

// Roda fora do armazenamento isolado e pode executar várias vezes; só aplica o que falta.
await applyD1Migrations(env.DB, env.MIGRATIONS);

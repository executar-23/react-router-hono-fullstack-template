-- Origem: vendor/cloudflare-templates/openauth-template/migrations/0001_create_user_table.sql
CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY NOT NULL DEFAULT (lower(hex(randomblob(16)))),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

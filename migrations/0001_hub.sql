-- Hub Editorial — schema inicial (ADR-001). Migração aditiva.
-- Invariantes vivem no schema: PK, CHECK(json_valid), UNIQUE parcial por código.

CREATE TABLE IF NOT EXISTS records (
  module     TEXT NOT NULL,
  id         TEXT NOT NULL,
  code       TEXT,
  data       TEXT NOT NULL CHECK (json_valid(data)),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (module, id)
);

-- Content_ID e afins: único por módulo quando preenchido.
CREATE UNIQUE INDEX IF NOT EXISTS records_module_code
  ON records (module, code)
  WHERE code IS NOT NULL AND code <> '';

CREATE INDEX IF NOT EXISTS records_module_updated
  ON records (module, updated_at DESC);

CREATE TABLE IF NOT EXISTS vocab (
  name       TEXT PRIMARY KEY,
  items      TEXT NOT NULL CHECK (json_valid(items)),
  updated_at TEXT NOT NULL
);

-- Trilha de auditoria append-only: sem rota de update/delete e bloqueada por trigger.
CREATE TABLE IF NOT EXISTS audit_log (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  at        TEXT NOT NULL,
  actor     TEXT NOT NULL,
  action    TEXT NOT NULL,
  module    TEXT,
  record_id TEXT,
  detail    TEXT
);

CREATE TRIGGER IF NOT EXISTS audit_log_no_update
BEFORE UPDATE ON audit_log
BEGIN
  SELECT RAISE(ABORT, 'audit_log is append-only');
END;

CREATE TRIGGER IF NOT EXISTS audit_log_no_delete
BEFORE DELETE ON audit_log
BEGIN
  SELECT RAISE(ABORT, 'audit_log is append-only');
END;

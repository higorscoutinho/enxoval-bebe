CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  tamanho TEXT NOT NULL,
  preciso INTEGER NOT NULL DEFAULT 1,
  tenho INTEGER NOT NULL DEFAULT 0,
  origem TEXT NOT NULL DEFAULT 'planejado',
  notas TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  icon TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

INSERT INTO settings (key, value) VALUES ('title', 'Enxoval da Bebê')
ON CONFLICT (key) DO NOTHING;

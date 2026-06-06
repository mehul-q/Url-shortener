CREATE TABLE urls (
  id           SERIAL PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code   VARCHAR(10) UNIQUE NOT NULL,
  custom_alias VARCHAR(50) UNIQUE,
  created_at   TIMESTAMP DEFAULT NOW(),
  expires_at   TIMESTAMP,
  is_active    BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_short_code ON urls(short_code);
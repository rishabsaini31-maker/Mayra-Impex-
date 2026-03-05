-- Add token version column for access-token revocation checks
ALTER TABLE users
ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_users_token_version ON users(token_version);

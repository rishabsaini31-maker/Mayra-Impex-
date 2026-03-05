-- Security hardening migration for production

-- 1) Users table hardening
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS account_locked_until TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Ensure case-insensitive unique email among active users
DROP INDEX IF EXISTS idx_users_email_unique_active;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique_active
  ON users (LOWER(email))
  WHERE deleted_at IS NULL;

-- 2) Soft-delete support for catalog tables
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_categories_deleted_at ON categories(deleted_at);
CREATE INDEX IF NOT EXISTS idx_products_deleted_at ON products(deleted_at);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);

-- 3) Refresh token store (hashed tokens only)
CREATE TABLE IF NOT EXISTS user_refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  created_by_ip TEXT,
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  revoked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_refresh_token_hash_unique
  ON user_refresh_tokens(token_hash);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id
  ON user_refresh_tokens(user_id);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at
  ON user_refresh_tokens(expires_at);

-- 4) Optional cleanup helper (run periodically)
-- DELETE FROM user_refresh_tokens
-- WHERE revoked_at IS NOT NULL OR expires_at < NOW();

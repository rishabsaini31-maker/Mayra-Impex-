-- Add is_blocked column to users table
ALTER TABLE users ADD COLUMN is_blocked BOOLEAN DEFAULT false;

-- Create index for blocked users
CREATE INDEX idx_users_is_blocked ON users(is_blocked);

-- Migration complete

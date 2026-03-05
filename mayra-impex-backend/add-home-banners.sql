-- Create home_banners table for slider images
CREATE TABLE IF NOT EXISTS home_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster ordering
CREATE INDEX IF NOT EXISTS idx_home_banners_display_order ON home_banners(display_order);

-- Enable RLS
ALTER TABLE home_banners ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists, then create new one
DROP POLICY IF EXISTS "Allow public read access to active home banners" ON home_banners;

-- Allow public read access to active banners
CREATE POLICY "Allow public read access to active home banners"
  ON home_banners
  FOR SELECT
  USING (is_active = true);

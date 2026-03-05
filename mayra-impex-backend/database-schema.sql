-- Mayra Impex Database Schema for Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(10) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  serial_number VARCHAR(100),
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  delivery_name VARCHAR(100) NOT NULL,
  delivery_phone VARCHAR(10) NOT NULL,
  shop_name VARCHAR(100) NOT NULL,
  delivery_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);

-- Home slider banners table
CREATE TABLE home_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES for Performance
-- ============================================

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE UNIQUE INDEX idx_products_serial_number_unique
  ON products (LOWER(serial_number))
  WHERE serial_number IS NOT NULL;
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_home_banners_display_order ON home_banners(display_order);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_banners ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read their own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Categories policies (public read)
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

-- Products policies (public read for active products)
CREATE POLICY "Active products are viewable by everyone" ON products
  FOR SELECT USING (is_active = true OR auth.role() = 'admin');

-- Orders policies
CREATE POLICY "Customers can view their own orders" ON orders
  FOR SELECT USING (auth.uid()::text = customer_id::text);

CREATE POLICY "Customers can create their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid()::text = customer_id::text);

-- Order items policies
CREATE POLICY "Users can view order items of their orders" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.customer_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert order items for their orders" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.customer_id::text = auth.uid()::text
    )
  );

-- Home banners policies (public read)
CREATE POLICY "Home banners are viewable by everyone" ON home_banners
  FOR SELECT USING (is_active = true OR auth.role() = 'admin');

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create storage buckets for product images and order PDFs
-- Run these in Supabase Dashboard > Storage

-- Bucket: product-images
-- Public: Yes
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/webp

-- Bucket: order-pdfs
-- Public: Yes (or No, depending on security requirements)
-- File size limit: 10MB
-- Allowed MIME types: application/pdf

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Create an admin user (password: admin123)
INSERT INTO users (name, email, phone, password_hash, role) VALUES
('Admin User', 'admin@mayraimpex.com', '9999999999', '$2b$10$rGHvxzqF5Kg0vd3F3Q6xqe5g5eMqGZ6mF4K1y7C3z4D5e6F7g8H9i', 'admin');

-- Create sample categories
INSERT INTO categories (name) VALUES
('Electronics'),
('Clothing'),
('Home & Kitchen'),
('Stationery'),
('Groceries');

-- Note: To create storage buckets, go to Supabase Dashboard:
-- 1. Navigate to Storage
-- 2. Create new bucket: "product-images" (Public)
-- 3. Create new bucket: "order-pdfs" (Public or Private based on requirements)

-- Storage policies for product-images (if using RLS)
-- Allow public read access
-- INSERT INTO storage.policies (bucket_id, name, definition)
-- VALUES ('product-images', 'Public read access', 'bucket_id = ''product-images''');

-- ============================================
-- IMPORTANT NOTES
-- ============================================

-- 1. After running this schema, create an admin user with a proper hashed password
-- 2. Set up the storage buckets in Supabase Dashboard
-- 3. Configure RLS policies according to your security requirements
-- 4. The backend uses service role key which bypasses RLS
-- 5. For production, ensure all environment variables are properly configured
-- 6. Regular backups should be configured in Supabase Dashboard

-- ============================================
-- BACKUP AND MAINTENANCE
-- ============================================

-- To backup data:
-- pg_dump -h <host> -U <user> -d <database> > backup.sql

-- To restore:
-- psql -h <host> -U <user> -d <database> < backup.sql

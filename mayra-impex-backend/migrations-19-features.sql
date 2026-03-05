-- Mayra Impex - Database Migrations for 19 Feature Implementation
-- Execute these in Supabase SQL Editor

-- 1. Activity Logs Table (Audit Trail)
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(100),
  details TEXT,
  previous_value JSONB,
  new_value JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_admin ON activity_logs(admin_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);

-- 2. Customer Notes Table
CREATE TABLE IF NOT EXISTS customer_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  added_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_customer_notes_customer ON customer_notes(customer_id);
CREATE INDEX idx_customer_notes_created ON customer_notes(created_at DESC);

-- 3. Product Inventory Table (Quantity Tracking)
CREATE TABLE IF NOT EXISTS product_inventory (
  product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 0 CHECK (quantity >= 0),
  last_restocked TIMESTAMP,
  low_stock_threshold INTEGER DEFAULT 5,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_product_inventory_quantity ON product_inventory(quantity);
CREATE INDEX idx_product_inventory_low_stock ON product_inventory(quantity, low_stock_threshold) WHERE quantity <= low_stock_threshold;

-- 4. Add missing columns to Products (if not exists)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS sku VARCHAR(100) UNIQUE,
ADD COLUMN IF NOT EXISTS supplier_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS was_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS discount_percentage INTEGER DEFAULT 0;

-- 5. Add missing columns to Orders (if not exists)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50),
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10, 2);

-- 6. Create View for Sales Analytics
CREATE OR REPLACE VIEW sales_analytics AS
SELECT 
  DATE_TRUNC('day', o.created_at)::DATE as date,
  COUNT(DISTINCT o.id) as orders_count,
  COUNT(DISTINCT o.user_id) as unique_customers,
  SUM(oi.quantity * p.price) as total_revenue
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id
WHERE o.status = 'approved'
GROUP BY DATE_TRUNC('day', o.created_at)::DATE
ORDER BY date DESC;

-- 7. Create View for Low Stock Products
CREATE OR REPLACE VIEW low_stock_products AS
SELECT 
  p.id,
  p.name,
  pi.quantity,
  pi.low_stock_threshold,
  c.name as category
FROM products p
LEFT JOIN product_inventory pi ON p.id = pi.product_id
LEFT JOIN categories c ON p.category_id = c.id
WHERE pi.quantity <= COALESCE(pi.low_stock_threshold, 5) OR pi.quantity IS NULL
ORDER BY pi.quantity ASC;

-- 8. Create View for Customer Segments
CREATE OR REPLACE VIEW customer_segments AS
WITH customer_stats AS (
  SELECT 
    u.id,
    u.name,
    u.email,
    u.phone,
    COUNT(DISTINCT o.id) as total_orders,
    SUM(oi.quantity * p.price) as total_spent,
    MAX(o.created_at) as last_order_date
  FROM users u
  LEFT JOIN orders o ON u.id = o.user_id AND o.status = 'approved'
  LEFT JOIN order_items oi ON o.id = oi.order_id
  LEFT JOIN products p ON oi.product_id = p.id
  WHERE u.role = 'customer'
  GROUP BY u.id, u.name, u.email, u.phone
)
SELECT 
  id,
  name,
  email,
  phone,
  total_orders,
  total_spent,
  last_order_date,
  CASE 
    WHEN total_orders >= 5 THEN 'VIP'
    WHEN total_orders >= 3 THEN 'High Spender'
    WHEN total_orders >= 1 AND last_order_date > NOW() - INTERVAL '30 days' THEN 'Active'
    WHEN total_orders >= 1 THEN 'Inactive'
    ELSE 'New'
  END as segment
FROM customer_stats
ORDER BY total_spent DESC;

-- 9. Create function for activity logging
CREATE OR REPLACE FUNCTION log_activity(
  p_admin_id UUID,
  p_action VARCHAR,
  p_entity_type VARCHAR,
  p_entity_id VARCHAR,
  p_details TEXT DEFAULT NULL,
  p_previous_value JSONB DEFAULT NULL,
  p_new_value JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO activity_logs (admin_id, action, entity_type, entity_id, details, previous_value, new_value)
  VALUES (p_admin_id, p_action, p_entity_type, p_entity_id, p_details, p_previous_value, p_new_value)
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- 10. Enable RLS (Row Level Security) on new tables
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_inventory ENABLE ROW LEVEL SECURITY;

-- Activity Logs RLS Policy
CREATE POLICY "Admins can view activity logs" ON activity_logs
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

CREATE POLICY "Admins can insert activity logs" ON activity_logs
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- Customer Notes RLS Policy
CREATE POLICY "Admins can manage customer notes" ON customer_notes
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  ) WITH CHECK (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- Product Inventory RLS Policy
CREATE POLICY "Admins can manage inventory" ON product_inventory
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  ) WITH CHECK (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- 11. Grant permissions
GRANT SELECT ON sales_analytics TO authenticated;
GRANT SELECT ON low_stock_products TO authenticated;
GRANT SELECT ON customer_segments TO authenticated;

-- Migration Status
-- ✅ Complete - All tables, indexes, views, and functions created
-- Ready for backend integration

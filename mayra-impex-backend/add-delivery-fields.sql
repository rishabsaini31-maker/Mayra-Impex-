ALTER TABLE orders
ADD COLUMN IF NOT EXISTS delivery_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS delivery_phone VARCHAR(10),
ADD COLUMN IF NOT EXISTS shop_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS delivery_address TEXT;

UPDATE orders
SET delivery_name = COALESCE(delivery_name, 'Customer'),
    delivery_phone = COALESCE(delivery_phone, '0000000000'),
    shop_name = COALESCE(shop_name, 'N/A'),
    delivery_address = COALESCE(delivery_address, 'N/A')
WHERE delivery_name IS NULL
   OR delivery_phone IS NULL
   OR shop_name IS NULL
   OR delivery_address IS NULL;

ALTER TABLE orders ALTER COLUMN delivery_name SET NOT NULL;
ALTER TABLE orders ALTER COLUMN delivery_phone SET NOT NULL;
ALTER TABLE orders ALTER COLUMN shop_name SET NOT NULL;
ALTER TABLE orders ALTER COLUMN delivery_address SET NOT NULL;

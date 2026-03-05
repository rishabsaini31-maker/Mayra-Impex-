ALTER TABLE products
ADD COLUMN IF NOT EXISTS serial_number VARCHAR(100);

UPDATE products
SET serial_number = NULLIF(TRIM(serial_number), '')
WHERE serial_number IS NOT NULL;

DROP INDEX IF EXISTS idx_products_serial_number;

CREATE UNIQUE INDEX IF NOT EXISTS idx_products_serial_number_unique
ON products (LOWER(serial_number))
WHERE serial_number IS NOT NULL;

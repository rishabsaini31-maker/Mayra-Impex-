-- Add delivery_address column to orders table (PostgreSQL)
ALTER TABLE orders
ADD COLUMN delivery_address TEXT;
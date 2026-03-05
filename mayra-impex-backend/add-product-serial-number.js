require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function addProductSerialNumber() {
  try {
    console.log("🔄 Adding serial_number column to products table...");

    const { error } = await supabase.rpc("exec_sql", {
      sql: `
        ALTER TABLE products
        ADD COLUMN IF NOT EXISTS serial_number VARCHAR(100);

        UPDATE products
        SET serial_number = NULLIF(TRIM(serial_number), '')
        WHERE serial_number IS NOT NULL;

        DROP INDEX IF EXISTS idx_products_serial_number;

        CREATE UNIQUE INDEX IF NOT EXISTS idx_products_serial_number_unique
        ON products (LOWER(serial_number))
        WHERE serial_number IS NOT NULL;
      `,
    });

    if (error) {
      console.error("❌ Error:", error);
      process.exit(1);
    }

    console.log(
      "✅ serial_number column and unique index created successfully!",
    );
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

addProductSerialNumber();

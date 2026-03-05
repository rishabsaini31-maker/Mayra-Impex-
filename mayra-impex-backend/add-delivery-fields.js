// Add delivery address fields to orders table
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function addDeliveryFields() {
  try {
    console.log("🔄 Adding delivery address fields to orders table...");

    // Using raw SQL to alter the table
    // This will add the new columns if they don't exist
    const { error } = await supabase.rpc("exec_sql", {
      sql: `
        ALTER TABLE orders
        ADD COLUMN IF NOT EXISTS delivery_address TEXT,
        ADD COLUMN IF NOT EXISTS shop_name VARCHAR(100),
        ADD COLUMN IF NOT EXISTS delivery_phone VARCHAR(10),
        ADD COLUMN IF NOT EXISTS delivery_name VARCHAR(100);
      `,
    });

    if (error && !error.message.includes("already exists")) {
      console.error("Error:", error);
      process.exit(1);
    }

    console.log("✅ Delivery fields added successfully!");

    // Alternatively, if the above doesn't work, you can use a simpler approach:
    // Just create a migration that runs this in Supabase SQL Editor:
    // ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_address TEXT;
    // ALTER TABLE orders ADD COLUMN IF NOT EXISTS shop_name VARCHAR(100);
    // ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_phone VARCHAR(10);
    // ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_name VARCHAR(100);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

addDeliveryFields();

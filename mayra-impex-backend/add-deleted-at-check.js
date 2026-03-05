require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function addDeletedAtColumns() {
  console.log("🔄 Adding deleted_at columns to tables...");

  try {
    // Check if categories table has deleted_at column
    const { data: categoriesTest, error: categoriesError } = await supabase
      .from("categories")
      .select("deleted_at")
      .limit(1);

    if (categoriesError && categoriesError.code === "42703") {
      console.log("❌ Categories table is missing deleted_at column");
      console.log(
        "⚠️  Please run the following SQL in your Supabase SQL Editor:",
      );
      console.log("\n" + "=".repeat(60));
      console.log(
        `
-- Add deleted_at columns for soft delete functionality

ALTER TABLE categories ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE products ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE orders ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE home_banners ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create indexes for better query performance
CREATE INDEX idx_categories_deleted_at ON categories(deleted_at);
CREATE INDEX idx_products_deleted_at ON products(deleted_at);
CREATE INDEX idx_orders_deleted_at ON orders(deleted_at);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);
CREATE INDEX idx_home_banners_deleted_at ON home_banners(deleted_at);
      `.trim(),
      );
      console.log("\n" + "=".repeat(60));
      console.log("\n📝 Steps:");
      console.log("1. Go to your Supabase Dashboard");
      console.log("2. Navigate to SQL Editor");
      console.log("3. Copy and paste the SQL above");
      console.log("4. Run the query");
      console.log("5. Restart your backend server\n");
      process.exit(1);
    } else if (categoriesError) {
      throw categoriesError;
    } else {
      console.log("✅ deleted_at column already exists");
      console.log("✅ All tables are properly configured");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

addDeletedAtColumns();

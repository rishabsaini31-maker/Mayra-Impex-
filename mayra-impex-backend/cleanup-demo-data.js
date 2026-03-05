require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function cleanupDemoData() {
  try {
    console.log("🧹 Starting cleanup of demo data...\n");

    // Delete all order items first (no foreign key dependencies)
    const { error: orderItemsError } = await supabase
      .from("order_items")
      .delete()
      .not("id", "is", null); // Delete all records

    if (orderItemsError) {
      console.error("Error deleting order items:", orderItemsError);
    } else {
      console.log("✅ Deleted all order items");
    }

    // Delete all orders (must be before customers due to FK)
    const { error: ordersError } = await supabase
      .from("orders")
      .delete()
      .not("id", "is", null); // Delete all records

    if (ordersError) {
      console.error("Error deleting orders:", ordersError);
    } else {
      console.log("✅ Deleted all orders");
    }

    // Delete all products
    const { error: productsError } = await supabase
      .from("products")
      .delete()
      .not("id", "is", null); // Delete all records

    if (productsError) {
      console.error("Error deleting products:", productsError);
    } else {
      console.log("✅ Deleted all products");
    }

    // Delete all categories
    const { error: categoriesError } = await supabase
      .from("categories")
      .delete()
      .not("id", "is", null); // Delete all records

    if (categoriesError) {
      console.error("Error deleting categories:", categoriesError);
    } else {
      console.log("✅ Deleted all categories");
    }

    // Delete all demo customers (keeping only admin)
    const { error: customersError } = await supabase
      .from("users")
      .delete()
      .eq("role", "customer");

    if (customersError) {
      console.error("Error deleting customers:", customersError);
    } else {
      console.log("✅ Deleted all demo customers");
    }

    console.log("\n✨ Demo data cleanup completed successfully!");
    console.log(
      "📝 Note: The admin account (rishabsainiupw165@gmail.com) has been preserved.",
    );
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
  }
}

cleanupDemoData();

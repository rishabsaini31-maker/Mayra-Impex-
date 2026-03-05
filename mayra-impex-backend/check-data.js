require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function checkData() {
  try {
    console.log("📊 Checking database data...\n");

    // Check categories
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("*");

    console.log(`📁 Categories: ${categories?.length || 0}`);
    if (categories && categories.length > 0) {
      categories.slice(0, 3).forEach((cat) => {
        console.log(`   - ${cat.name}`);
      });
    }

    // Check products
    const { data: products, error: prodError } = await supabase
      .from("products")
      .select("*, categories(name)");

    console.log(`\n📦 Products: ${products?.length || 0}`);
    if (products && products.length > 0) {
      products.slice(0, 3).forEach((prod) => {
        console.log(
          `   - ${prod.name} (₹${prod.price}) - ${prod.categories?.name || "N/A"}`,
        );
      });
    }

    // Check customers
    const { data: customers, error: custError } = await supabase
      .from("users")
      .select("*")
      .eq("role", "customer");

    console.log(`\n👥 Customers: ${customers?.length || 0}`);
    if (customers && customers.length > 0) {
      customers.forEach((cust) => {
        console.log(`   - ${cust.name} (${cust.email})`);
      });
    }

    // Check orders
    const { data: orders, error: ordError } = await supabase
      .from("orders")
      .select("*");

    console.log(`\n📋 Orders: ${orders?.length || 0}`);
    if (orders && orders.length > 0) {
      orders.forEach((order) => {
        console.log(
          `   - Order #${order.id.substring(0, 8)} - ${order.status} - ${order.delivery_name}`,
        );
      });
    }

    console.log("\n✅ Data check complete!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

checkData();

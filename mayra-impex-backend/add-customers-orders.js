require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function addCustomersAndOrders() {
  try {
    console.log("👥 Adding customers and orders...\n");

    // Add sample customers
    const { data: customerData, error: customerError } = await supabase
      .from("users")
      .insert([
        {
          name: "Rajesh Kumar",
          email: "rajesh.kumar@example.com",
          password_hash: "$2a$10$abcdefghijklmnopqrstuvwxyz123456",
          phone: "9123456780",
          role: "customer",
        },
        {
          name: "Priya Sharma",
          email: "priya.sharma@example.com",
          password_hash: "$2a$10$abcdefghijklmnopqrstuvwxyz123456",
          phone: "9123456781",
          role: "customer",
        },
        {
          name: "Amit Patel",
          email: "amit.patel@example.com",
          password_hash: "$2a$10$abcdefghijklmnopqrstuvwxyz123456",
          phone: "9123456782",
          role: "customer",
        },
      ])
      .select();

    if (customerError) {
      console.error("Error adding customers:", customerError);
      return;
    }

    console.log(`✅ Added ${customerData.length} customers`);

    // Get some products for orders
    const { data: products } = await supabase
      .from("products")
      .select("*")
      .limit(5);

    // Add sample orders
    const orders = [
      {
        customer_id: customerData[0].id,
        status: "pending",
        delivery_name: customerData[0].name,
        delivery_phone: customerData[0].phone,
        shop_name: "Kumar Gifts Store",
        delivery_address: "123 MG Road, Bangalore, Karnataka - 560001",
      },
      {
        customer_id: customerData[1].id,
        status: "approved",
        delivery_name: customerData[1].name,
        delivery_phone: customerData[1].phone,
        shop_name: "Sharma Gift Emporium",
        delivery_address: "456 Park Street, Kolkata, West Bengal - 700016",
      },
      {
        customer_id: customerData[2].id,
        status: "approved",
        delivery_name: customerData[2].name,
        delivery_phone: customerData[2].phone,
        shop_name: "Patel Wholesale Mart",
        delivery_address: "789 FC Road, Pune, Maharashtra - 411004",
      },
    ];

    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .insert(orders)
      .select();

    if (ordersError) {
      console.error("Error adding orders:", ordersError);
      return;
    }

    console.log(`✅ Added ${ordersData.length} orders`);

    // Add order items
    if (products && products.length >= 5) {
      const orderItems = [
        {
          order_id: ordersData[0].id,
          product_id: products[0].id,
          quantity: 2,
        },
        {
          order_id: ordersData[0].id,
          product_id: products[1].id,
          quantity: 1,
        },
        {
          order_id: ordersData[1].id,
          product_id: products[2].id,
          quantity: 3,
        },
        {
          order_id: ordersData[1].id,
          product_id: products[3].id,
          quantity: 1,
        },
        {
          order_id: ordersData[2].id,
          product_id: products[4].id,
          quantity: 5,
        },
      ];

      const { data: orderItemsData, error: orderItemsError } = await supabase
        .from("order_items")
        .insert(orderItems)
        .select();

      if (orderItemsError) {
        console.error("Error adding order items:", orderItemsError);
        return;
      }

      console.log(`✅ Added ${orderItemsData.length} order items`);
    }

    console.log("\n✨ Customers and orders added successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

addCustomersAndOrders();

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function addSampleOrders() {
  try {
    console.log("📋 Adding sample orders...\n");

    // Get customers
    const { data: customers } = await supabase
      .from("users")
      .select("*")
      .eq("role", "customer")
      .limit(3);

    if (!customers || customers.length === 0) {
      console.log("No customers found!");
      return;
    }

    // Get products
    const { data: products } = await supabase
      .from("products")
      .select("*")
      .limit(5);

    if (!products || products.length === 0) {
      console.log("No products found!");
      return;
    }

    // Add orders
    const orders = [
      {
        customer_id: customers[0].id,
        status: "pending",
        delivery_name: customers[0].name,
        delivery_phone: customers[0].phone,
        shop_name: "Kumar Gifts Store",
        delivery_address: "123 MG Road, Bangalore, Karnataka - 560001",
      },
      {
        customer_id: customers[1].id,
        status: "approved",
        delivery_name: customers[1].name,
        delivery_phone: customers[1].phone,
        shop_name: "Sharma Gift Emporium",
        delivery_address: "456 Park Street, Kolkata, West Bengal - 700016",
      },
      {
        customer_id: customers[2].id,
        status: "approved",
        delivery_name: customers[2].name,
        delivery_phone: customers[2].phone,
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
      // Try without the delivery fields
      console.log("\n Trying without delivery fields...");

      const simpleOrders = orders.map((order) => ({
        customer_id: order.customer_id,
        status: order.status,
      }));

      const { data: simpleOrdersData, error: simpleError } = await supabase
        .from("orders")
        .insert(simpleOrders)
        .select();

      if (simpleError) {
        console.error("Error adding simple orders:", simpleError);
        return;
      }

      console.log(
        `✅ Added ${simpleOrdersData.length} orders (without delivery info)`,
      );

      // Add order items
      const orderItems = [
        {
          order_id: simpleOrdersData[0].id,
          product_id: products[0].id,
          quantity: 2,
        },
        {
          order_id: simpleOrdersData[0].id,
          product_id: products[1].id,
          quantity: 1,
        },
        {
          order_id: simpleOrdersData[1].id,
          product_id: products[2].id,
          quantity: 3,
        },
        {
          order_id: simpleOrdersData[1].id,
          product_id: products[3].id,
          quantity: 1,
        },
        {
          order_id: simpleOrdersData[2].id,
          product_id: products[4].id,
          quantity: 5,
        },
      ];

      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems)
        .select();

      if (itemsError) {
        console.error("Error adding order items:", itemsError);
        return;
      }

      console.log(`✅ Added ${itemsData.length} order items`);
      console.log("\n✨ Sample orders added successfully!");
      return;
    }

    console.log(`✅ Added ${ordersData.length} orders`);

    // Add order items
    const orderItems = [
      { order_id: ordersData[0].id, product_id: products[0].id, quantity: 2 },
      { order_id: ordersData[0].id, product_id: products[1].id, quantity: 1 },
      { order_id: ordersData[1].id, product_id: products[2].id, quantity: 3 },
      { order_id: ordersData[1].id, product_id: products[3].id, quantity: 1 },
      { order_id: ordersData[2].id, product_id: products[4].id, quantity: 5 },
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
    console.log("\n✨ Sample orders added successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

addSampleOrders();

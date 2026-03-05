require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function addSampleData() {
  try {
    console.log("📦 Adding sample data...\n");

    // Add Categories
    const categories = [
      { name: "Decorative Items" },
      { name: "Kitchen Essentials" },
      { name: "Home Decor" },
      { name: "Gift Sets" },
      { name: "Seasonal Items" },
    ];

    const { data: categoriesData, error: categoriesError } = await supabase
      .from("categories")
      .insert(categories)
      .select();

    if (categoriesError) {
      console.error("Error adding categories:", categoriesError);
      return;
    }

    console.log(`✅ Added ${categoriesData.length} categories`);

    // Add Products
    const products = [
      {
        name: "Premium Glass Vase Set",
        description: "Elegant set of 3 glass vases for home decoration",
        price: 2499,
        category_id: categoriesData[0].id,
        is_active: true,
      },
      {
        name: "Ceramic Dinner Set (24 pieces)",
        description: "Complete dinner set for 6 people with elegant design",
        price: 4999,
        category_id: categoriesData[1].id,
        is_active: true,
      },
      {
        name: "Decorative Wall Clock",
        description: "Modern minimalist wall clock for living room",
        price: 1799,
        category_id: categoriesData[2].id,
        is_active: true,
      },
      {
        name: "Luxury Gift Hamper",
        description: "Premium gift hamper with assorted items",
        price: 3499,
        category_id: categoriesData[3].id,
        is_active: true,
      },
      {
        name: "Diwali Special Lantern Set",
        description: "Beautiful set of 5 decorative lanterns",
        price: 1999,
        category_id: categoriesData[4].id,
        is_active: true,
      },
      {
        name: "Crystal Showpiece",
        description: "Handcrafted crystal showpiece for display",
        price: 3999,
        category_id: categoriesData[0].id,
        is_active: true,
      },
      {
        name: "Stainless Steel Cookware Set",
        description: "5-piece premium cookware set",
        price: 5999,
        category_id: categoriesData[1].id,
        is_active: true,
      },
      {
        name: "Designer Table Lamp",
        description: "Modern LED table lamp with adjustable brightness",
        price: 2299,
        category_id: categoriesData[2].id,
        is_active: true,
      },
      {
        name: "Wedding Gift Box",
        description: "Elegant gift box for weddings and special occasions",
        price: 4499,
        category_id: categoriesData[3].id,
        is_active: true,
      },
      {
        name: "Christmas Decoration Set",
        description: "Complete set of Christmas decorations",
        price: 2999,
        category_id: categoriesData[4].id,
        is_active: true,
      },
    ];

    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .insert(products)
      .select();

    if (productsError) {
      console.error("Error adding products:", productsError);
      return;
    }

    console.log(`✅ Added ${productsData.length} products`);

    // Add a sample customer
    const { data: customerData, error: customerError } = await supabase
      .from("users")
      .insert([
        {
          name: "Rajesh Kumar",
          email: "rajesh.kumar@example.com",
          password_hash: "$2a$10$abcdefghijklmnopqrstuvwxyz123456", // Hashed password
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

    console.log(`✅ Added ${customerData.length} sample customers`);

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

    console.log(`✅ Added ${ordersData.length} sample orders`);

    // Add order items
    const orderItems = [
      {
        order_id: ordersData[0].id,
        product_id: productsData[0].id,
        quantity: 2,
      },
      {
        order_id: ordersData[0].id,
        product_id: productsData[2].id,
        quantity: 1,
      },
      {
        order_id: ordersData[1].id,
        product_id: productsData[1].id,
        quantity: 1,
      },
      {
        order_id: ordersData[1].id,
        product_id: productsData[6].id,
        quantity: 1,
      },
      {
        order_id: ordersData[2].id,
        product_id: productsData[4].id,
        quantity: 2,
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

    console.log("\n✨ Sample data added successfully!");
    console.log(`📊 Summary:`);
    console.log(`   Categories: ${categoriesData.length}`);
    console.log(`   Products: ${productsData.length}`);
    console.log(`   Customers: ${customerData.length}`);
    console.log(`   Orders: ${ordersData.length}`);
    console.log(`   Order Items: ${orderItemsData.length}`);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

addSampleData();

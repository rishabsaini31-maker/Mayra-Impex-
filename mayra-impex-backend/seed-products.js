require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const sampleProducts = [
  {
    name: "Premium Cotton Fabric",
    description: "High-quality cotton fabric for textiles industry",
    price: 250.0,
    is_active: true,
    image_url:
      "https://images.unsplash.com/photo-1558769132-cb1aea8f5e7f?w=400&h=400&fit=crop",
  },
  {
    name: "LED Smart Bulb",
    description: "Energy efficient LED bulb with smart features",
    price: 450.0,
    is_active: true,
    image_url:
      "https://images.unsplash.com/photo-1550985616-10810253b84d?w=400&h=400&fit=crop",
  },
  {
    name: "Organic Rice 25kg",
    description: "Premium organic basmati rice bulk pack",
    price: 1850.0,
    is_active: true,
    image_url:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
  },
  {
    name: "Stainless Steel Pipes",
    description: "Industrial grade stainless steel pipes",
    price: 3200.0,
    is_active: true,
    image_url:
      "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&h=400&fit=crop",
  },
  {
    name: "Wireless Earbuds",
    description: "Bluetooth 5.0 wireless earbuds with charging case",
    price: 1299.0,
    is_active: true,
    image_url:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
  },
  {
    name: "Corrugated Boxes Pack",
    description: "Heavy-duty packaging boxes (Pack of 100)",
    price: 850.0,
    is_active: true,
    image_url:
      "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=400&h=400&fit=crop",
  },
  {
    name: "Hand Sanitizer 5L",
    description: "Antibacterial hand sanitizer bulk pack",
    price: 950.0,
    is_active: true,
    image_url:
      "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400&h=400&fit=crop",
  },
  {
    name: "Power Bank 20000mAh",
    description: "Fast charging portable power bank",
    price: 1599.0,
    is_active: true,
    image_url:
      "https://images.unsplash.com/photo-1609091839397-a88fc1e71ee0?w=400&h=400&fit=crop",
  },
  {
    name: "Extra Virgin Olive Oil",
    description: "Premium olive oil 5L for commercial use",
    price: 2400.0,
    is_active: true,
    image_url:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop",
  },
  {
    name: "Genuine Leather Wallet",
    description: "Premium genuine leather mens wallet",
    price: 799.0,
    is_active: true,
    image_url:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop",
  },
];

async function seedProducts() {
  console.log("🌱 Creating sample products...\n");

  // First, get or create a default category
  let { data: categories, error: catError } = await supabase
    .from("categories")
    .select("*")
    .limit(1);

  if (catError) {
    console.error("❌ Error fetching categories:", catError.message);
    process.exit(1);
  }

  let categoryId;
  if (!categories || categories.length === 0) {
    console.log("Creating default category...");
    const { data: newCat, error: createError } = await supabase
      .from("categories")
      .insert({ name: "General", description: "General products" })
      .select()
      .single();

    if (createError) {
      console.error("❌ Error creating category:", createError.message);
      process.exit(1);
    }
    categoryId = newCat.id;
    console.log(`✓ Created category: ${newCat.name} (ID: ${categoryId})\n`);
  } else {
    categoryId = categories[0].id;
    console.log(`Using category: ${categories[0].name} (ID: ${categoryId})\n`);
  }

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const product of sampleProducts) {
    const productWithCategory = {
      ...product,
      category_id: categoryId,
    };

    const { data, error } = await supabase
      .from("products")
      .insert(productWithCategory)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        console.log(`⊘ Skipped: ${product.name} (already exists)`);
        skipped++;
      } else {
        console.error(`✗ Error creating ${product.name}:`, error.message);
        failed++;
      }
    } else {
      console.log(`✓ Created: ${product.name}`);
      created++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Created: ${created}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Failed: ${failed}`);
  console.log(`\n✅ Done!`);
}

seedProducts().catch((error) => {
  console.error("❌ Fatal error:", error.message);
  process.exit(1);
});

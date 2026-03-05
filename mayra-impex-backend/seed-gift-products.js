require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const giftProducts = {
  "Birthday Gifts": [
    {
      name: "Birthday Photo Frame",
      description: "Beautiful personalized photo frame for birthday memories",
      price: 599,
      image_url:
        "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop",
    },
    {
      name: "Birthday Cake Topper Set",
      description: "Elegant cake topper with birthday theme decorations",
      price: 349,
      image_url:
        "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&h=400&fit=crop",
    },
  ],
  "Valentine's Gifts": [
    {
      name: "Love Heart Pendant",
      description: "Sterling silver heart pendant for your loved one",
      price: 1299,
      image_url:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
    },
    {
      name: "Valentine's Day Gift Box",
      description: "Luxury gift box with chocolates and rose petals",
      price: 899,
      image_url:
        "https://images.unsplash.com/photo-1549042919-39d2be87c2d6?w=400&h=400&fit=crop",
    },
  ],
  "Anniversary Gifts": [
    {
      name: "Couple's Watch Set",
      description: "Matching watch set for couples anniversary celebration",
      price: 2499,
      image_url:
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop",
    },
    {
      name: "Anniversary Memory Book",
      description: "Luxury leather-bound memory book with photo pages",
      price: 1599,
      image_url:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
    },
  ],
  "Corporate Gifts": [
    {
      name: "Executive Pen Set",
      description: "Premium pen set in elegant wooden box",
      price: 1899,
      image_url:
        "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=400&h=400&fit=crop",
    },
    {
      name: "Corporate Gift Hamper",
      description: "Professional gift hamper with premium items",
      price: 3499,
      image_url:
        "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop",
    },
  ],
  "Wedding Gifts": [
    {
      name: "Crystal Champagne Glasses",
      description: "Elegant crystal champagne glasses set",
      price: 2799,
      image_url:
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=400&fit=crop",
    },
    {
      name: "Wedding Memory Frame",
      description: "Beautiful photo frame designed for wedding memories",
      price: 1299,
      image_url:
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=400&fit=crop",
    },
  ],
  "Personalized Gifts": [
    {
      name: "Custom Name Mug",
      description: "Personalized ceramic mug with custom name printing",
      price: 449,
      image_url:
        "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop",
    },
    {
      name: "Engraved Keychain",
      description: "Metal keychain with custom engraving",
      price: 299,
      image_url:
        "https://images.unsplash.com/photo-1611923134239-4b8c5296d000?w=400&h=400&fit=crop",
    },
  ],
  "Luxury Gifts": [
    {
      name: "Luxury Perfume Set",
      description: "Premium perfume gift set with elegant packaging",
      price: 4999,
      image_url:
        "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
    },
    {
      name: "Designer Watch",
      description: "Luxury designer watch in premium packaging",
      price: 8999,
      image_url:
        "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop",
    },
  ],
  "Baby Shower Gifts": [
    {
      name: "Baby Gift Basket",
      description: "Adorable baby essentials gift basket",
      price: 1499,
      image_url:
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop",
    },
    {
      name: "Baby Photo Album",
      description: "Cute photo album for baby's first year memories",
      price: 699,
      image_url:
        "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&h=400&fit=crop",
    },
  ],
};

async function seedGiftProducts() {
  console.log("🎁 Creating gift products...\n");

  // Get all categories
  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("*");

  if (catError || !categories || categories.length === 0) {
    console.error("❌ No categories found! Run setup-gift-categories.js first");
    process.exit(1);
  }

  console.log(`Found ${categories.length} categories\n`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const category of categories) {
    const products = giftProducts[category.name] || [];

    if (products.length === 0) {
      console.log(`⊘ No products defined for ${category.name}`);
      continue;
    }

    console.log(`\n📦 Adding products for ${category.name}:`);

    for (const product of products) {
      const productData = {
        ...product,
        category_id: category.id,
        is_active: true,
      };

      const { data, error } = await supabase
        .from("products")
        .insert(productData)
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          console.log(`  ⊘ Skipped: ${product.name} (already exists)`);
          skipped++;
        } else {
          console.error(`  ✗ Error: ${product.name} - ${error.message}`);
          failed++;
        }
      } else {
        console.log(`  ✓ Created: ${product.name} (₹${product.price})`);
        created++;
      }
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Created: ${created}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Failed: ${failed}`);
  console.log(`\n✅ Done! Gift products added successfully!`);
}

seedGiftProducts().catch((error) => {
  console.error("❌ Fatal error:", error.message);
  process.exit(1);
});

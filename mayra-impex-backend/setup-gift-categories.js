require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function resetToGiftCategories() {
  console.log("🎁 Setting up Gift Categories...\n");

  // Delete all existing categories
  const { error: deleteError } = await supabase
    .from("categories")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // delete all

  if (deleteError) {
    console.log("Note: Could not delete old categories:", deleteError.message);
  }

  const giftCategories = [
    { name: "Birthday Gifts" },
    { name: "Valentine's Gifts" },
    { name: "Anniversary Gifts" },
    { name: "Corporate Gifts" },
    { name: "Wedding Gifts" },
    { name: "Personalized Gifts" },
    { name: "Luxury Gifts" },
    { name: "Baby Shower Gifts" },
  ];

  console.log("Creating gift categories...\n");
  const createdCategories = [];

  for (const category of giftCategories) {
    const { data, error } = await supabase
      .from("categories")
      .insert(category)
      .select()
      .single();

    if (error) {
      console.error(`✗ Error creating ${category.name}:`, error.message);
    } else {
      console.log(`✓ Created: ${data.name} (ID: ${data.id})`);
      createdCategories.push(data);
    }
  }

  console.log(
    `\n📊 Summary: ${createdCategories.length} gift categories created`,
  );
  return createdCategories;
}

async function clearOldProducts() {
  console.log("\n🧹 Clearing old products...");
  const { error } = await supabase
    .from("products")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (error) {
    console.log("Note: Could not delete old products:", error.message);
  } else {
    console.log("✓ Old products cleared");
  }
}

resetToGiftCategories()
  .then(() => clearOldProducts())
  .then(() => {
    console.log("\n✅ Gift categories setup complete!");
    console.log("Next: Run seed-gift-products.js to add gift items");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Fatal error:", error.message);
    process.exit(1);
  });

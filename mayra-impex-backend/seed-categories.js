require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const defaultCategories = [
  { name: "Electronics", description: "Electronic items and gadgets" },
  { name: "Textiles", description: "Fabrics and textile products" },
  { name: "Food & Beverages", description: "Food items and drinks" },
  { name: "Hardware", description: "Hardware and tools" },
  { name: "Chemicals", description: "Chemical products" },
  { name: "Packaging", description: "Packaging materials" },
];

async function seedCategories() {
  console.log("🏷️  Checking categories...\n");

  const { data: existing, error: fetchError } = await supabase
    .from("categories")
    .select("*")
    .limit(10);

  if (fetchError) {
    console.error("❌ Error fetching categories:", fetchError.message);
    process.exit(1);
  }

  if (existing.length > 0) {
    console.log("✓ Categories already exist:");
    existing.forEach((cat) => {
      console.log(`  - ${cat.name} (ID: ${cat.id})`);
    });
    return existing;
  }

  console.log("Creating default categories...\n");
  const createdCategories = [];

  for (const category of defaultCategories) {
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

  return createdCategories;
}

seedCategories()
  .then(() => {
    console.log("\n✅ Categories setup complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Fatal error:", error.message);
    process.exit(1);
  });

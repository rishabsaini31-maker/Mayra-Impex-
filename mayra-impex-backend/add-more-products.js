require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const moreGiftProducts = {
  "Birthday Gifts": [
    {
      name: "Happy Birthday Balloons Set",
      description: "Colorful birthday balloon decoration set",
      price: 249,
      image_url:
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400",
    },
    {
      name: "Birthday Gift Box",
      description: "Premium birthday gift packaging box",
      price: 399,
      image_url:
        "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400",
    },
    {
      name: "Birthday Crown Set",
      description: "Fun birthday crown for celebrations",
      price: 199,
      image_url:
        "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400",
    },
  ],
  "Valentine's Gifts": [
    {
      name: "Rose Bouquet",
      description: "Beautiful artificial rose bouquet",
      price: 799,
      image_url:
        "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400",
    },
    {
      name: "Love Letter Set",
      description: "Elegant love letter writing set",
      price: 449,
      image_url:
        "https://images.unsplash.com/photo-1516733968668-dbdce39c4651?w=400",
    },
    {
      name: "Chocolate Box",
      description: "Premium assorted chocolates",
      price: 999,
      image_url:
        "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400",
    },
  ],
  "Anniversary Gifts": [
    {
      name: "Anniversary Cake Topper",
      description: "Elegant anniversary cake decoration",
      price: 349,
      image_url:
        "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400",
    },
    {
      name: "Photo Collage Frame",
      description: "Multi-photo anniversary frame",
      price: 1199,
      image_url:
        "https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=400",
    },
  ],
  "Corporate Gifts": [
    {
      name: "Desk Organizer Set",
      description: "Premium wooden desk organizer",
      price: 1599,
      image_url:
        "https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?w=400",
    },
    {
      name: "Business Card Holder",
      description: "Elegant metal card holder",
      price: 899,
      image_url:
        "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400",
    },
  ],
  "Wedding Gifts": [
    {
      name: "Wedding Card Box",
      description: "Elegant wedding card holder",
      price: 1499,
      image_url:
        "https://images.unsplash.com/photo-1464347744102-11db6282f854?w=400",
    },
  ],
  "Personalized Gifts": [
    {
      name: "Custom Photo Cushion",
      description: "Personalized photo printed cushion",
      price: 599,
      image_url:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
    },
    {
      name: "Name Plate",
      description: "Wooden name plate with engraving",
      price: 799,
      image_url:
        "https://images.unsplash.com/photo-1595814433015-e6f5ce69e8f5?w=400",
    },
  ],
  "Luxury Gifts": [
    {
      name: "Crystal Decanter Set",
      description: "Premium crystal whiskey decanter",
      price: 5999,
      image_url:
        "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400",
    },
  ],
};

(async () => {
  console.log("🎁 Adding more gift products...\n");

  const { data: categories } = await supabase.from("categories").select("*");
  console.log(`Found ${categories.length} categories\n`);

  let added = 0;
  for (const category of categories) {
    const products = moreGiftProducts[category.name] || [];
    if (products.length > 0) {
      console.log(`📦 Adding products for ${category.name}:`);
      for (const product of products) {
        const { error } = await supabase.from("products").insert({
          ...product,
          category_id: category.id,
          is_active: true,
        });

        if (!error) {
          console.log(`  ✓ ${product.name} (₹${product.price})`);
          added++;
        } else {
          console.log(`  ✗ Failed: ${product.name}`);
        }
      }
    }
  }

  console.log(`\n✅ Successfully added ${added} more products!`);
  process.exit(0);
})().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});

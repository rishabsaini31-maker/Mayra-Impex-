require("dotenv").config();
const bcrypt = require("bcrypt");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function createAdmin() {
  console.log("🔐 Creating Admin User...\n");

  const adminEmail = "rishabsainiupw165@gmail.com";
  const adminPassword = "Rishab@3112";
  const adminName = "Rishab Saini";

  try {
    // Check if admin already exists
    const { data: existingAdmin } = await supabase
      .from("users")
      .select("id")
      .eq("email", adminEmail)
      .single();

    if (existingAdmin) {
      console.log("⚠️  Admin with this email already exists!");
      console.log(`📧 Email: ${adminEmail}`);
      return;
    }

    // Hash password
    const password_hash = await bcrypt.hash(adminPassword, 10);

    // Insert admin user
    const { data, error } = await supabase
      .from("users")
      .insert({
        name: adminName,
        email: adminEmail,
        phone: "9876543210",
        password_hash,
        role: "admin",
      })
      .select()
      .single();

    if (error) throw error;

    console.log("✅ Admin created successfully!");
    console.log("\n📋 Admin Credentials:");
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log(`👤 Name: ${adminName}`);
    console.log(`\n✨ You can now login as admin in the app!`);
  } catch (error) {
    console.error("✗ Error creating admin:", error.message);
  }
}

createAdmin();

const { supabase } = require("../config/supabase");

class InventoryController {
  // Add quantity to product
  async updateQuantity(req, res) {
    try {
      const { productId, quantity } = req.body;

      // Upsert into inventory table
      const { data: inventory, error } = await supabase
        .from("product_inventory")
        .upsert(
          {
            product_id: productId,
            quantity,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "product_id" },
        )
        .select()
        .single();

      if (error) throw error;

      res.status(200).json({
        message: "Quantity updated",
        data: inventory,
      });
    } catch (error) {
      console.error("Update quantity error:", error);
      res.status(500).json({ error: "Failed to update quantity" });
    }
  }

  // Get product inventory
  async getInventory(req, res) {
    try {
      const { productId } = req.params;

      const { data: inventory, error } = await supabase
        .from("product_inventory")
        .select("*")
        .eq("product_id", productId)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      // If no inventory record exists, return 0
      const quantity = inventory?.quantity || 0;

      res.status(200).json({
        message: "Inventory retrieved",
        data: { product_id: productId, quantity },
      });
    } catch (error) {
      console.error("Get inventory error:", error);
      res.status(500).json({ error: "Failed to fetch inventory" });
    }
  }

  // Get all inventory with low stock warnings
  async getAllInventory(req, res) {
    try {
      const { threshold = 5 } = req.query; // Low stock threshold

      const { data: allInventory, error } = await supabase
        .from("product_inventory")
        .select("*, products(id, name, price)")
        .order("quantity", { ascending: true });

      if (error) throw error;

      const lowStock = allInventory.filter((inv) => inv.quantity < threshold);

      res.status(200).json({
        message: "Inventory data retrieved",
        data: {
          inventory: allInventory,
          lowStockItems: lowStock,
          lowStockCount: lowStock.length,
        },
      });
    } catch (error) {
      console.error("Get all inventory error:", error);
      res.status(500).json({ error: "Failed to fetch inventory data" });
    }
  }

  // Adjust inventory (increase/decrease)
  async adjustInventory(req, res) {
    try {
      const { productId, adjustment } = req.body; // adjustment can be +5 or -3

      // Get current quantity
      const { data: current } = await supabase
        .from("product_inventory")
        .select("quantity")
        .eq("product_id", productId)
        .single();

      const newQuantity = Math.max(0, (current?.quantity || 0) + adjustment);

      const { data: updated, error } = await supabase
        .from("product_inventory")
        .upsert(
          {
            product_id: productId,
            quantity: newQuantity,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "product_id" },
        )
        .select()
        .single();

      if (error) throw error;

      res.status(200).json({
        message: "Inventory adjusted",
        data: updated,
      });
    } catch (error) {
      console.error("Adjust inventory error:", error);
      res.status(500).json({ error: "Failed to adjust inventory" });
    }
  }

  // Bulk update inventory
  async bulkUpdateInventory(req, res) {
    try {
      const { updates } = req.body; // Array of { productId, quantity }

      const promises = updates.map((item) =>
        supabase
          .from("product_inventory")
          .upsert(
            {
              product_id: item.productId,
              quantity: item.quantity,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "product_id" },
          ),
      );

      await Promise.all(promises);

      res.status(200).json({
        message: "Inventory updated successfully",
      });
    } catch (error) {
      console.error("Bulk update inventory error:", error);
      res.status(500).json({ error: "Failed to bulk update inventory" });
    }
  }
}

module.exports = new InventoryController();

const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventory.controller");
const { verifyAdmin } = require("../middleware/auth.middleware");
const { protectAgainstReplay } = require("../middleware/replay.middleware");

// Admin routes
router.post(
  "/update",
  verifyAdmin,
  protectAgainstReplay,
  inventoryController.updateQuantity,
);
router.patch(
  "/adjust",
  verifyAdmin,
  protectAgainstReplay,
  inventoryController.adjustInventory,
);
router.patch(
  "/bulk",
  verifyAdmin,
  protectAgainstReplay,
  inventoryController.bulkUpdateInventory,
);
router.get("/", verifyAdmin, inventoryController.getAllInventory);
router.get("/:productId", verifyAdmin, inventoryController.getInventory);

module.exports = router;

const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { verifyAdmin } = require("../middleware/auth.middleware");
const { protectAgainstReplay } = require("../middleware/replay.middleware");
const { validate, schemas } = require("../middleware/validate.middleware");

// Admin routes (must be before wildcard routes)
// Image upload route
router.post(
  "/upload-image",
  verifyAdmin,
  protectAgainstReplay,
  productController.getUploadMiddleware(),
  productController.uploadImage,
);
router.get("/export/csv", verifyAdmin, productController.exportProducts);

router.post(
  "/",
  verifyAdmin,
  protectAgainstReplay,
  validate(schemas.createProduct),
  productController.createProduct,
);
router.put(
  "/:id",
  verifyAdmin,
  protectAgainstReplay,
  validate(schemas.updateProduct),
  productController.updateProduct,
);
router.delete(
  "/:id",
  verifyAdmin,
  protectAgainstReplay,
  productController.deleteProduct,
);

// Public/Customer routes (must be at the end)
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

module.exports = router;

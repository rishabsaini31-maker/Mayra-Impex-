const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { verifyAdmin } = require("../middleware/auth.middleware");
const { validate, schemas } = require("../middleware/validate.middleware");

// Public routes
router.get("/", categoryController.getAllCategories);

// Admin routes
router.post(
  "/",
  verifyAdmin,
  validate(schemas.createCategory),
  categoryController.createCategory,
);
router.delete("/:id", verifyAdmin, categoryController.deleteCategory);

module.exports = router;

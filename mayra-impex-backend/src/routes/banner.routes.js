const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/banner.controller");
const { verifyAdmin } = require("../middleware/auth.middleware");
const { protectAgainstReplay } = require("../middleware/replay.middleware");

// Public route for client slider
router.get("/", bannerController.getPublicBanners);

// Admin routes
router.get("/admin/all", verifyAdmin, bannerController.getAllBanners);
router.post(
  "/upload-image",
  verifyAdmin,
  protectAgainstReplay,
  bannerController.uploadMiddleware,
  bannerController.uploadBannerImage,
);
router.post(
  "/",
  verifyAdmin,
  protectAgainstReplay,
  bannerController.createBanner,
);
router.put(
  "/:id",
  verifyAdmin,
  protectAgainstReplay,
  bannerController.updateBanner,
);
router.delete(
  "/:id",
  verifyAdmin,
  protectAgainstReplay,
  bannerController.deleteBanner,
);

module.exports = router;

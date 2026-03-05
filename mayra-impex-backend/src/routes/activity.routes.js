const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activity.controller");
const { verifyAdmin } = require("../middleware/auth.middleware");

// Admin routes
router.post("/", verifyAdmin, activityController.logActivity);
router.get("/", verifyAdmin, activityController.getActivityLogs);

module.exports = router;

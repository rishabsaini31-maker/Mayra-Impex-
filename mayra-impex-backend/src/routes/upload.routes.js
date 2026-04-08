const express = require("express");
const { verifyToken } = require("../middleware/auth.middleware");
const { singleImageUpload } = require("../middleware/upload.middleware");
const {
  uploadImageHandler,
  deleteImageHandler,
} = require("../controllers/upload.controller");

const router = express.Router();

router.post(
  "/upload-image",
  verifyToken,
  singleImageUpload.single("image"),
  uploadImageHandler,
);

router.delete("/delete-image", verifyToken, deleteImageHandler);

module.exports = router;

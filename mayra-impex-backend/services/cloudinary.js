const { v2: cloudinary } = require("cloudinary");

const requiredEnv = ["CLOUD_NAME", "API_KEY", "API_SECRET"];

for (const envKey of requiredEnv) {
  if (!process.env[envKey]) {
    // Keep startup warnings explicit while still allowing local boot without upload usage.
    // Upload handlers will throw a runtime error if credentials are absent.
    console.warn(`[cloudinary] Missing environment variable: ${envKey}`);
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const ensureCloudinaryConfigured = () => {
  if (
    !process.env.CLOUD_NAME ||
    !process.env.API_KEY ||
    !process.env.API_SECRET
  ) {
    const error = new Error(
      "Cloudinary is not configured. Set CLOUD_NAME, API_KEY and API_SECRET.",
    );
    error.status = 500;
    throw error;
  }
};

const uploadImage = async (filePath, folder = "uploads/products") => {
  ensureCloudinaryConfigured();

  return cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "image",
    // Automatic optimization for delivery performance
    quality: "auto",
    fetch_format: "auto",
  });
};

const deleteImage = async (publicId) => {
  ensureCloudinaryConfigured();
  return cloudinary.uploader.destroy(publicId, { resource_type: "image" });
};

const buildTransformedUrls = (publicId) => ({
  thumbnail: cloudinary.url(publicId, {
    secure: true,
    width: 300,
    height: 300,
    crop: "fill",
    gravity: "auto",
    quality: "auto",
    fetch_format: "auto",
  }),
  productCard: cloudinary.url(publicId, {
    secure: true,
    width: 800,
    height: 800,
    crop: "fill",
    gravity: "auto",
    quality: "auto",
    fetch_format: "auto",
  }),
});

module.exports = {
  uploadImage,
  deleteImage,
  buildTransformedUrls,
};

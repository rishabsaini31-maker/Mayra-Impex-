const fs = require("fs");
const { prisma } = require("../config/prisma");
const {
  uploadImage,
  deleteImage,
  buildTransformedUrls,
} = require("../../services/cloudinary");

const ALLOWED_FOLDERS = {
  users: "uploads/users",
  products: "uploads/products",
};

const safeUnlink = async (filePath) => {
  if (!filePath) return;
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if (error?.code !== "ENOENT") {
      console.warn("Failed to cleanup temp file:", error.message);
    }
  }
};

const resolveFolder = (folderKey) => {
  if (!folderKey) return ALLOWED_FOLDERS.products;
  return ALLOWED_FOLDERS[folderKey] || null;
};

const uploadImageHandler = async (req, res, next) => {
  try {
    const filePath = req.file?.path;
    const folder = resolveFolder(req.body?.folder || req.query?.folder);

    if (!req.file || !filePath) {
      return res.status(400).json({ error: "Image file is required." });
    }

    if (!folder) {
      return res.status(400).json({
        error: "Invalid folder. Allowed values are 'users' or 'products'.",
      });
    }

    const result = await uploadImage(filePath, folder);

    const imageRecord = await prisma.image.create({
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });

    const transformed = buildTransformedUrls(result.public_id);

    return res.status(201).json({
      url: result.secure_url,
      public_id: result.public_id,
      imageId: imageRecord.id,
      transformed,
    });
  } catch (error) {
    return next(error);
  } finally {
    await safeUnlink(req.file?.path);
  }
};

const deleteImageHandler = async (req, res, next) => {
  try {
    const publicId = req.body?.public_id;

    if (!publicId || typeof publicId !== "string") {
      return res.status(400).json({ error: "public_id is required." });
    }

    const cloudinaryResult = await deleteImage(publicId);

    await prisma.image.deleteMany({
      where: { publicId },
    });

    return res.status(200).json({
      success: true,
      public_id: publicId,
      result: cloudinaryResult.result,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  uploadImageHandler,
  deleteImageHandler,
};

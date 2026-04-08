const fs = require("fs");
const path = require("path");
const { supabase } = require("../config/supabase");

const ALLOWED_FOLDERS = {
  users: "uploads/users",
  products: "uploads/products",
};
const STORAGE_BUCKET = "product-images";

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

    const fileBuffer = await fs.promises.readFile(filePath);
    const ext =
      path.extname(req.file.originalname || filePath || ".jpg") || ".jpg";
    const objectPath = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(objectPath, fileBuffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(objectPath);

    const transformed = {
      thumbnail: publicUrl,
      productCard: publicUrl,
    };

    return res.status(201).json({
      url: publicUrl,
      public_id: objectPath,
      imageId: null,
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

    const { data: deleted, error: deleteError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([publicId]);

    if (deleteError) {
      throw deleteError;
    }

    return res.status(200).json({
      success: true,
      public_id: publicId,
      result: deleted?.length ? "ok" : "not_found",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  uploadImageHandler,
  deleteImageHandler,
};

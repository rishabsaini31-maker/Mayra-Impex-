const { supabase } = require("../config/supabase");
const multer = require("multer");
const path = require("path");

// Configure multer for banner image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed"));
    }
  },
}).single("image");

class BannerController {
  // Upload banner image to Supabase Storage
  async uploadBannerImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const file = req.file;
      const fileExt = path.extname(file.originalname);
      const uniqueSuffix = `${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      const fileName = `banner_${uniqueSuffix}${fileExt}`;

      // Upload to Supabase Storage 'home-banners' bucket
      const { data, error } = await supabase.storage
        .from("home-banners")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Supabase storage upload error:", error);
        return res.status(500).json({ error: "Failed to upload image" });
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("home-banners").getPublicUrl(data.path);

      res.status(200).json({
        message: "Banner image uploaded successfully",
        image_url: publicUrl,
      });
    } catch (error) {
      console.error("Upload banner image error:", error);
      res.status(500).json({ error: "Failed to upload banner image" });
    }
  }

  async getPublicBanners(req, res) {
    try {
      const { data: banners, error } = await supabase
        .from("home_banners")
        .select("id, image_url, display_order, is_active, created_at")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true })
        .limit(8);

      if (error) throw error;

      res.status(200).json({
        banners: banners || [],
        count: banners?.length || 0,
      });
    } catch (error) {
      console.error("Get public banners error:", error);
      res.status(500).json({ error: "Failed to fetch banners" });
    }
  }

  async getAllBanners(req, res) {
    try {
      const { data: banners, error } = await supabase
        .from("home_banners")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) throw error;

      res.status(200).json({
        banners: banners || [],
        count: banners?.length || 0,
      });
    } catch (error) {
      console.error("Get all banners error:", error);
      res.status(500).json({ error: "Failed to fetch banners" });
    }
  }

  async createBanner(req, res) {
    try {
      const { image_url, display_order, is_active = true } = req.body;

      if (!image_url) {
        return res.status(400).json({ error: "image_url is required" });
      }

      const { count: currentCount, error: countError } = await supabase
        .from("home_banners")
        .select("id", { count: "exact", head: true });

      if (countError) throw countError;

      if ((currentCount || 0) >= 8) {
        return res
          .status(400)
          .json({ error: "Maximum 8 slider images are allowed" });
      }

      let nextDisplayOrder = display_order;
      if (nextDisplayOrder === undefined || nextDisplayOrder === null) {
        const { data: maxBanner } = await supabase
          .from("home_banners")
          .select("display_order")
          .order("display_order", { ascending: false })
          .limit(1)
          .maybeSingle();

        nextDisplayOrder = (maxBanner?.display_order || 0) + 1;
      }

      const { data: banner, error } = await supabase
        .from("home_banners")
        .insert({
          image_url,
          display_order: nextDisplayOrder,
          is_active,
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        message: "Banner image added successfully",
        banner,
      });
    } catch (error) {
      console.error("Create banner error:", error);
      res.status(500).json({ error: "Failed to add banner" });
    }
  }

  async updateBanner(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const { data: banner, error } = await supabase
        .from("home_banners")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return res.status(404).json({ error: "Banner not found" });
        }
        throw error;
      }

      res.status(200).json({
        message: "Banner updated successfully",
        banner,
      });
    } catch (error) {
      console.error("Update banner error:", error);
      res.status(500).json({ error: "Failed to update banner" });
    }
  }

  async deleteBanner(req, res) {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from("home_banners")
        .delete()
        .eq("id", id);

      if (error) throw error;

      res.status(200).json({ message: "Banner removed successfully" });
    } catch (error) {
      console.error("Delete banner error:", error);
      res.status(500).json({ error: "Failed to remove banner" });
    }
  }
}

const bannerControllerInstance = new BannerController();

module.exports = bannerControllerInstance;
module.exports.uploadMiddleware = upload;

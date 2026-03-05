const { supabase } = require("../config/supabase");

class ActivityController {
  // Log activity
  async logActivity(req, res) {
    try {
      const {
        adminId,
        action,
        entityType,
        entityId,
        details,
        previousValue,
        newValue,
      } = req.body;

      const { data: log, error } = await supabase
        .from("activity_logs")
        .insert({
          admin_id: adminId,
          action,
          entity_type: entityType,
          entity_id: entityId,
          details,
          previous_value: previousValue,
          new_value: newValue,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        message: "Activity logged",
        data: log,
      });
    } catch (error) {
      console.error("Log activity error:", error);
      res.status(500).json({ error: "Failed to log activity" });
    }
  }

  // Get activity logs with filters
  async getActivityLogs(req, res) {
    try {
      const {
        entityType,
        entityId,
        adminId,
        limit = 100,
        offset = 0,
      } = req.query;

      let query = supabase
        .from("activity_logs")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (entityType) query = query.eq("entity_type", entityType);
      if (entityId) query = query.eq("entity_id", entityId);
      if (adminId) query = query.eq("admin_id", adminId);

      const { data: logs, error, count } = await query;

      if (error) throw error;

      res.status(200).json({
        message: "Activity logs retrieved",
        data: logs,
        pagination: { limit, offset, total: count },
      });
    } catch (error) {
      console.error("Get activity logs error:", error);
      res.status(500).json({ error: "Failed to fetch activity logs" });
    }
  }
}

module.exports = new ActivityController();

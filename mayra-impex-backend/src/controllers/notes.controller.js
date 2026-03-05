const { supabase } = require("../config/supabase");

class CustomerNotesController {
  // Add note to customer
  async addNote(req, res) {
    try {
      const { customerId, note, adminId } = req.body;

      const { data: newNote, error } = await supabase
        .from("customer_notes")
        .insert({
          customer_id: customerId,
          note,
          added_by: adminId,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        message: "Note added",
        data: newNote,
      });
    } catch (error) {
      console.error("Add note error:", error);
      res.status(500).json({ error: "Failed to add note" });
    }
  }

  // Get customer notes
  async getNotes(req, res) {
    try {
      const { customerId } = req.params;

      const { data: notes, error } = await supabase
        .from("customer_notes")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      res.status(200).json({
        message: "Notes retrieved",
        data: notes,
      });
    } catch (error) {
      console.error("Get notes error:", error);
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  }

  // Delete note
  async deleteNote(req, res) {
    try {
      const { noteId } = req.params;

      const { error } = await supabase
        .from("customer_notes")
        .delete()
        .eq("id", noteId);

      if (error) throw error;

      res.status(200).json({
        message: "Note deleted",
      });
    } catch (error) {
      console.error("Delete note error:", error);
      res.status(500).json({ error: "Failed to delete note" });
    }
  }
}

module.exports = new CustomerNotesController();

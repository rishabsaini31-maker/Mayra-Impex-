const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notes.controller");
const { verifyAdmin } = require("../middleware/auth.middleware");

// Admin routes
router.post("/", verifyAdmin, notesController.addNote);
router.get("/:customerId", verifyAdmin, notesController.getNotes);
router.delete("/:noteId", verifyAdmin, notesController.deleteNote);

module.exports = router;

const express = require("express");
const router = express.Router();
const EmailTemplate = require("../models/EmailTemplate");

// 🔐 Create new template
router.post("/", async (req, res) => {
  try {
    const { name, subject, body } = req.body;
    const template = new EmailTemplate({ name, subject, body });
    await template.save();
    res.status(201).json({ message: "✅ Template saved successfully!" });
  } catch (error) {
    console.error("❌ Error saving template:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/templates - Get all saved email templates
router.get("/", async (req, res) => {
  try {
    const templates = await EmailTemplate.find().sort({ createdAt: -1 });
    res.status(200).json(templates);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch templates" });
  }
});


// 📥 Get all templates
router.get("/", async (req, res) => {
  try {
    const templates = await EmailTemplate.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    console.error("❌ Error fetching templates:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

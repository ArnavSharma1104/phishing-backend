const express = require("express");
const router = express.Router();
const EmailTemplate = require("../models/EmailTemplate");

// 🔐 Create new template
router.post("/", async (req, res) => {
  try {
    // Accept `title` from frontend (not `name`)
    const { title, subject, body } = req.body;

    // Save the template
    const template = new EmailTemplate({ title, subject, body });
    await template.save();

    res.status(201).json({ message: "✅ Template saved successfully!" });
  } catch (error) {
    console.error("❌ Error saving template:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 📥 Get all templates
router.get("/", async (req, res) => {
  try {
    const templates = await EmailTemplate.find().sort({ createdAt: -1 });
    res.status(200).json({ templates });
  } catch (error) {
    console.error("❌ Error fetching templates:", error);
    res.status(500).json({ error: "Failed to fetch templates" });
  }
});

module.exports = router;

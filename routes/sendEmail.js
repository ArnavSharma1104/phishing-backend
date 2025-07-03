const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const EmailTemplate = require("../models/EmailTemplate");

router.post("/", async (req, res) => {
  const { to, templateId } = req.body;

  try {
    const template = await EmailTemplate.findById(templateId);
    if (!template) return res.status(404).json({ error: "Template not found" });

    // Replace {{email}} in template
    const htmlBody = template.body.replace(/{{email}}/g, to);

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Security Team" <${process.env.EMAIL_USER}>`,
      to,
      subject: template.subject,
      html: htmlBody,
    });

    res.json({ message: "✅ Email sent successfully!" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

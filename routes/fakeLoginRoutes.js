const express = require("express");
const router = express.Router();
const FakeLoginAttempt = require("../models/FakeLoginAttempt");

router.post("/fake-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const attempt = new FakeLoginAttempt({ email, password });
    await attempt.save();

    // Also log it in the activity logs if you want
    console.log("📥 Fake login saved:", email);

    res.status(200).json({ message: "✅ Fake login recorded!" });
  } catch (error) {
    console.error("❌ Error saving fake login:", error);
    res.status(500).json({ error: "Failed to record fake login" });
  }
});

module.exports = router;

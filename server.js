require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const EmailTemplate = require("./models/EmailTemplate");
const sendEmailRoutes = require("./routes/sendEmail");
const templateRoutes = require("./routes/templateRoutes");
const { configDotenv } = require("dotenv");
const fakeLoginRoutes = require("./routes/fakeLoginRoutes");
const FakeLoginAttempt = require("./models/FakeLoginAttempt");





const app = express(); // ✅ Move this ABOVE any app.use()!

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// ✅ Route Mounting (AFTER app is declared)
app.use("/api/send-email", sendEmailRoutes);
app.use("/api/templates", templateRoutes);

//Fake Login Routes
app.use("/api/fake-login", fakeLoginRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("✅ Phishing Portal backend is running!");
});

// Activity Schema
const activitySchema = new mongoose.Schema({
  email: String,
  action: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
const Activity = mongoose.model("Activity", activitySchema);

// Log Activity
app.post("/api/activity/log", async (req, res) => {
  const { email, action } = req.body;
  try {
    const activity = new Activity({ email, action });
    await activity.save();
    res.status(200).json({ message: "✅ Activity logged!" });
  } catch (err) {
    console.error("Error saving activity:", err);
    res.status(500).json({ error: "❌ Failed to log activity" });
  }
});

// Get All Logs
app.get("/api/activity/logs", async (req, res) => {
  try {
    const logs = await Activity.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    console.error("❌ Error fetching logs:", err);
    res.status(500).json({ error: "Failed to fetch activity logs" });
  }
});

// Delete a Log
app.delete("/api/activity/logs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Activity.findByIdAndDelete(id);
    res.json({ message: "✅ Log deleted successfully!" });
  } catch (err) {
    console.error("❌ Failed to delete log:", err);
    res.status(500).json({ error: "❌ Error deleting log" });
  }
});

// Create Template (Optional - also handled in routes/templateRoutes)
app.post("/api/templates/create", async (req, res) => {
  const { title, subject, body } = req.body;

  try {
    const template = new EmailTemplate({ title, subject, body });
    await template.save();
    res.status(201).json({ message: "✅ Template saved successfully!" });
  } catch (err) {
    console.error("❌ Error saving template:", err);
    res.status(500).json({ error: "Failed to save template" });
  }
});

//fake login capture
// Add this to server.js or use it from a separate route file
app.post("/api/fake-login", async (req, res) => {
  const { email, password, clickedFrom } = req.body; // ✅ FIXED

  try {
    const attempt = new FakeLoginAttempt({ email, password, clickedFrom });
    await attempt.save();
    res.status(200).json({ message: "Fake login captured ✅" });
  } catch (err) {
    console.error("❌ Error saving fake login:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// GET all fake login attempts
app.get("/api/fake-login", async (req, res) => {
  try {
    const attempts = await FakeLoginAttempt.find().sort({ timestamp: -1 });
    res.json(attempts);
  } catch (err) {
    console.error("❌ Failed to fetch fake logins:", err);
    res.status(500).json({ error: "Server error" });
  }
});



// DB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});

// server.js

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Models
const EmailTemplate = require("./models/EmailTemplate");
const FakeLoginAttempt = require("./models/FakeLoginAttempt");

// Routes
const sendEmailRoutes = require("./routes/sendEmail");
const templateRoutes = require("./routes/templateRoutes");
const fakeLoginRoutes = require("./routes/fakeLoginRoutes");

const app = express();

// ====== MIDDLEWARE ======
//const cors = require("cors");

app.use(cors({
  origin: [
    "http://localhost:3000", // local frontend
    "https://phishing-portal.vercel.app" // live frontend
  ]
}));


// ====== ROUTES ======
app.use("/api/send-email", sendEmailRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/fake-login", fakeLoginRoutes);

// ====== TEST ROUTE ======
app.get("/", (req, res) => {
  res.send("✅ Phishing Portal backend is running!");
});

// ====== ACTIVITY LOGGING ======
const activitySchema = new mongoose.Schema({
  email: String,
  action: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
const Activity = mongoose.model("Activity", activitySchema);

// Log new activity
app.post("/api/activity/log", async (req, res) => {
  const { email, action } = req.body;

  try {
    const activity = new Activity({ email, action });
    await activity.save();
    res.status(200).json({ message: "✅ Activity logged!" });
  } catch (err) {
    console.error("❌ Error saving activity:", err);
    res.status(500).json({ error: "❌ Failed to log activity" });
  }
});

// Get all logs
app.get("/api/activity/logs", async (req, res) => {
  try {
    const logs = await Activity.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    console.error("❌ Error fetching logs:", err);
    res.status(500).json({ error: "Failed to fetch activity logs" });
  }
});

// Delete a specific log
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

// ====== OPTIONAL TEMPLATE CREATION ROUTE (if not handled in templateRoutes) ======
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

// ====== FAKE LOGIN CAPTURE (if not handled inside fakeLoginRoutes) ======
app.post("/api/fake-login", async (req, res) => {
  const { email, password, clickedFrom } = req.body;

  try {
    const attempt = new FakeLoginAttempt({ email, password, clickedFrom });
    await attempt.save();
    res.status(200).json({ message: "Fake login captured ✅" });
  } catch (err) {
    console.error("❌ Error saving fake login:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all fake login attempts
app.get("/api/fake-login", async (req, res) => {
  try {
    const attempts = await FakeLoginAttempt.find().sort({ timestamp: -1 });
    res.json(attempts);
  } catch (err) {
    console.error("❌ Failed to fetch fake logins:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ====== CONNECT TO MONGODB ======
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ====== START SERVER ======
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});

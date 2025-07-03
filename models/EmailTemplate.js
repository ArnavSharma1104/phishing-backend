const mongoose = require("mongoose");

const emailTemplateSchema = new mongoose.Schema({
  title: String,            // Template title shown to admin
  subject: String,          // Email subject
  body: String,             // Email content (HTML or plain)
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("EmailTemplate", emailTemplateSchema);

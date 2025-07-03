const mongoose = require("mongoose");

const fakeLoginSchema = new mongoose.Schema({
  email: String,
  password: String,
  clickedFrom: String, // ✅ Add this line
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const FakeLoginAttempt = mongoose.model("FakeLoginAttempt", fakeLoginSchema);
module.exports = FakeLoginAttempt;

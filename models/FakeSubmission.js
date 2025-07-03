const mongoose = require("mongoose");

const fakeSubmissionSchema = new mongoose.Schema({
  email: String,           // employee entered
  password: String,        // employee entered
  clickedFrom: String,     // the email they got
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("FakeSubmission", fakeSubmissionSchema);

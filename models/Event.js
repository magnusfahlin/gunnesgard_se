const mongoose = require("mongoose"); // 1

const Event = mongoose.model("event", {
  // 2
  text: {
    type: String,
    required: false,
    minlength: 1,
    trim: true
  },
  date: {
    type: Date,
    required: false
  },
  reccuring: {
    type: Boolean,
    required: false
  }
});

module.exports = { Event };

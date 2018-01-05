const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const EventSchema = new Schema({
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

EventSchema.set("toJSON", { getters: true, virtuals: true });
const Event = mongoose.model("event", EventSchema);

module.exports = { Event };

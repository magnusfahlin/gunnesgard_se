const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const { createSchemaOptions } = require("./schemaUtil");

const EventSchema = new Schema(
  {
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
  },
  createSchemaOptions()
);

const Event = mongoose.model("event", EventSchema);

module.exports = { Event };

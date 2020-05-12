const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

mongoose.plugin((schema, options) => {
  schema.add({
    createdBy: {
      type: String,
      required: true
    },
    updatedBy: {
      type: String,
      required: true
    }
  });
});

module.exports = { mongoose };

const mongoose = require("mongoose"); // 1

const User = mongoose.model("user", {
  userId: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    trim: true
  },
  password: {
    type: String,
    required: false,
    minlength: 1,
    trim: true
  },
  name: {
    type: String,
    required: false,
    minlength: 1,
    trim: true
  },
  address: {
    type: String,
    required: false,
    minlength: 1,
    trim: true
  },
  town: {
    type: String,
    required: false,
    minlength: 1,
    trim: true
  },
  country: {
    type: String,
    required: false,
    minlength: 1,
    trim: true
  },
  email: {
    type: String,
    required: false,
    minlength: 1,
    trim: true
  },
  homePhone: {
    type: String,
    required: false,
    minlength: 1,
    trim: true
  },
  cellPhone: {
    type: String,
    required: false,
    minlength: 1,
    trim: true
  }
});

module.exports = { User };

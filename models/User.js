const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 1,
    bcrypt: true,
    hide: true, 
    select: false 
  },
  name: {
    type: String,
    required: false,
    trim: true
  },
  Surname: {
    type: String,
    required: false,
    trim: true
  },
  address: {
    type: String,
    required: false,
    trim: true
  },
  town: {
    type: String,
    minlength: 1,
    required: false,
    trim: true
  },
  country: {
    type: String,
    required: false,
    trim: true
  },
  email: {
    type: String,
    required: false,
    trim: true
  },
  homePhone: {
    type: String,
    required: false,
    trim: true
  },
  cellPhone: {
    type: String,
    required: false,
    trim: true
  }
});

userSchema.plugin(require("mongoose-bcrypt"));
userSchema.set('toJSON', { getters: true, virtuals: true });
userSchema.plugin(require("mongoose-hidden")());
const User = mongoose.model("user", userSchema);

module.exports = { User };

const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

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

userSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) return next(err);

          user.password = hash;
          next();
      });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};

userSchema.set('toJSON', {
  transform: function (doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;

      delete ret.password;
  }
});

userSchema.set('toObject', {
  transform: function (doc, ret, options) {
      ret._id = ret.id;
      delete ret.id;
  }
}); 

const User = mongoose.model("user", userSchema);

module.exports = { User };

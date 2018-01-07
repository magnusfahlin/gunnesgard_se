const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const bcrypt = require("bcrypt");
const { createSchemaOptions } = require("./schemaUtil");

const SALT_WORK_FACTOR = 10;

const toJSON = (doc, ret, options) => {
  delete ret.password;
};

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 1,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 1
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
  },
  createSchemaOptions(toJSON)
);

userSchema.pre("save", function(next) {
  var user = this;

  if (!user.isModified("password")) return next();

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

const User = mongoose.model("user", userSchema);

module.exports = { User };

const mongoose = require("mongoose");
const { User } = require("./models/User");

const addUserIfNeeded = function() {
  User.count({}, function(err, count) {
    if (err) {
      console.log("Failed to fetch number of users, something is wrong!");
      return;
    }
    if (count < 1) {
      const userName = process.env.bootstrapUsername
        ? process.env.bootstrapUsername
        : "admin";
      const password = process.env.bootstrapUserPassword
        ? process.env.bootstrapUserPassword
        : "admin";

      const bootstrapUser = new User({
        userName: userName,
        password: password,
        createdBy: userName,
        updatedBy: userName
      });
      bootstrapUser.save().then(
        doc => {
          console.log("Bootstrap user added");
        },
        e => {
          console.log("Failed to add bootstrap user!");
        }
      );
    }
  });
};

module.exports = { addUserIfNeeded };

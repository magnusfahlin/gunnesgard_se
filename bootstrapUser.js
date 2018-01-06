const mongoose = require("mongoose");
const { User } = require("./models/User");

const addUserIfNeeded = function() {
  User.count({}, function(err, count) {
    if (err) {
      console.log("Failed to fetch number of users, something is wrong!");
      return;
    }
    if (count < 1) {
      const bootstrapUser = new User({
        userName: "admin",
        password: "blogga"
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

module.exports = { addUserIfNeeded }

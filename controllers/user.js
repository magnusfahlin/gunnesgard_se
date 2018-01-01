const { createController } = require("./controllerFactory.js");
const { User } = require("./../models/User");

const registerUser = function(app) {
  createController(
    app,
    "user",
    User,
    (req) =>
      new User({
        userId: req.body.userId,
        password: req.body.password,
        name: req.body.name,
        address: req.body.address,
        town: req.body.town,
        country: req.body.country,
        email: req.body.email,
        homePhone: req.body.homePhone,
        cellPhone: req.body.cellPhone
      })
  );
}

module.exports = { registerUser };
const { createController } = require("./controllerFactory.js");
const { Post } = require("./../models/post");

const registerPost = function(app) {
  createController(
    app,
    "post",
    Post,
    (req) =>
      new Post({
        title: req.body.title,
        location: req.body.location,
        userId: req.body.userId,
        text: req.body.text,
        title: req.body.title,
        date: req.body.date
      })
  );
}

module.exports = { registerPost };
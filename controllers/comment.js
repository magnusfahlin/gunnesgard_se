const { createController } = require("./controllerFactory.js");
const { Comment } = require("./../models/comment");

const registerComment = function(app) {
  createController(
    app,
    "comment",
    Comment,
    (req) =>
      new Comment({
        text: req.body.text,
        date: req.body.date,
        userId: req.body.userId,
        blogId: req.body.blogId
      })
  );
}

module.exports = { registerComment };
const { createController } = require("./controllerFactory.js");
const { Post } = require("./../models/Post");

const registerPost = function(app) {
  createController(
    app,
    "post",
    Post,
    req =>
      new Post({
        title: req.body.title,
        location: req.body.location,
        text: req.body.text,
        title: req.body.title
      }),
    [
      {
        embeddedEntity: "comments",
        embeddedEntityParser: req => {
          return {
            text: req.body.text
          };
        }
      }
    ]
  );
};

module.exports = { registerPost };

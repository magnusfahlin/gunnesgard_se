const { createController } = require("./controllerFactory.js");
const { Event } = require("./../models/Event");

const registerEvent = function(app) {
  createController(
    app,
    "event",
    Event,
    (req) =>
      new Event({
        text: req.body.text,
        date: req.body.date,
        reccuring: req.body.reccuring
      })
  );
}

module.exports = { registerEvent };
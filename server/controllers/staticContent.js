const express = require("express");

const registerStaticContent = function (app) {

    var jwtCheckMiddleware = function(req, res, next) {
        if (!req.auth) {
            return res.status(404).send();
          }
        next();
    };
    app.use('/static', jwtCheckMiddleware);
    app.use('/static', express.static("static"));
};

module.exports = { registerStaticContent };

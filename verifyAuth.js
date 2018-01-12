var jwt = require("jwt-simple");

module.exports = function(req, res, next) {
  if (req.headers["x-auth"]) {
    if (process.env.NODE_ENV == "test") {
      req.auth =
        req.headers["x-auth"] === process.env.TEST_TOKEN
          ? { username: "testUser" }
          : false;
    } else {
      try {
        req.auth = jwt.decode(req.headers["x-auth"], process.env.SECRET);
      } catch (err) {
        req.auth = false;
      }
    }
  }
  next();
};

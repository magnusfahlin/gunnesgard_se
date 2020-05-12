var jwt = require("jwt-simple");

module.exports = function(req, res, next) {
  if (req.headers["x-auth"]) {
    if (process.env.NODE_ENV == "test" || process.env.TEST_TOKEN) {
      req.auth =
        req.headers["x-auth"] === process.env.TEST_TOKEN
          ? { username: "testUser" }
          : false;
    } else {
      try {
        req.auth = jwt.decode(req.headers["x-auth"], process.env.SECRET);
      } catch (err) {
        console.log("Authorization failed: " + err.message)
        req.auth = false;
      }
    }
  }
  next();
};

var jwt = require("jwt-simple");

module.exports = function(req, res, next) {
  if (req.headers["x-auth"]) {
    if (process.env.NODE_ENV == "test") {
      req.auth =
        req.headers["x-auth"] ? { username : req.headers["x-auth"] }: false;
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

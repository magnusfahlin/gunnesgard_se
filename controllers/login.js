var jwt = require("jwt-simple");
const { User } = require("./../models/User");

const registerLogin = function(app) {
  app.post("/login", function(req, res, next) {
    User.findOne({ username: req.body.username }).then(user =>
      {
      user.comparePassword(req.body.password, (err, valid) => {
        if (valid) {

          let exp = Math.round(Date.now() / 1000) + parseInt(process.env.JWT_EXPIRE_TIME_SECONDS)
          let nbf = Math.round(Date.now() / 1000)
0
          var token = jwt.encode(
            { username: user.username, nbf : nbf, exp: exp },
            process.env.SECRET
          );
          res.status(201).send({
            username: user.username,
            token: token
          });
        } else {
          return res.status(401).send();
        }
      })
    }
    )
    .catch(() => res.status(401).send());
  });
};

module.exports = { registerLogin };

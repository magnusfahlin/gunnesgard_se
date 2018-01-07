var jwt = require("jwt-simple");
const { User } = require("./../models/User");

const registerLogin = function(app) {
  app.post("/login", function(req, res, next) {
    User.findOne({ username: req.body.username }).then(user =>
      {
      user.comparePassword(req.body.password, (err, valid) => {
        if (valid) {
          var token = jwt.encode(
            { username: user.username },
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

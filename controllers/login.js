var jwt = require("jwt-simple");
const { User } = require("./../models/User");

const registerLogin = function(app) {
  app.post("/login", function(req, res, next) {
    User.findOne({ userName: req.body.userName }).then(user =>
      {
      user.comparePassword(req.body.password, (err, valid) => {
        if (valid) {
          var token = jwt.encode(
            { userName: user.userName },
            process.env.SECRET
          );
          res.status(201).send({
            userName: user.userName,
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

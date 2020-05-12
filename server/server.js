require("./config/config");
const path = require("path");

const _ = require("lodash");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoSanitize = require('express-mongo-sanitize');

const { mongoose } = require("./db/mongoose");
const app = express();

if (!process.env.SAME_ORIGIN) {
  console.log("CORS is allowed");
  app.use(cors());
} else {
  console.log("CORS is not allowed");
}
const port = process.env.PORT || 3000;

const { registerEvent } = require("./controllers/event");
const { registerPost } = require("./controllers/post");
const { registerUser } = require("./controllers/user");
const { registerLogin } = require("./controllers/login");
const { registerStaticContent } = require("./controllers/staticContent");
const { registerAlbum } = require("./controllers/album");

const { addUserIfNeeded } = require("./bootstrapUser");

addUserIfNeeded();

app.use(bodyParser.json());
app.use(mongoSanitize());
app.use(require("./verifyAuth"));
app.use(function(req, res, next) {
  next();
});

registerPost(app);
registerEvent(app);
registerUser(app);
registerLogin(app);
registerStaticContent(app);
registerAlbum(app);

const publicPath = express.static(path.join(__dirname, "/build/client"));
const indexPath = path.join(__dirname, "/build/client/index.html");

app.use(publicPath);

app.get("/", (req, res) => {
  res.sendFile(indexPath);
});

// Listens for connection on the given port
const server = app.listen(port, () => {
  console.log(`Starting on port ${port}`);
});

app.close = callback => server.close(callback);
// Exports the module as app.
module.exports = app;

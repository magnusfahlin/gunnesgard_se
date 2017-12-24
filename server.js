require('./config/config')   // 1
 
const _ = require('lodash')   // 2
const express = require('express') // 3
const bodyParser = require('body-parser')  // 4
const {ObjectId} = require('mongodb')   // 5
 
const {mongoose} = require('./db/mongoose')   // 6
const {Post} = require('./models/post')   // 7
 
const app = express()   // 8
const port = process.env.PORT || 3000  // 9

const { registerEvent } = require('./controllers/event')
const { registerPost } = require('./controllers/post')
const { registerUser } = require('./controllers/user')

app.use(bodyParser.json())  // 10
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

registerPost(app);
registerEvent(app);
registerUser(app);
 
// Listens for connection on the given port
app.listen(port, () => {
  console.log(`Starting on port ${port}`)
})
 
// Exports the module as app.
module.exports = {app}
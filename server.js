require('./config/config')
const path = require('path') 

const _ = require('lodash')
const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser') 
 
const {mongoose} = require('./db/mongoose')  
const app = express()
app.use(cors())
const port = process.env.PORT || 3000

const { registerEvent } = require('./controllers/event')
const { registerPost } = require('./controllers/post')
const { registerUser } = require('./controllers/user')

app.use(bodyParser.json())
app.use(function(req, res, next) {
  next();
});

 
registerPost(app);
registerEvent(app);
registerUser(app);

const publicPath = express.static(path.join(__dirname, '/build/client'));
const indexPath = path.join(__dirname, '/build/client/index.html');

app.use(publicPath);

app.get('/', (req, res) => {
    res.sendFile(indexPath);
})

// Listens for connection on the given port
app.listen(port, () => {
  console.log(`Starting on port ${port}`)
})
 
// Exports the module as app.
module.exports = {app}

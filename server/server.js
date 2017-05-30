var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  BlogPost = require('./api/models/blogPostModel'),
  bodyParser = require('body-parser');
  
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/GunnedgardDb'); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/gunnesgardRoutes');
routes(app);

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);
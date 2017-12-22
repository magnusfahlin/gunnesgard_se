require('./config/config')   // 1
 
const _ = require('lodash')   // 2
const express = require('express') // 3
const bodyParser = require('body-parser')  // 4
const {ObjectId} = require('mongodb')   // 5
 
const {mongoose} = require('./db/mongoose')   // 6
const {Post} = require('./models/post')   // 7
 
const app = express()   // 8
const port = process.env.PORT || 3000  // 9
 
app.use(bodyParser.json())  // 10
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

 
app.post('/posts', (req, res) => {
  let todo = new Post({
    title: req.body.title,
    location: req.body.location,
    userId: req.body.userId,
    text: req.body.text,
    title: req.body.title,
    date: req.body.date
  })
 
  todo.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.status(400).send(e)
  })
})

// GET HTTP request is called on /post path
app.get('/posts', (req, res) => {
 
  // Calls find function on Post
  Post.find().then((post) => {
    res.send({post})
  }, (e) => {
    res.status(400).send(e)
  })
})
 
// GET HTTP request is called to retrieve individual post
app.get('/posts/:id', (req, res) => {
  let id = req.params.id
  
  // Validates id
  if (!ObjectId.isValid(id)) {
    return res.status(404).send('ID is not valid')
  }
 
  Post.findById(id).then((post) => {
    if (!post) {
      return res.status(404).send()
    }
    res.send({post})
  }).catch((e) => {
    res.status(400).send()
  })
})
 
// HTTP DELETE request routed to /post/:id
app.delete('/posts/:id', (req, res) => {
 
  let id = req.params.id
  // Validates id
  if (!ObjectId.isValid(id)) {
    return res.status(404).send()
  }
  // Finds todo with the retrieved id, and removes it
  Post.findByIdAndRemove(id).then((post) => {
 
    // If no todo is found with that id, an error is sent
    if (!post) {
      return res.status(404).send()
    }
 
    // Responds with todo
    res.send({post})
 
    // Error handler to catch and send error
  }).catch((e) => {
    res.status(400).send()
  })
})
 
// HTTP PATCH requested routed to /post/:id
app.patch('/posts/:id', (req, res) => {
  let id = req.params.id
 
  //  Creates an object called body of the picked values (text and completed), from the response gotten
  let body = _.pick(req.body, ['text', 'completed'])
 
    // Validates id
    if (!ObjectId.isValid(id)) {
      // Returns 400 error and error message when id is not valid
      return res.status(404).send()
  }
 
  // Checks if body.completed is boolean, and if it is set
  if (_.isBoolean(body.completed) && body.completed) {
 
    // Sets body.completedAt to the current time
    body.completedAt = new Date().getTime()
  } else {
 
    // Else body.completed is set to false and body.completedAt is null
    body.completed = false
    body.completedAt = null
  }
 
  // Finds a todo with id that matches the retrieved id.
  // Sets the body of the retrieved id to a new one
  Post.findOneAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
 
    // If no todo is found with that id, an error is sent
    if (!todo) {
      return res.status(404).send()
    }
 
    // Responds with todo
    res.send({todo})
 
    // Error handler to catch and send error
  }).catch((e) => {
    res.status(400).send()
  })
 
})
 
// Listens for connection on the given port
app.listen(port, () => {
  console.log(`Starting on port ${port}`)
})
 
// Exports the module as app.
module.exports = {app}
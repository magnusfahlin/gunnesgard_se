'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var BlogPostSchema = new Schema({
  name: {
    type: String,
    Required: 'Kindly enter the name of the task'
  },
  Created_date: {
    type: Date,
    default: Date.now
  },
  text: {
    type: String,
    default : ''
  },
  author: {
    type: String,
    default : ''
  },
  location: {
    type: String,
    default : ''
  },  
});

module.exports = mongoose.model('BlogPosts', BlogPostSchema);
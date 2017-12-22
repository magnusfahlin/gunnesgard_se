const mongoose = require('mongoose') 
const {ObjectId} = require('mongodb')
 
const Comment = mongoose.model('comment', {
  text: {
    type: String,
    required: false,
    minlength: 1,
    trim: true
  },
  date: {
    type: Date,
    required: false,
  },
  userId: {
    type: String,
    required: false,
    minlength: 1,
    trim: true
  },
  blogId: {
    type: mongoose.Schema.ObjectId
  }
})
 
module.exports = {Comment} 
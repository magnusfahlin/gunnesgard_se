const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const CommentSchema = new Schema({
  _id: {
    type: Schema.ObjectId,
    required: true
  },
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
  userName: {
    type: String,
    required: false,
    minlength: 1,
    trim: true
  }
});

const Post = mongoose.model("post", {
  // 2
  title: {
    type: String,
    required: false,
    minlength: 1,
    trim: true
  },
  text: {
    type: String,
    required: false,
    minlength: 1,
    trim: true
  },
  location: {
    type: String,
    required: false,
    minlength: 1,
    trim: true
  },
  date: {
    type: Date,
    required: false
  },
  comments: {
    type: [CommentSchema]
  },
  userName: {
    type: String,
    required: false,
    minlength: 1,
    trim: true
  }
});

module.exports = { Post };

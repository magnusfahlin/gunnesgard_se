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
    required: false
  },
  userName: {
    type: String,
    required: false,
    minlength: 1,
    trim: true
  }
});

CommentSchema.set('toJSON', {
  transform: function (doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
  }
});

CommentSchema.set('toObject', {
  transform: function (doc, ret, options) {
      ret._id = ret.id;
      delete ret.id;
  }
}); 

const PostSchema = new Schema({
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

PostSchema.set('toJSON', {
  transform: function (doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
  }
});

PostSchema.set('toObject', {
  transform: function (doc, ret, options) {
      ret._id = ret.id;
      delete ret.id;
  }
}); 

const Post = mongoose.model("post", PostSchema);

module.exports = { Post };

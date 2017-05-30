'use strict';


var mongoose = require('mongoose'),
  BlogPost = mongoose.model('BlogPosts');

exports.list_all_blogposts = function(req, res) {
  BlogPost.find({}, function(err, obj) {
    if (err)
      res.send(err);
    res.json(obj);
  });
};

exports.create_a_blogpost = function(req, res) {
  var new_task = new BlogPost(req.body);
  new_task.save(function(err, obj) {
    if (err)
      res.send(err);
    res.json(obj);
  });
};


exports.read_a_blogpost = function(req, res) {
  BlogPost.findById(req.params.blogPostId, function(err, obj) {
    if (err)
      res.send(err);
    res.json(obj);
  });
};

exports.update_a_blogpost = function(req, res) {
  BlogPost.findOneAndUpdate(req.params.blogPostId, req.body, {new: true}, function(err, obj) {
    if (err)
      res.send(err);
    res.json(obj);
  });
};


exports.delete_a_blogpost = function(req, res) {

  BlogPost.remove({
    _id: req.params.blogPostId
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'BlogPost successfully deleted' });
  });
};

'use strict';
module.exports = function(app) {
  var blogPosts = require('../controllers/blogPostController');

  // todoList Routes
  app.route('/blogposts')
    .get(blogPosts.list_all_blogposts)
    .post(blogPosts.create_a_blogpost);


  app.route('/blogposts/:blogPostId')
    .get(blogPosts.read_a_blogpost)
    .put(blogPosts.update_a_blogpost)
    .delete(blogPosts.delete_a_blogpost);
};
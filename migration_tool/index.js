var { importMySql } = require("./mysqlImport");
var { migrateData } = require("./migrateData");
var { dropDb } = require("./dbOperations");

function transform(data) {
  let transformedData = {};

  let postsArray = [];
  data.nyblog.forEach(function(element) {
    let comments = [];
    data.comments.forEach(function(comment) {
      if (element.id == comment.blogid) {

        comments.push({
          _id: element._id,
          text: element.text,
          date: element.date,
          userName: element.namn
        });
        
      }
    }, this);

    postsArray.push({
      _id: element._id,
      title: element.rubrik,
      text: element.text,
      location: element.plats,
      date: element.date,
      comments: comments,
      galleryId: element.albumId,
      userName: element.namn
    });
  }, this);

  transformedData.posts = postsArray;

  // let commentsArray = [];
  // data.comments.forEach(function(element) {
  //   // let postId;
  //   // data.nyblog.forEach(function(oldBlogPost) {
  //   //   postId = oldBlogPost._id;
  //   // }, this);

  //   // if (!postId) throw error;

  //   commentsArray.push({
  //     _id: element._id,
  //     text: element.text,
  //     date: element.date,
  //    // postId: postId,
  //     userName: element.namn
  //   });
  // }, this);

  // transformedData.comments = commentsArray;

  let calendarArray = [];
  data.kalender2.forEach(function(element) {
    let userName = "";
    data.users.forEach(function(user) {
      if (user.user_id == element.userid) userName = user.username;
    }, this);

    calendarArray.push({
      _id: element._id,
      date: element.datum,
      title: element.name,
      text: element.descr,
      recurring: element.aterkommande ? true : false,
      userName: userName
    });
  }, this);

  transformedData.calendar = calendarArray;

  return transformedData;
}

importMySql("temp_importDB", 27017, {
  host: "localhost",
  user: "root",
  password: "",
  port: 3306,
  database: "gunnesgard_se"
});

migrateData(27017, "gunnesgard", "temp_importDB", transform, function() {
  dropDb(27017, "temp_importDB");
});

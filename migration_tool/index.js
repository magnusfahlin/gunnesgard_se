var { importMySql } = require("./mysqlImport");
var { migrateData } = require("./migrateData");
var { dropDb } = require("./dbOperations");

function transform(data) {
  let transformedData = {};

  let postsArray = [];
  data.nyblog.forEach(function(element) {
    postsArray.push({
      _id: element._id,
      title: element.rubrik,
      text: element.text,
      location: element.plats,
      date: element.date,
      galleryId: element.albumId,
      userName: element.namn
    });
  }, this);

  transformedData.posts = postsArray;

  let commentsArray = [];
  data.comments.forEach(function(element) {
    let postId;
    data.nyblog.forEach(function(oldBlogPost) {
      postId = oldBlogPost._id;
    }, this);

    if (!postId) throw error;

    commentsArray.push({
      _id: element._id,
      text: element.text,
      date: element.date,
      postId: postId,
      userName: element.namn
    });
  }, this);

  transformedData.comments = commentsArray;

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

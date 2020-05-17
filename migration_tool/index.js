// Very ugly code...

var { importMySql } = require("./mysqlImport");
var { migrateData } = require("./migrateData");
var { dropDb } = require("./dbOperations");
var fs = require('fs');
const sharp = require('sharp');


importMySql(
  "temp_importDB",
  27017,
  {
    host: "localhost",
    user: "root",
    password: "test_pass",
    port: 3306,
    database: "gunnesgard_se"
  },
  () =>
    migrateData(27017, "gunnesgard", "temp_importDB", transform, function() {
      dropDb(27017, "temp_importDB");
    })
);


function transform(data) {
  let transformedData = {};

  //transformPostsAndComments(data, transformedData);
 // transformCalendar(data, transformedData);
  transfomAlbumsAndPhotos(data, transformedData);

  return transformedData;
}

function CopyFileAndThumbnail(bild, destinationDir) {
  let fileName = bild.filnamn.split('/').pop();
  let fileOnDisk = "./album/" + fileName;
  let destinationFilePath = destinationDir + "/" + fileName;

  let thumbnailFileName = fileName.replace(/(\.[^\.]+)$/, '_thumbnail$1');
  let thumbnailFilePath = destinationDir + "/" + thumbnailFileName;
  fs.copyFile(fileOnDisk, destinationFilePath, (err) => {
    if (err) throw err;
    console.log('source.txt was copied to destination.txt');
  })

  sharp(destinationFilePath).resize(200, 200).toFile(thumbnailFilePath, (err, resizeImage) => {
    if (err) {
      console.log(err);
    } else {
      console.log(resizeImage);
    }
  });
  return {fileName, thumbnailFileName};
}

function transfomAlbumsAndPhotos(data, transformedData) {
  let albumArray = [];
  let i = 0;
  let limit = 10;
  data.album.forEach(function (element) {
      i++;
    if (i < 0 | i > limit){
      return;
    }
    console.log("Migrating nbr " + i + " " +element.namn);


    let photos = [];

    var destinationDir = '../server/static/albums/'+ element._id;

    if (!fs.existsSync(destinationDir)){
      fs.mkdirSync(destinationDir, { recursive: true } );
    }

    // data.bilder.forEach(function (bild) {
    //   if (element.id == bild.albumid) {
    //     let {fileName, thumbnailFileName} = CopyFileAndThumbnail(bild, destinationDir);
    //
    //     photos.push({
    //       _id: bild._id,
    //       createdAt: bild.date,
    //       updatedAt: bild.date,
    //       createdBy: bild.namn,
    //       updatedBy: bild.namn,
    //       filename: fileName,
    //       thumbnail: thumbnailFileName,
    //       title: bild.bildnamn,
    //       text: bild.text,
    //       tags: bild.tagstr
    //     });
    //   }
    // }, this);

    data.bilder_ny2.forEach(function (bild) {
      if (element.id == bild.albumid) {

        let {fileName, thumbnailFileName} = CopyFileAndThumbnail(bild, destinationDir);

        photos.push({
          _id: bild._id,
          createdAt: bild.date,
          updatedAt: bild.date,
          createdBy: bild.namn,
          updatedBy: bild.namn,
          filename: fileName,
          thumbnail: thumbnailFileName,
          title: bild.bildnamn,
          text: bild.text,
          tags: bild.tagstr
        });
      }
    }, this);
     if (photos.length > 0) {
       albumArray.push({
         _id: element._id,
         createdAt: element.date,
         updatedAt: element.date,
         createdBy: element.uppladdare,
         updatedBy: element.uppladdare,
         title: element.namn,
         photos: photos,
         tags: element.tags
       });
     }
  }, this);

  transformedData.albums = albumArray;
}



function transformPostsAndComments(data, transformedData) {
  let postsArray = [];
  data.nyblog.forEach(function (element) {
    let comments = [];
    data.comments.forEach(function (comment) {
      if (element.id == comment.blogid) {
        comments.push({
          _id: comment._id,
          createdAt: comment.date,
          updatedAt: comment.date,
          createdBy: comment.namn,
          updatedBy: comment.namn,
          text: comment.text
        });
      }
    }, this);

    postsArray.push({
      _id: element._id,
      createdAt: element.date,
      updatedAt: element.date,
      createdBy: element.namn,
      updatedBy: element.namn,
      title: element.rubrik,
      text: element.text,
      location: element.plats,
      date: element.date,
      comments: comments,
      galleryId: element.albumId,
    });
  }, this);

  transformedData.posts = postsArray;

  let commentsArray = [];
  data.comments.forEach(function (element) {
    // let postId;
    // data.nyblog.forEach(function(oldBlogPost) {
    //   postId = oldBlogPost._id;
    // }, this);

    // if (!postId) throw error;

    commentsArray.push({
      _id: element._id,
      text: element.text,
      date: element.date,
      // postId: postId,
      username: element.namn
    });
  }, this);

  transformedData.comments = commentsArray;
}

function transformCalendar(data, transformedData) {
  let calendarArray = [];
  data.kalender2.forEach(function (element) {
    let username = "";
    data.users.forEach(function (user) {
      if (user.user_id == element.userid) username = user.username;
    }, this);

    calendarArray.push({
      _id: element._id,
      date: element.datum,
      title: element.name,
      text: element.descr,
      recurring: element.aterkommande ? true : false,
      username: username
    });
  }, this);

  transformedData.calendar = calendarArray;
}

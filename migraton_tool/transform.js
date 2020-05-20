var fs = require("fs")
var gm = require("gm")

async function transformData(path, data) {
    let transformedData = {};

    transformPostsAndComments(data, transformedData);
    transformCalendar(data, transformedData);
    await transfomAlbumsAndPhotos(path, data, transformedData);

    return transformedData;
}

const createThumbnail = async function (fname, thumbnailFilePath) {
    return new Promise(function (resolve, reject) {
        gm(fname).gravity('Center').thumb(200, 200, thumbnailFilePath, 100,(err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        // sharp(fname).resize(200, 200).toFile(thumbnailFilePath, (err, resizeImage) => {
        //     if (err) {
        //         reject(err);
        //     } else {
        //         resolve(resizeImage);
        //     }
        // });
    })
}

const getImageSize = async function (fname) {
    return new Promise(function (resolve, reject) {
        gm(fname).size((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result)
            }
        });
    })
}

async function transfomAlbumsAndPhotos(pathToAlbums, data, transformedData) {
    let albumArray = [];
    let i = 0;
    let limit = 4;

    await Promise.all(data.album.map(async (element) => {
        // data.album.forEach(function (element) {
        i++;
        if (i < 0 | i > limit){
            return;
        }
        console.log("Migrating nbr " + i + " " +element.namn);


        let photos = [];

        var destinationDir = pathToAlbums + element._id;

        if (!fs.existsSync(destinationDir)){
            fs.mkdirSync(destinationDir, { recursive: true } );
        }

        await Promise.all(data.bilder_ny2.map(async (bild) => {
            if (element.id == bild.albumid) {

                let {fileName, thumbnailFileName} = await CopyFileAndThumbnail(bild, destinationDir);

                let photoSize = await getImageSize(destinationDir + "/" + fileName);
                let thumbnailSize = await getImageSize(destinationDir + "/" + thumbnailFileName);

                photos.push({
                    _id: bild._id,
                    createdAt: element.date,
                    updatedAt: element.date,
                    createdBy: bild.namn,
                    updatedBy: bild.namn,
                    filename: fileName,
                    thumbnail: thumbnailFileName,
                    width: photoSize.width,
                    height: photoSize.height,
                    thumbnailWidth: thumbnailSize.width,
                    thumbnailHeight: thumbnailSize.height,
                    title: bild.bildnamn,
                    text: bild.text,
                    tags: bild.tagstr
                });
            }
        }));

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
        };
    }));

    transformedData.albums = albumArray;
}

async function CopyFileAndThumbnail(bild, destinationDir) {
    let fileName = bild.filnamn.split('/').pop();
    let fileOnDisk = "../../../album/" + fileName;
    let destinationFilePath = destinationDir + "/" + fileName;

    let thumbnailFileName = fileName.replace(/(\.[^\.]+)$/, '_thumbnail$1');
    let thumbnailFilePath = destinationDir + "/" + thumbnailFileName;
    fs.copyFileSync(fileOnDisk, destinationFilePath);
    await createThumbnail(fileOnDisk, thumbnailFilePath);

    return {fileName, thumbnailFileName};
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

//   let commentsArray = [];
//   data.comments.forEach(function (element) {
//     // let postId;
//     // data.nyblog.forEach(function(oldBlogPost) {
//     //   postId = oldBlogPost._id;
//     // }, this);
//
//     // if (!postId) throw error;
//
//     commentsArray.push({
//       _id: element._id,
//       text: element.text,
//       date: element.date,
//       // postId: postId,
//       username: element.namn
//     });
//   }, this);
//
//   transformedData.comments = commentsArray;
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


module.exports = {
    transformData
};
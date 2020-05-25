const {createGetAllRoute, createPostRoute, createGetByIdRoute, createPatchRoute, createDeleteRoute, createEmbeddedDocDeleteRoute, createEmbeddedDocGetRoute, createEmbeddedDocPatchRoute} = require("./controllerFactory.js");
const {Album, Photo} = require("./../models/Album");
const multer = require("multer");
const ObjectID = require("mongodb").ObjectID;
const gm = require("gm");
const fs = require("fs");

const thumbnailWidth = 140;
const thumbnailHeight = 86;
const fileExtensionPattern = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi;

function createPhotoPostRoute(app) {
    const authMiddleware = (req, res, next) => {
        if (!req.auth) {
            return res.status(403).send();
        }
        next();
    };

    app.use("/albums/:id/photos", authMiddleware);

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "./upload");
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    });

    const upload = multer({
        storage: storage,
        limits: {fileSize: 30 * 1024 * 1024},
    }); // 30 MB max

    app.post("/albums/:id/photos", upload.single("file"), (req, res) => {
            if (!req.file) {
                return res.status(400).send("No file received");
            }

            let albumId = req.params.id;
            let uploadFilePath = "./upload/" + req.file.filename;
            let photo = {};

            photo._id = new ObjectID();
            photo.createdBy = req.auth.username;
            photo.updatedBy = req.auth.username;

            gm(uploadFilePath).size((err, gmResult) => {
                if (err) {
                    fs.unlinkSync(uploadFilePath)
                    res.status(500).send("Failed get metadata of uploaded file");
                }

                let width = gmResult.width;
                let height = gmResult.height;

                const finalFileName = photo._id + req.file.filename.match(fileExtensionPattern)[0];
                const thumbnailName = finalFileName.replace(/(\.[^\.]+)$/, '_thumbnail$1');

                const destDir = "./static/albums/" + albumId + "/";

                const imageFilePath = destDir + finalFileName;
                const thumbnailFilePath = destDir + thumbnailName;

                if (!fs.existsSync(destDir)) {
                    fs.mkdirSync(destDir);
                }

                fs.renameSync(uploadFilePath, imageFilePath);

                gm(imageFilePath).gravity('Center').thumb(width, height, thumbnailFilePath, 100, (err, data) => {
                    if (err) {
                        fs.unlinkSync(imageFilePath)
                        res.status(500).send("Failed get metadata of uploaded file");
                    }

                    photo["title"] = finalFileName;
                    photo["filename"] = finalFileName;
                    photo["width"] = gmResult.width;
                    photo["height"] = gmResult.height;
                    photo["thumbnail"] = thumbnailName;
                    photo["thumbnailWidth"] = thumbnailWidth;
                    photo["thumbnailHeight"] = thumbnailHeight;
                    photo["width"] = width;
                    photo["height"] = height;

                    let mongoDbInput = {};
                    let mongoDbInnerInput = {};
                    mongoDbInnerInput["photos"] = photo;
                    mongoDbInput["$push"] = mongoDbInnerInput;

                    Album.update({_id: albumId}, mongoDbInput).then(
                        (doc) => {
                            Album
                                .findById(albumId)
                                .then(result => {
                                    if (!result) {
                                        return res.status(404).send();
                                    }
                                    let createdPhoto = result._doc.photos.id(photo._id);
                                    res.status(201).send(createdPhoto);
                                })
                                .catch(e => {
                                    res.status(400).send();
                                });
                        }
                    );
                });
            })
        }
    );
}

const registerAlbum = function (app) {

    let photoAsEmbeddedDocument = {
        embeddedEntity: "photos",
        embeddedEntityParser: (req) => {
            return {
                title: req.body.title,
                filename: req.body.filename,
                thumbnail: req.body.thumbnail,
            };
        },
    };

    createPostRoute(app,"album",(req) => new Album({ title: req.body.title })); // Skip embedded docs here - No need for creating photos together with the album
    createGetAllRoute(app, "album", Album, [photoAsEmbeddedDocument]);
    createGetByIdRoute(app, "album", Album);
    createPatchRoute(app, "album", Album, [photoAsEmbeddedDocument]);
    createDeleteRoute(app, "album", Album, [photoAsEmbeddedDocument]);
    createEmbeddedDocGetRoute(app, "album", photoAsEmbeddedDocument, Album);
    createEmbeddedDocPatchRoute(app, "album", photoAsEmbeddedDocument, Album);
    createEmbeddedDocDeleteRoute(app, "album", photoAsEmbeddedDocument, Album);

    createPhotoPostRoute(app);
    
    const createThumbnail = async function (filePath, thumbnailFilePath, width, height) {
        return new Promise(function (resolve, reject) {
            gm(filePath).gravity('Center').thumb(width, height, thumbnailFilePath, 100, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        })
    }

    const getImageSize = async function (filePath) {
        return new Promise(function (resolve, reject) {
            gm(filePath).size((err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result)
                }
            });
        })
    }
}


module.exports = {registerAlbum};

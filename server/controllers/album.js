const {createController, CreateGetAllRoute, CreatePostRoute} = require("./controllerFactory.js");
const {Album} = require("./../models/Album");
const multer = require("multer");
const ObjectID = require("mongodb").ObjectId;

var fs = require("fs");

const registerAlbum = function (app) {
    CreatePostRoute(
        app,
        "album",
        (req) =>
            new Album({
                title: req.body.title,
            })
        // Skip embedded docs here - No need for creating photos together with the album
    );

    CreateGetAllRoute(
        app,
        "album",
        Album,
        [
            {
                embeddedEntity: "photos",
                embeddedEntityParser: (req) => {
                    return {
                        title: req.body.title,
                        filename: req.body.filename,
                        thumbnail: req.body.thumbnail,
                    };
                },
            },
        ]);

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

    var upload = multer({
        storage: storage,
        limits: {fileSize: 30 * 1024 * 1024},
    }); // 30 MB max

    app.post("/albums/:id/photos", upload.single("file"), (req, res) => {
        if (!req.file) {
            return res.status(400).send("No file received");
        }

        let id = req.params.id;

        let embeddedDoc = {};

        embeddedDoc._id = new ObjectID();
        embeddedDoc.createdBy = req.auth.username;
        embeddedDoc.updatedBy = req.auth.username;

        const thumbnailName = req.file.filename.replace(/(\.[^\.]+)$/, '_thumbnail$1');

        let photo = {
            title : req.file.filename,
            filename : req.file.filename,
            thumbnail : thumbnailName
        };

        let mongoDbInput = {};
        let mongoDbInnerInput = {};
        mongoDbInnerInput["photos"] = photo;
        mongoDbInput["$push"] = mongoDbInnerInput;

        Album.update({_id: id}, mongoDbInput).then(
            (doc) => {

                let destDir = "./static/albums/" + id + "/";
                if (!fs.existsSync(destDir)) {
                    fs.mkdirSync(destDir);
                }

                fs.rename(
                    "./upload/" + req.file.filename,
                    "./static/albums/" + id + "/" + req.file.filename,
                    function (err, stats) {
                        if (err) {
                            // TODO: Delete photo
                            res.status(500).send("Failed to move file");
                        }
                        res.status(201).send(req.file);

                    }
                );
            },
            (e) => {
                res.status(400).send(e);
            }
        );
    });
};

module.exports = {registerAlbum};

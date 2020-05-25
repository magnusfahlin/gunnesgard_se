const ObjectID = require("mongodb").ObjectId;


const timeLimitForDeletions = 24 * 60 * 60 * 1000; // ms

function createEntityPath(entityName) {
    const entityPath = "/" + entityName + "s";
    return entityPath;
}

function CreatePostRoute(app, entityName, parseRequest, embeddedDocuments) {
    app.post(createEntityPath(entityName), (req, res) => {
        if (!req.auth) {
            return res.status(403).send();
        }

        let entity = parseRequest(req);
        entity.createdBy = req.auth.username;
        entity.updatedBy = req.auth.username;

        if (embeddedDocuments) {
            embeddedDocuments.forEach(element => {
                entity[element.embeddedEntity] = [];
            });
        }

        entity.save().then(
            doc => {
                res.status(201).send(doc);
            },
            e => {
                res.status(400).send(e);
            }
        );
    });
}

function CreateGetAllRoute(app, entityName, model, embeddedDocuments) {
    app.get(createEntityPath(entityName), (req, res) => {
        let includeEmbeddedDocs = true;
        let sort = {};
        let projectionArg = {};
        let limit = 0;

        if (!req.auth) {
            if (entityName == "post") {
                limit = parseInt(process.env.POSTS_SHOWN_NOT_LOGGED_IN);
                includeEmbeddedDocs = false;
            } else {
                return res.status(403).send();
            }
        }

        if (
            !includeEmbeddedDocs ||
            (req.query.includeEmbeddedDocs &&
                req.query.includeEmbeddedDocs.toLowerCase() === "false")
        ) {
            includeEmbeddedDocs = false;
            embeddedDocuments.forEach(element => {
                projectionArg[element.embeddedEntity] = 0;
            });
        }

        if (req.query.sort) {
            sort[req.query.sort] = 1;
            if (req.query.sortOrder && req.query.sortOrder.toLowerCase() === "desc") {
                sort[req.query.sort] = -1;
            }
        }

        if (req.query.count) {
            limit = parseInt(req.query.count);
        }

        var find = projectionArg ? model.find({}, projectionArg) : model.find();
        find = find.limit(limit).sort(sort);

        find.then(
            entity => {
                res.send(entity);
            },
            e => {
                res.status(400).send(e);
            }
        );
    });
}

function CreateGetByIdRoute(app, entityName, model) {
    app.get(createEntityPath(entityName) + "/:id", (req, res) => {
        if (!req.auth) {
            return res.status(403).send();
        }

        let id = req.params.id;

        // Validates id
        if (!ObjectID.isValid(id)) {
            return res.status(404).send("ID is not valid");
        }

        model
            .findById(id)
            .then(entity => {
                if (!entity) {
                    return res.status(404).send();
                }
                res.send(entity);
            })
            .catch(e => {
                res.status(400).send();
            });
    });
}

const createController = function (
    app,
    entityName,
    model,
    parseRequest,
    embeddedDocuments
) {
    CreatePostRoute(app, entityName, parseRequest, embeddedDocuments);

    // GET HTTP request is called on /[entityName] path
    CreateGetAllRoute(app, entityName, model, embeddedDocuments);

    // GET HTTP request is called to retrieve individual entity
    CreateGetByIdRoute(app, entityName, model);

    function modifyEmbeddedDoc(
        parameter,
        model,
        id,
        embeddedDocName,
        embeddedDoc,
        req,
        res,
        statusCode
    ) {
        // Validates id
        if (!ObjectID.isValid(id) || !ObjectID.isValid(embeddedDoc._id)) {
            return res.status(404).send("ID is not valid");
        }

        let mongoDbInput = {};
        let mongoDbInnerInput = {};
        mongoDbInnerInput[embeddedDocName] = embeddedDoc;
        mongoDbInput[parameter] = mongoDbInnerInput;

        model.update({_id: id}, mongoDbInput).then(
            doc => {
                res.status(statusCode).send(doc);
            },
            e => {
                res.status(400).send(e);
            }
        );
    }

    if (embeddedDocuments) {
        embeddedDocuments.forEach(element => {
            app.get(createEntityPath(entityName) + "/:id/" + element.embeddedEntity, (req, res) => {
                let id = req.params.id;

                // Validates id
                if (!ObjectID.isValid(id)) {
                    return res.status(404).send("ID is not valid");
                }

                model
                    .findById(id)
                    .then(entity => {
                        if (!entity) {
                            return res.status(404).send();
                        }
                        const embeddedDocs = entity[element.embeddedEntity];
                        res.send(embeddedDocs);
                    })
                    .catch(e => {
                        res.status(400).send();
                    });
            });

            app.post(createEntityPath(entityName) + "/:id/" + element.embeddedEntity, (req, res) => {
                if (!req.auth) {
                    return res.status(403).send();
                }
                let id = req.params.id;
                let embeddedDoc = element.embeddedEntityParser(req);
                if (!embeddedDoc._id || !ObjectID.isValid(embeddedDoc._id)) {
                    embeddedDoc._id = new ObjectID();
                }
                embeddedDoc.createdBy = req.auth.username;
                embeddedDoc.updatedBy = req.auth.username;

                modifyEmbeddedDoc(
                    "$push",
                    model,
                    id,
                    element.embeddedEntity,
                    embeddedDoc,
                    req,
                    res,
                    201
                );
            });

            // app.put(
            //   entityPath + "/:id/" + element.embeddedEntity + "/:embeddedId/",
            //   (req, res) => {
            //     if (!req.auth) {
            //       return res.status(403).send();
            //     }

            //     let id = req.params.id;
            //     let embeddedDoc = element.embeddedEntityParser(req);
            //     embeddedDoc._id = req.params.embeddedId;
            //     embeddedDoc.updatedBy = req.auth.username;
            //     modifyEmbeddedDoc(
            //       "$set",
            //       model,
            //       id,
            //       element.embeddedEntity,
            //       embeddedDoc,
            //       req,
            //       res,
            //       200
            //     );
            //   }
            // );

            //   app.delete(
            //     entityPath + "/:id/" + element.embeddedEntity + "/:embeddedId/",
            //     (req, res) => {
            //       let id = req.params.id;
            //       // let embeddedDoc = element.embeddedEntityParser(req);
            //       let embeddedDoc = { _id: req.params.embeddedId };
            //       embeddedDoc.updatedBy = req.auth.username;

            //       modifyEmbeddedDoc(
            //         "$pull",
            //         model,
            //         id,
            //         element.embeddedEntity,
            //         embeddedDoc,
            //         req,
            //         res,
            //         204
            //       );
            //     }
            //   );
        });
    }

    // HTTP DELETE request routed to /[entityName]/:id
    app.delete(createEntityPath(entityName) + "/:id", (req, res) => {
        if (!req.auth) {
            return res.status(403).send();
        }
        let id = req.params.id;
        // Validates id
        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }

        model.findById(id).exec()
            .then(entity => {

                if (!entity) {
                    throw {
                        statusCode: 404,
                        message: "Not Found"
                    };
                }

                if (entity.createdBy !== req.auth.username) {
                    throw {
                        statusCode: 403,
                        message: "Not creating user"
                    };
                }

                if (embeddedDocuments) {
                    embeddedDocuments.forEach(embeddedEntity => {
                        if (entity[embeddedEntity].length > 0){
                            throw {
                                statusCode: 403,
                                message: "Not possible to delete because there still exists " + embeddedEntity
                            };
                        }
                    });
                }

                if (Math.abs(new Date() - entity.createdAt > timeLimitForDeletions)) {
                    throw {
                        statusCode: 403,
                        message: "Not possible to delete because of age"
                    };
                }
            })
            .then(() => model.findByIdAndDelete(id)

                .then(entity => {

                    if (!entity) {
                        res.status(404).send();
                    } else {
                        res.status(204).send();
                    }
                })
                .catch(e => {
                    res.status(400).send(e);
                })
            )
            .catch(e => {
                res.status(e.statusCode).send(e.message);
            });

    })


    app.patch(createEntityPath(entityName) + "/:id", (req, res) => {
        if (!req.auth) {
            return res.status(403).send();
        }

        let id = req.params.id;
        let entity = req.body;

        // Should probably be moved to Mongoose hooks
        entity.updatedBy = req.auth.username;
        delete entity["id"];
        delete entity["_id"];
        delete entity["createdBy"];

        model
            .findOneAndUpdate({_id: id, createdBy: req.auth.username}, entity, {
                runValidators: true, new: true
            })
            .then(doc => {
                if (!doc) {
                    return res.status(404).send();
                } else {
                    model
                        .findById(id)
                        .then(updated => {
                            if (!updated) {
                                return res.status(404).send();
                            }
                            res.status(200).send(updated);
                        })
                        .catch(e => {
                            res.status(400).send();
                        });
                }
            })
            .catch(e => {
                res.status(400).send(e);
            });
    })
}


module.exports = {createController, CreateGetAllRoute, CreatePostRoute, CreateGetByIdRoute};

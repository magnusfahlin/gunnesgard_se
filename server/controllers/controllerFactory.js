const ObjectID = require("mongodb").ObjectId;

const timeLimitForDeletions = 24 * 60 * 60 * 1000; // ms

function createEntityPath(entityName) {
    const entityPath = "/" + entityName + "s";
    return entityPath;
}

function createPostRoute(app, entityName, parseRequest, embeddedDocuments) {
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

function createGetAllRoute(app, entityName, model, embeddedDocuments) {
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

function createGetByIdRoute(app, entityName, model) {
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

function createPatchRoute(app, entityName, model, embeddedDocuments) {
    app.patch(createEntityPath(entityName) + "/:id", runAsyncWrapper(async (req, res) => {
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

        if (embeddedDocuments) {
            embeddedDocuments.forEach(embeddedDoc => {
                delete entity[embeddedDoc.embeddedEntity];
            });
        }


        await model.findById(id).exec()
            .then(entity => {

                if (!entity) {
                    res.status(404).send("Not found");
                    return;
                }

                if (entity.createdBy !== req.auth.username) {
                    res.status(403).send("Not creating user");
                    return;
                }

                if (Math.abs(new Date() - entity.createdAt > timeLimitForDeletions)) {
                    res.status(403).send("Not possible to delete because of age");

                }
            });

        if (res.finished) {
            return;
        }

        await model
            .findOneAndUpdate({_id: id, createdBy: req.auth.username}, entity, {
                runValidators: true, new: true
            }).exec()
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
    }))
}

function createDeleteRoute(app, entityName, model, embeddedDocuments) {
    app.delete(createEntityPath(entityName) + "/:id", runAsyncWrapper(async (req, res) => {
        if (!req.auth) {
            return res.status(403).send();
        }
        let id = req.params.id;
        // Validates id
        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }

        await model.findById(id).exec()
            .then(entity => {

                if (!entity) {
                    res.status(404).send("Not found");
                    return;
                }

                if (entity.createdBy !== req.auth.username) {
                    res.status(403).send("Not creating user");
                    return;
                }

                if (embeddedDocuments) {
                    embeddedDocuments.forEach(embeddedDocument => {
                        if (entity[embeddedDocument.embeddedEntity].length > 0) {
                            res.status(403).send("Not possible to delete because there still exists " + embeddedDocument.embeddedEntity);

                        }
                    });
                }

                if (Math.abs(new Date() - entity.createdAt > timeLimitForDeletions)) {
                    res.status(403).send("Not possible to delete because of age");

                }
            });

        if (res.finished) {
            return;
        }

        await model.findByIdAndDelete(id).exec()
            .then(entity => {

                if (!entity) {
                    res.status(404).send("Not found");
                } else {
                    res.status(204).send();
                }
            });
    }));
}

function createEmbeddedDocGetRoute(app, entityName, embeddedDocument, model) {
    app.get(createEntityPath(entityName) + "/:id/" + embeddedDocument.embeddedEntity, (req, res) => {
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
                const embeddedDocs = entity[embeddedDocument.embeddedEntity];
                res.send(embeddedDocs);
            })
            .catch(e => {
                res.status(400).send();
            });
    });
}

function createEmbeddedDocPostRoute(app, entityName, embeddedDocument, model) {
    app.post(createEntityPath(entityName) + "/:id/" + embeddedDocument.embeddedEntity, (req, res) => {
        if (!req.auth) {
            return res.status(403).send();
        }
        let id = req.params.id;
        let embeddedDoc = embeddedDocument.embeddedEntityParser(req);
        if (!embeddedDoc._id || !ObjectID.isValid(embeddedDoc._id)) {
            embeddedDoc._id = new ObjectID();
        }
        embeddedDoc.createdBy = req.auth.username;
        embeddedDoc.updatedBy = req.auth.username;

        modifyEmbeddedDoc(
            "$push",
            model,
            id,
            embeddedDocument.embeddedEntity,
            embeddedDoc,
            req,
            res,
            201
        );
    });
}

function createEmbeddedDocPatchRoute(app, entityName, embeddedDocument, model) {
    app.patch(
        createEntityPath(entityName) + "/:id/" + embeddedDocument.embeddedEntity + "/:embeddedId/",
        runAsyncWrapper(async (req, res) => {
                if (!req.auth) {
                    return res.status(403).send();
                }

                let id = req.params.id;
                let embeddedId = req.params.embeddedId;
                let currentDoc = await validateEmbeddedDocDelUpdateOperation(model, id, res, embeddedDocument, embeddedId, req);

                if (res.finished) {
                    return;
                }

                let embeddedDoc = embeddedDocument.embeddedEntityParser(req);
                embeddedDoc._id = embeddedId;
                embeddedDoc.updatedBy = req.auth.username;

                Object.keys(embeddedDoc).forEach(function (key, _) {
                    if (!embeddedDoc[key]) {
                        embeddedDoc[key] = currentDoc[key];
                    }
                });

                modifyEmbeddedDoc(
                    "$set",
                    model,
                    id,
                    embeddedDocument.embeddedEntity,
                    embeddedDoc,
                    req,
                    res,
                    200
                );
            }
        ));
}

function createEmbeddedDocDeleteRoute(app, entityName, embeddedDocument, model) {
    app.delete(createEntityPath(entityName) + "/:id/" + embeddedDocument.embeddedEntity + "/:embeddedId/",
        runAsyncWrapper(async (req, res) => {
                let id = req.params.id;
                let embeddedId = req.params.embeddedId;
                await validateEmbeddedDocDelUpdateOperation(model, id, res, embeddedDocument, embeddedId, req);

                if (res.finished) {
                    return;
                }

                // let embeddedDoc = element.embeddedEntityParser(req);
                let embeddedDoc = {_id: embeddedId};
                //  embeddedDoc.updatedBy = req.auth.username;

                modifyEmbeddedDoc(
                    "$pull",
                    model,
                    id,
                    embeddedDocument.embeddedEntity,
                    embeddedDoc,
                    req,
                    res,
                    204
                );
            }
        ));
}

const createController = function (
    app,
    entityName,
    model,
    parseRequest,
    embeddedDocuments
) {
    createPostRoute(app, entityName, parseRequest, embeddedDocuments);

    // GET HTTP request is called on /[entityName] path
    createGetAllRoute(app, entityName, model, embeddedDocuments);

    // GET HTTP request is called to retrieve individual entity
    createGetByIdRoute(app, entityName, model);

    // PATCH HTTP request
    createPatchRoute(app, entityName, model);

    // HTTP DELETE request routed to /[entityName]/:id
    createDeleteRoute(app, entityName, model, embeddedDocuments);


    if (embeddedDocuments) {
        embeddedDocuments.forEach(embeddedDocument => {
            createEmbeddedDocGetRoute(app, entityName, model);
            createEmbeddedDocPostRoute(app, entityName, embeddedDocument, model);
            createEmbeddedDocPatchRoute(app, entityName, embeddedDocument, model);
            createEmbeddedDocDeleteRoute(app, entityName, embeddedDocument, model);
        });
    }
}

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

async function validateEmbeddedDocDelUpdateOperation(model, id, res, element, embeddedId, req) {
    await model.findById(id).exec()
        .then(entity => {

            if (!entity) {
                res.status(404).send("Not found");
                return;
            }

            const embeddedEntity = entity[element.embeddedEntity].find(embedded => embedded.id === embeddedId)
            if (!embeddedEntity) {
                res.status(404).send("Not found");
                return;
            }

            if (embeddedEntity.createdBy !== req.auth.username) {
                res.status(403).send("Not creating user");
                return;
            }

            if (Math.abs(new Date() - embeddedEntity.createdAt > timeLimitForDeletions)) {
                res.status(403).send("Not possible to do operation because of age");

            }

            return entity;
        });
}

function runAsyncWrapper(callback) {
    return function (req, res, next) {
        callback(req, res, next)
            .catch(next)
    }
}

module.exports = {
    createController,
    createGetAllRoute,
    createPostRoute,
    createGetByIdRoute,
    createPatchRoute,
    createDeleteRoute,
    createEmbeddedDocGetRoute,
    createEmbeddedDocPostRoute,
    createEmbeddedDocPatchRoute,
    createEmbeddedDocDeleteRoute
};

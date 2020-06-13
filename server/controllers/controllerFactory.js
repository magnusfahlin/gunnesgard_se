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

function createEmbeddedDocGetAllRoute(app, entityName, embeddedDocument, model) {
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

function createEmbeddedDocGetByIdRoute(app, entityName, embeddedDocument, model) {
    app.get(createEntityPath(entityName) + "/:id/" + embeddedDocument.embeddedEntity + "/:embeddedId/", (req, res) => {
        let id = req.params.id;
        let embeddedId = req.params.embeddedId;

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
                const embeddedDoc = entity[embeddedDocument.embeddedEntity].find(emb => emb.id == embeddedId);
                if (!embeddedDoc) {
                    res.status(400).send();
                    return;
                }
                res.send(embeddedDoc);
            })
            .catch(e => {
                res.status(400).send();
            });
    });
}

function createEmbeddedDocPostRoute(app, entityName, embeddedDocument, model) {
    app.post(createEntityPath(entityName) + "/:id/" + embeddedDocument.embeddedEntity,
        runAsyncWrapper(async (req, res) => {
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

                // Validates id
                if (!ObjectID.isValid(id)) {
                    return res.status(404).send("ID is not valid");
                }

                if (res.finished) {
                    return;
                }

                const existing = await model
                    .findOne({_id: id}).exec()
                    .catch(e => {
                        res.status(404).send();
                    })

                if (res.finished) {
                    return;
                }

                const embeddedEntities = existing[embeddedDocument.embeddedEntity];

                embeddedEntities.push(embeddedDoc)

                existing[embeddedDocument.embeddedEntity] = embeddedEntities;

                existing.markModified(embeddedDocument.embeddedEntity);
                const savedEntity = await existing.save({validateBeforeSave: false})
                    .catch(e => {
                        res.status(500).send();
                    })

                if (res.finished) {
                    return;
                }

                const savedEmbeddedEntities = savedEntity[embeddedDocument.embeddedEntity];
                res.status(201).send(savedEmbeddedEntities[savedEmbeddedEntities.findIndex(el => el.id.toString() === embeddedDoc._id.toString())]);
            }
        ));
}

function createEmbeddedDocPatchRoute(app, entityName, embeddedDocument, model) {
    app.patch(
        createEntityPath(entityName) + "/:id/" + embeddedDocument.embeddedEntity + "/:embeddedId/",
        runAsyncWrapper(async (req, res) => {
                if (!req.auth) {
                    return res.status(403).send();
                }

                const id = req.params.id;
                const embeddedId = req.params.embeddedId;
                const username = req.auth.username;
                const embeddedEntityName = embeddedDocument.embeddedEntity;

                // Validates id
                if (!ObjectID.isValid(id) || !ObjectID.isValid(embeddedId)) {
                    return res.status(404).send("ID is not valid");
                }

                const validationError = await validateEmbeddedDocDelUpdateOperation(model, id, embeddedEntityName, embeddedId, username);

                if (validationError) {
                    return res.status(validationError.status).send(validationError.body);
                }

                const embeddedDoc = embeddedDocument.embeddedEntityParser(req);
                embeddedDoc._id = ObjectID(embeddedId);

                const existing = await model
                    .findOne({_id: id}).exec()
                    .catch(e => {
                        res.status(404).send();
                    })

                if (res.finished) {
                    return;
                }

                const embeddedEntities = existing[embeddedEntityName];
                let currentEmbeddedDoc = embeddedEntities[embeddedEntities.findIndex(el => el.id.toString() === embeddedId)];

                if (!currentEmbeddedDoc) {
                    res.status(404).send();
                }

                Object.keys(currentEmbeddedDoc._doc).forEach(function (key, _) {
                    if (embeddedDoc[key]) {
                        currentEmbeddedDoc._doc[key] = embeddedDoc[key];
                    }
                });

                currentEmbeddedDoc._doc.updatedBy = req.auth.username;

                embeddedEntities[embeddedEntities.findIndex(el => el.id === embeddedId)] = currentEmbeddedDoc;
                existing[embeddedEntityName] = embeddedEntities;

                existing.markModified(embeddedEntityName);
                const savedEntity = await existing.save({validateBeforeSave: false})
                    .catch(e => {
                        res.status(500).send();
                    })

                if (res.finished) {
                    return;
                }

                const savedEmbeddedEntities = savedEntity[embeddedEntityName];
                res.status(200).send(savedEmbeddedEntities[savedEmbeddedEntities.findIndex(el => el.id.toString() === embeddedId)]);
            }
        ));
}

function createEmbeddedDocDeleteRoute(app, entityName, embeddedDocument, model) {
    app.delete(createEntityPath(entityName) + "/:id/" + embeddedDocument.embeddedEntity + "/:embeddedId/",
        runAsyncWrapper(async (req, res) => {
                const id = req.params.id;
                const embeddedId = req.params.embeddedId;
                const username = req.auth.username;
                const embeddedEntityName = embeddedDocument.embeddedEntity;

                const {status, body} = await innerEmbeddedDocDeleteRoute(model, embeddedEntityName, id, embeddedId, username);

                return res.status(status).send(body);
            }
        ));
}

async function innerEmbeddedDocDeleteRoute(model, embeddedEntityName, id, embeddedId, username) {
    const validationError = await validateEmbeddedDocDelUpdateOperation(model, id, embeddedEntityName, embeddedId, username);

    if (validationError) {
        return validationError;
    }

    if (!ObjectID.isValid(id) || !ObjectID.isValid(embeddedId)) {
        return {
            status: 400,
            body: "Id is not valid",
        };
    }

    const existing = await model
        .findOne({_id: id}).exec()
        .catch(e => {
            return {
                status: 404,
                body: "Not found",
            };
        })

    const toDelete = existing[embeddedEntityName].find(embedded => embedded.id === embeddedId);
    if (!toDelete){
        return {
            status: 404,
            body: "Not found",
        };
    }

    existing[embeddedEntityName] = existing[embeddedEntityName].filter(embedded => embedded.id !== toDelete.id);

    await existing.save({validateBeforeSave: false})
        .catch(e => {
            return {
                status: 500,
                body: "Internal server error",
            };
        })

    return {
        status: 204,
        body: toDelete.toJSON(),
    };
}

const defaultOptionsEmbeddedDocsOptions = {
    createPost: true,
    createGetAll: true,
    createGetById: true,
    createPatch: true,
    createDelete: true
}

const defaultOptions = {
    createPost: true,
    createGetAll: true,
    createGetById: true,
    createPatch: true,
    createDelete: true,
    embeddedDocsOptions: {}
}

const createController = function (
    app,
    entityName,
    model,
    parseRequest,
    embeddedDocuments,
    options
) {
    options = Object.assign(defaultOptions, options);

    if (embeddedDocuments) {
        embeddedDocuments.forEach(embeddedDocument => {
            options.embeddedDocsOptions[embeddedDocument.embeddedEntity] = Object.assign(defaultOptionsEmbeddedDocsOptions, options.embeddedDocsOptions[embeddedDocument.embeddedEntity]);
        });
    }

    if (options.createPost) {
        createPostRoute(app, entityName, parseRequest, embeddedDocuments);
    }

    // GET HTTP request is called on /[entityName] path
    if (options.createGetAll) {
        createGetAllRoute(app, entityName, model, embeddedDocuments);
    }

    // GET HTTP request is called to retrieve individual entity
    if (options.createGetById) {
        createGetByIdRoute(app, entityName, model);
    }

    // PATCH HTTP request
    if (options.createPatch) {
        createPatchRoute(app, entityName, model, embeddedDocuments);
    }
    // HTTP DELETE request routed to /[entityName]/:id
    if (options.createDelete) {
        createDeleteRoute(app, entityName, model, embeddedDocuments);
    }

    if (embeddedDocuments) {
        embeddedDocuments.forEach(embeddedDocument => {

            if (options.embeddedDocsOptions[embeddedDocument.embeddedEntity].createPost) {
                createEmbeddedDocPostRoute(app, entityName, embeddedDocument, model);
            }

            if (options.embeddedDocsOptions[embeddedDocument.embeddedEntity].createGetAll) {
                createEmbeddedDocGetAllRoute(app, entityName, embeddedDocument, model);
            }

            if (options.embeddedDocsOptions[embeddedDocument.embeddedEntity].createGetById) {
                createEmbeddedDocGetByIdRoute(app, entityName, embeddedDocument, model);
            }

            if (options.embeddedDocsOptions[embeddedDocument.embeddedEntity].createPatch) {
                createEmbeddedDocPatchRoute(app, entityName, embeddedDocument, model);
            }
            if (options.embeddedDocsOptions[embeddedDocument.embeddedEntity].createDelete) {
                createEmbeddedDocDeleteRoute(app, entityName, embeddedDocument, model);
            }
        });
    }
}

async function validateEmbeddedDocDelUpdateOperation(model, id, embeddedEntityName, embeddedId, username) {
    return await model.findById(id).exec()
        .then(entity => {

            if (!entity) {
                return {
                    status: 404,
                    body: "Not found",
                };
            }

            const embeddedEntity = entity[embeddedEntityName].find(embedded => embedded.id === embeddedId)
            if (!embeddedEntity) {
                return {
                    status: 404,
                    body: "Not found",
                };
            }

            if (embeddedEntity.createdBy !== username) {
                return {
                    status: 403,
                    body: "This must be done by the user creating the item",
                };
            }

            if (Math.abs(new Date() - embeddedEntity.createdAt > timeLimitForDeletions)) {
                return {
                    status: 403,
                    body: "Not possible to do operation because of age",
                };
            }

            return false;
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
    runAsyncWrapper,
    innerEmbeddedDocDeleteRoute
};

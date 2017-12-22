const createController = function(app, entityName, model, parseRequest) {
  var entityPath = "/" + entityName + "s";
  app.post(entityPath, (req, res) => {
    let entity = parseRequest(req);

    entity.save().then(
      doc => {
        res.send(doc);
      },
      e => {
        res.status(400).send(e);
      }
    );
  });

  // GET HTTP request is called on /[entityName] path
  app.get(entityPath, (req, res) => {
    model.find().then(
      entity => {
        res.send(entity);
      },
      e => {
        res.status(400).send(e);
      }
    );
  });

  // GET HTTP request is called to retrieve individual entity
  app.get(entityPath + "/:id", (req, res) => {
    let id = req.params.id;

    // Validates id
    if (!ObjectId.isValid(id)) {
      return res.status(404).send("ID is not valid");
    }

    model.findById(id)
      .then(entity => {
        if (!entity) {
          return res.status(404).send();
        }
        res.send({ entity });
      })
      .catch(e => {
        res.status(400).send();
      });
  });

  // HTTP DELETE request routed to /[entityName]/:id
  app.delete(entityPath + ":id", (req, res) => {
    let id = req.params.id;
    // Validates id
    if (!ObjectId.isValid(id)) {
      return res.status(404).send();
    }
    // Finds todo with the retrieved id, and removes it
    Model.findByIdAndRemove(id)
      .then(entity => {
        // If no todo is found with that id, an error is sent
        if (!entity) {
          return res.status(404).send();
        }

        // Responds with todo
        res.send({ entity });

        // Error handler to catch and send error
      })
      .catch(e => {
        res.status(400).send();
      });
  });

  // HTTP PATCH requested routed to /[entityName]/:id
  app.patch(entityPath + ":id", (req, res) => {
    let id = req.params.id;

    //  Creates an object called body of the picked values (text and completed), from the response gotten
    let body = _.pick(req.body, ["text", "completed"]);

    // Validates id
    if (!ObjectId.isValid(id)) {
      // Returns 400 error and error message when id is not valid
      return res.status(404).send();
    }

    // Checks if body.completed is boolean, and if it is set
    if (_.isBoolean(body.completed) && body.completed) {
      // Sets body.completedAt to the current time
      body.completedAt = new Date().getTime();
    } else {
      // Else body.completed is set to false and body.completedAt is null
      body.completed = false;
      body.completedAt = null;
    }

    // Finds a todo with id that matches the retrieved id.
    // Sets the body of the retrieved id to a new one
    model.findOneAndUpdate(id, { $set: body }, { new: true })
      .then(todo => {
        // If no todo is found with that id, an error is sent
        if (!todo) {
          return res.status(404).send();
        }

        // Responds with todo
        res.send({ todo });

        // Error handler to catch and send error
      })
      .catch(e => {
        res.status(400).send();
      });
  });
}

module.exports = { createController };
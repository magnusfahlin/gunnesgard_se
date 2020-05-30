"use strict";

const app = require("../server"),
  chai = require("chai"),
  request = require("supertest"),
  expect = require("chai").expect,
  assert = require("chai").assert,
  {jestPromiseWrapper} = require("./utils");


describe("Generic entity API Integration Tests", function() {
  describe("GET entity when NOT logged in", function() {
    it("should get error", function(done) {
      request(app)
        .get("/events")
        .end(function(err, res) {
          expect(res.statusCode).equal(403);
          done();
        });
    });
  });

  describe("GET entity", function() {
    it("should get all entites", function(done) {
      request(app)
        .get("/events")
        .set("x-auth", "test")
        .end(function(err, res) {
          expect(res.statusCode).equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.have.lengthOf(0);
          done();
        });
    });
  });

  describe("Create entity", function() {
    it("should create an entity, with correct properties set", function(done) {
      const event = {
        text: "event1",
        date: new Date("2018-01-07T14:38:27.445Z")
      };
      request(app)
        .post("/events")
        .set("x-auth", "testUser")
        .send(event)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(201);
          let eventResponse = res.body;

          expect(eventResponse.text).to.equal("event1");
          assert(eventResponse.id, "id needs to exist");
          assert(eventResponse.createdAt, "createdAt needs to exist");
          assert(eventResponse.updatedAt, "updatedAt needs to exist");
          assert.isUndefined(eventResponse._id, "_id should not exist");
          assert.isUndefined(eventResponse._v, "_v should not exist");
          assert.equal(eventResponse.createdBy, "testUser");
          assert.equal(eventResponse.updatedBy, "testUser");
          done();
        });
    });
  });

    describe("Delete entity", function() {
        it("should delete an entity, only possible for the creator", function(done) {
            const event = {
                text: "event1",
                date: new Date("2018-01-07T14:38:27.445Z")
            };
            request(app)
                .post("/events")
                .set("x-auth", "test")
                .send(event)
                .end(function(err, res) {
                    expect(res.statusCode).to.equal(201);
                    let eventResponse = res.body;

                    request(app)
                        .delete("/events/" + eventResponse.id)
                        .send(event)
                        .end(function(err, res) {
                            expect(res.statusCode).to.equal(403);

                            request(app)
                                .delete("/events/" + eventResponse.id)
                                .set("x-auth", "test2")
                                .send(event)
                                .end(function(err, res) {
                                    expect(res.statusCode).to.equal(403);

                                    request(app)
                                        .delete("/events/" + eventResponse.id)
                                        .set("x-auth", "test")
                                        .send(event)
                                        .end(function(err, res) {
                                            expect(res.statusCode).to.equal(204);

                                            done();
                                        });
                                });
                        });
                });
        });
    });


    describe("Update entites", function() {
    let event2Id;
    let event2CreatedAt;
    let event2UpdatedAt;

    before(function(done) {
      const event2 = {
        text: "event2",
        date: new Date("2018-01-07T14:38:27.445Z")
      };

      request(app)
        .post("/events")
        .set("x-auth", "test")
        .send(event2)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(201);
          event2Id = res.body.id;
          event2CreatedAt = res.body.createdAt;
          event2UpdatedAt = res.body.updatedAt;
          done();
        });
    });

    describe("PATCH entity", function() {
      it("should get all entites", function(done) {

        const modifiedEvent2 = {
          text: "modifiedEvent2",
          date: new Date("2017-01-07T14:38:27.445Z")
        };

        request(app)
          .patch("/events/" + event2Id)
          .set("x-auth", "test")
          .send(modifiedEvent2)
          .end(function(err, res) {
            expect(res.statusCode).equal(200);

            let eventResponse = res.body;

            expect(eventResponse.text).to.equal("modifiedEvent2");
            expect(eventResponse.id).to.equal(event2Id);
            expect(eventResponse.createdAt).to.equal(event2CreatedAt);
            expect(eventResponse.updatedAt).to.not.equal(event2UpdatedAt);
            done();
          });
      });
    });


        describe("Verify a workflow", function () {
            it("should create a post with a comment, then delete the comment, then the post",
                async () => {
                    return jestPromiseWrapper(
                        async () => {
                            const testAlbum = {
                                title: "post" + new Date()
                            };

                            let response = await request(app)
                                .post("/posts")
                                .set("x-auth", "test")
                                .send(testAlbum);

                            expect(response.statusCode).to.equal(201);
                            let postId = response.body.id;

                            response = await request(app)
                                .post("/posts/" + postId + "/comments")
                                .set("x-auth", "test")
                                .send({text : "comment text"})

                            expect(response.statusCode).to.equal(201);
                            expect(response.body.text).to.equal("comment text");
                            let commentId = response.body.id;

                            // Get the comment
                            response = await request(app)
                                .get("/posts/" + postId)
                                .set("x-auth", "test")

                            expect(response.statusCode).to.equal(200);
                            let responseAlbum = response.body;
                            expect(responseAlbum.comments.length).to.equal(1);

                            // Try to update the post with no comment  - shouldn't delete any comments
                            responseAlbum.comments = [];
                            response = await request(app)
                                .patch("/posts/" + postId)
                                .set("x-auth", "test")
                                .send(responseAlbum)
                            expect(response.statusCode).to.equal(200);
                            expect(responseAlbum.comments.length).to.equal(0);

                            response = await request(app)
                                .get("/posts/" + postId)
                                .set("x-auth", "test")

                            expect(response.statusCode).to.equal(200);
                            responseAlbum = response.body;
                            expect(responseAlbum.comments.length).to.equal(1);

                            // Try to delete the post - shouldn't be possible as there are comments
                            response = await request(app)
                                .delete("/posts/" + postId)
                                .set("x-auth", "test")

                            expect(response.statusCode).to.equal(403);

                            // Delete the comment - should succeed
                            response = await request(app)
                                .delete("/posts/" + postId + "/comments/" + commentId)
                                .set("x-auth", "test");
                            expect(response.statusCode).to.equal(204);

                            response = await request(app)
                                .get("/posts/" + postId)
                                .set("x-auth", "test")

                            expect(response.statusCode).to.equal(200);
                            responseAlbum = response.body;
                            expect(responseAlbum.comments.length).to.equal(0);

                            // Delete the post - should succeed
                            response = await request(app)
                                .delete("/posts/" + postId)
                                .set("x-auth", "test")

                            expect(response.statusCode).to.equal(204);
                        });
                });
        });

        describe("Verify a workflow", function () {
            it("should create a post with a comment and edit the comment",
                async () => {
                    return jestPromiseWrapper(
                        async () => {
                            const testPost = {
                                title: "post" + new Date()
                            };

                            // create post
                            let response = await request(app)
                                .post("/posts")
                                .set("x-auth", "test")
                                .send(testPost);

                            expect(response.statusCode).to.equal(201);
                            let postId = response.body.id;

                            // create comment 1
                            response = await request(app)
                                .post("/posts/" + postId + "/comments")
                                .set("x-auth", "test")
                                .send({text : "comment text"})

                            expect(response.statusCode).to.equal(201);
                            expect(response.body.text).to.equal("comment text");
                            let commentId = response.body.id;

                            // Get the comment
                            response = await request(app)
                                .get("/posts/" + postId + "/comments/" + commentId)
                                .set("x-auth", "test")

                            expect(response.statusCode).to.equal(200);
                            let responseComment = response.body;
                            expect(responseComment.id).to.equal(commentId);
                            expect(responseComment.text).to.equal("comment text");

                            // Update the comment - ok
                            response = await request(app)
                                .patch("/posts/" + postId + "/comments/" + commentId)
                                .set("x-auth", "test")
                                .send({text: "comment text 2"})
                            expect(response.statusCode).to.equal(200);
                            responseComment = response.body;
                            expect(responseComment.id).to.equal(commentId);
                            expect(responseComment.text).to.equal("comment text 2");

                            // Try to update from different user - no ok
                            response = await request(app)
                                .patch("/posts/" + postId + "/comments/" + commentId)
                                .set("x-auth", "test2")
                                .send({text: "comment text 2", createdBy: "test2"})
                            expect(response.statusCode).to.equal(403);

                            // create comment 2 with test user2
                            response = await request(app)
                                .post("/posts/" + postId + "/comments")
                                .set("x-auth", "test2")
                                .send({text : "comment text test user 2"})

                            expect(response.statusCode).to.equal(201);
                            expect(response.body.text).to.equal("comment text test user 2");
                            let comment2Id = response.body.id;

                            // Get all the comment
                            response = await request(app)
                                .get("/posts/" + postId + "/comments")
                                .set("x-auth", "test2")

                            expect(response.statusCode).to.equal(200);
                            let responseComments = response.body;
                            expect(responseComments.length).to.equal(2);

                            // Delete the comment 1
                            response = await request(app)
                                .delete("/posts/" + postId + "/comments/" + commentId)
                                .set("x-auth", "test");
                            expect(response.statusCode).to.equal(204);

                            // Delete the comment 2
                            response = await request(app)
                                .delete("/posts/" + postId + "/comments/" + comment2Id)
                                .set("x-auth", "test2");
                            expect(response.statusCode).to.equal(204);

                            // Delete the post - should succeed
                            response = await request(app)
                                .delete("/posts/" + postId)
                                .set("x-auth", "test")

                            expect(response.statusCode).to.equal(204);
                        });
                });
        });
  });
});

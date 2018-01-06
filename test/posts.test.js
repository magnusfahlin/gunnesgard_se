"use strict";

const app = require("../server"),
  chai = require("chai"),
  request = require("supertest"),
  expect = require("chai").expect;

describe("Post API Integration Tests", function() {
  before(function(done) {
    let post1Id;
    const post1 = {
      title: "2_firstPost",
      text: "text"
    };

    const comment1 = {
      text: "comment1"
    };

    const post2 = {
      title: "1_secondPost",
      text: "text"
    };

    request(app)
      .post("/posts")
      .set("x-auth", "test")
      .send(post1)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        post1Id = res.body.id;

        request(app)
          .post("/posts")
          .set("x-auth", "test")
          .send(post2)
          .end(function(err, res) {
            expect(res.statusCode).to.equal(200);

            request(app)
              .post("/posts/" + post1Id + "/comments")
              .set("x-auth", "test")
              .send(comment1)
              .end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                done();
              });
          });
      });
  });

  describe("Create post when NOT logged in", function() {
    it("should get error", function(done) {
      const post = {
        title: "title",
        text: "text"
      };

      request(app)
        .post("/posts")
        .send(post)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(404);
          done();
        });
    });
  });

  describe("Create post", function() {
    it("should create a post", function(done) {
      const post = {
        title: "3_thirdPost",
        text: "text"
      };

      request(app)
        .post("/posts")
        .set("x-auth", "test")
        .send(post)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          let postResponse = res.body;

          expect(postResponse.title).to.equal("3_thirdPost");
          expect(postResponse.text).to.equal("text");
          expect(postResponse.comments).to.be.an("array");
          done();
        });
    });
  });


  describe("GET posts when NOT logged in", function() {
    it("should get 1 post with no comments", function(done) {
      request(app)
        .get("/posts")
        .end(function(err, res) {
          expect(res.statusCode).equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.have.lengthOf(1);

          let foundPost = false;
          let foundComment = false;
          res.body.forEach(post => {
            if (post.title === "2_firstPost")
            {
              foundPost = true;
              
              if (post.comments)
              foundComment = post.comments[0].title === "comment1";
            }           
          });

          expect(foundPost, "post not found").to.be.true;
          expect(foundComment, "comment should not be present").to.be.false;
          done();
        });
    });
  });

  describe("GET posts", function() {
    it("should get 3 posts with comments", function(done) {
      request(app)
        .get("/posts")
        .set("x-auth", "test")
        .end(function(err, res) {
          expect(res.statusCode).equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.have.lengthOf(3);

          let foundPost = false;
          let foundComment = false;
          res.body.forEach(post => {
            if (post.title === "2_firstPost")
            {
              foundPost = true;

              if (post.comments)
              foundComment = post.comments[0].text === "comment1";
            }           
          });

          expect(foundPost, "post not found").to.be.true;
          expect(foundComment, "comment not found").to.be.true;
          done();
        });
    });

    describe("GET posts with includeEmbeddedDocs = false", function() {
      it("should get 3 posts without comments", function(done) {
        request(app)
          .get("/posts/?includeEmbeddedDocs=false")
          .set("x-auth", "test")
          .end(function(err, res) {
            expect(res.statusCode).equal(200);
            expect(res.body).to.be.an("array");
            expect(res.body).to.have.lengthOf(3);
  
            let foundPost = false;
            let foundComment = false;
            res.body.forEach(post => {
              if (post.title === "2_firstPost")
              {
                foundPost = true;
  
                if (post.comments)
                foundComment = post.comments[0].text === "comment1";
              }           
            });
  
            expect(foundPost, "post not found").to.be.true;
            expect(foundComment, "comment should not be found").to.be.false;
            done();
          });
      });
    });

    describe("GET posts with count argument", function() {
      it("should get 2 posts", function(done) {
        request(app)
          .get("/posts?count=2")
          .set("x-auth", "test")
          .end(function(err, res) {
            expect(res.statusCode).equal(200);
            expect(res.body).to.be.an("array");
            expect(res.body).to.have.lengthOf(2);
            done();
          });
      });
    });

    describe("GET posts with sorting", function() {
      it("should get ascending sorting", function(done) {
        request(app)
          .get("/posts?sort=title&sortOrder=aSc")
          .set("x-auth", "test")
          .end(function(err, res) {
            expect(res.statusCode).equal(200);
            expect(res.body).to.be.an("array");
            expect(res.body).to.have.lengthOf(3);

            expect(res.body[0].title).to.equal("1_secondPost");
            expect(res.body[1].title).to.equal("2_firstPost");
            expect(res.body[2].title).to.equal("3_thirdPost");
            done();
          });
      });

      it("should get descending sorting", function(done) {
        request(app)
          .get("/posts?sort=title&sortOrder=dESc")
          .set("x-auth", "test")
          .end(function(err, res) {
            expect(res.statusCode).equal(200);
            expect(res.body).to.be.an("array");
            expect(res.body).to.have.lengthOf(3);

            expect(res.body[0].title).to.equal("3_thirdPost");
            expect(res.body[1].title).to.equal("2_firstPost");
            expect(res.body[2].title).to.equal("1_secondPost");
            done();
          });
      });
    });
  });
});

"use strict";

const app = require("../server"),
  chai = require("chai"),
  request = require("supertest"),
  expect = require("chai").expect;

describe("Post API Integration Tests", function() {
  describe("GET posts", function() {
    it("should get all posts", function(done) {
      request(app)
        .get("/posts")
        .end(function(err, res) {
          expect(res.statusCode).equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.be.empty;
          done();
        });
    });
  });

  describe("Create post ", function() {
    it("should create a post", function(done) {
      const post = {
        title: "title",
        text: "text"
      };

      request(app)
        .post("/posts")
        .send(post)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          let postResponse = res.body;

          expect(postResponse.title).to.equal("title");
          expect(postResponse.text).to.equal("text");
          expect(postResponse.comments).to.be.an("array");
          done();
        });
    });
  });
});

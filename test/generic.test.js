"use strict";

const app = require("../server"),
  chai = require("chai"),
  request = require("supertest"),
  expect = require("chai").expect,
  assert = require("chai").assert;

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
        .set("x-auth", "test")
        .send(event)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(201);
          let postResponse = res.body;

          expect(postResponse.text).to.equal("event1");
          assert(postResponse.id, "id needs to exist");
          assert(postResponse.createdAt, "createdAt needs to exist");
          assert(postResponse.updatedAt, "updatedAt needs to exist");
          assert.isUndefined(postResponse._id, "_id should not exist");
          assert.isUndefined(postResponse._v, "_v should not exist");
          assert.equal(postResponse.createdBy, "testUser");
          assert.equal(postResponse.updatedBy, "testUser");
          done();
        });
    });
  });
});

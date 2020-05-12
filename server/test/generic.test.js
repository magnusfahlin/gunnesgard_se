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
  });
});

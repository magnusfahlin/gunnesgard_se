"use strict";

require(".././config/config");

const app = require("../server"),
  chai = require("chai"),
  request = require("supertest"),
  expect = require("chai").expect;

describe("User API Integration Tests", function() {

  describe("GET users when NOT logged in", function() {
    it("should get error", function(done) {
      request(app)
        .get("/users")
        .end(function(err, res) {
          expect(res.statusCode).equal(404);
          done();
        });
    });
  });

  describe("GET users", function() {
    it("should get all users", function(done) {
      request(app)
        .get("/users")
        .set('x-auth', "test")
        .end(function(err, res) {
          expect(res.statusCode).equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.be.empty;
          done();
        });
    });
  });

  describe("Create user", function() {
    it("should create a user, password should not be returned", function(done) {
      const user = {
        userName: "name",
        password: "top secret"
      };

      request(app)
        .post("/users")
        .set('x-auth', "test")
        .send(user)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          let postResponse = res.body;

          expect(postResponse.userName).to.equal("name");
          expect(postResponse.password).to.be.undefined;
          done();
        });
    });
  });

  describe("GET and verify user", function() {
    it("should get a user, password should not be returned", function(done) {
      const user = {
        userName: "name2",
        password: "top secret"
      };

      request(app)
        .post("/users")
        .set('x-auth', "test")
        .send(user)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          let postResponse = res.body;

          expect(postResponse.userName).to.equal("name2");
          expect(postResponse.password).to.be.undefined;

          request(app)
            .get("/users/" + postResponse.id)
            .set('x-auth', "test")
            .send(user)
            .end(function(err, res) {
              expect(res.statusCode).to.equal(200);
              let getResponse = res.body;

              expect(getResponse.userName).to.equal("name2");
              expect(getResponse.password).to.be.undefined;
              done();
            });
        });
    });
  });
});

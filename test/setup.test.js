require(".././config/config");


const app = require("../server"),
  chai = require("chai"),
  request = require("supertest"),
  expect = require("chai").expect,
  mongoose = require("mongoose");

before(function(done) {
    mongoose.connection.once("connected", () => {
      mongoose.connection.db.dropDatabase();
      done();
    });
  });

  after(function(done) {
    app.close(() => {
      mongoose.connection.close(done);
    });
  });
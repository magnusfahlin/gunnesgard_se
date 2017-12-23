var mysql = require("mysql");
var MongoClient = require("mongodb").MongoClient;

const dropDb = function(mongoPort, dbName, callback) {
  MongoClient.connect(
    "mongodb://localhost:" + mongoPort + "/" + dbName,
    { native_parser: true },
    function(error, db) {
      var jobs = 0;
      db.db(dbName).dropDatabase(function(err, result) {
        if (error) throw error;
        jobs++;
      });

      var interval = setInterval(function() {
        if (jobs <= 0) {
          clearInterval(interval);
          console.log("Done! Dropped " + dbName);
          db.close();

          if(callback)
            callback();
        }
      }, 300);
    }
  );
};
module.exports = { dropDb };

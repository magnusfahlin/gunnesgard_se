var mysql = require("mysql");
var MongoClient = require("mongodb").MongoClient;

const migrateData = function(
  mongoPort,
  destDbName,
  sourceDbName,
  transformFunc,
  callback
) {
  function getAllSourceCollections(sourceDb, callback) {
    sourceDb.collections(function(err, collections) {
      callback(collections);
    });
  }

  function readAllData(mongoPort, sourceDbName, callback) {
    MongoClient.connect(
      "mongodb://localhost:" + mongoPort + "/" + destDbName,
      { native_parser: true },
      function(error, db) {
        if (error) throw error;
        var jobs = 0;
        var finnishedJobs = 0;
        let itemsToTransform = {};
        let transformedItems = {};
        getAllSourceCollections(db.db(sourceDbName), function(collections) {
          collections.forEach(function(sourceCollection) {
            ++jobs;
            sourceCollection.find(function(err, items) {
              items.toArray(function(err, items) {
                itemsToTransform[sourceCollection.s.name] = items;
                finnishedJobs++;
                jobs--;
              });
            });
          });
        });

        // Waiting for all jobs to complete before closing databases connections.
        var interval = setInterval(function() {
          if (jobs <= 0) {
            clearInterval(interval);
            console.log("Done! Reading " + finnishedJobs + " collections");
            db.close();
            callback(itemsToTransform);
          }
        }, 300);
      }
    );
  }

  function writeAllData(mongoPort, destDbName, data, callback) {
    var collections = data;
    MongoClient.connect(
      "mongodb://localhost:" + mongoPort + "/" + destDbName,
      { native_parser: true },
      function(error, db) {
        if (error) throw error;
        var jobs = 0;
        var finnishedJobs = 0;
        let itemsToTransform = {};
        let transformedItems = {};
        const myAwesomeDB = db.db(destDbName);
        for (var property in collections) {
          ++jobs;

          // if (collections.hasOwnProperty(property)) {
          var newCollection = myAwesomeDB.collection(property);
          console.log(
            "Collection" +
              property +
              " has " +
              collections[property].length +
              " items"
          );
          newCollection.insertMany(collections[property], function(
            error,
            result
          ) {
            if (error) throw error;
            finnishedJobs++;
            --jobs;
          });
          //    }
        }
        // Waiting for all jobs to complete before closing databases connections.
        var interval = setInterval(function() {
          if (jobs <= 0) {
            clearInterval(interval);
            console.log("Done! Writing " + finnishedJobs + " collections");
            db.close();
            callback();
          }
        }, 300);
      }
    );
  }

  readAllData(mongoPort, sourceDbName, function(data) {
    const transformedData = transformFunc(data);
    writeAllData(mongoPort, destDbName, transformedData, callback);
  });
};

module.exports = { migrateData };

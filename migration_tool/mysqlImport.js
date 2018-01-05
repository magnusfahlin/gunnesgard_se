var mysql = require("mysql");
var MongoClient = require("mongodb").MongoClient;

const importMySql = function(destDbName, mongoPort, sourceDbOptions, finalCallback) {


  function getMysqlTables(mysqlConnection, callback) {
    mysqlConnection.query(
      "show full tables where Table_Type = 'BASE TABLE';",
      function(error, results, fields) {
        if (error) {
          callback(error);
        } else {
          var tables = [];
          results.forEach(function(row) {
            for (var key in row) {
              if (row.hasOwnProperty(key)) {
                if (key.startsWith("Tables_in")) {
                  tables.push(row[key]);
                }
              }
            }
          });
          callback(null, tables);
        }
      }
    );
  }

  function tableToCollection(
    mysqlConnection,
    tableName,
    mongoCollection,
    callback
  ) {
    var sql = "SELECT * FROM " + tableName + ";";
    mysqlConnection.query(sql, function(error, results, fields) {
      if (error) {
        callback(error);
      } else {
        if (results.length > 0) {
          mongoCollection.insertMany(results, {}, function(error) {
            if (error) {
              callback(error);
            } else {
              callback(null);
            }
          });
        } else {
          callback(null);
        }
      }
    });
  }

  MongoClient.connect(
    "mongodb://localhost:" + mongoPort + "/" + destDbName,
    { native_parser: true },
    function(error, db) {
      if (error) throw error;

      var MysqlCon = mysql.createConnection(sourceDbOptions);

      var a = MysqlCon.connect();

      var jobs = 0;

      getMysqlTables(MysqlCon, function(error, tables) {
        tables.forEach(function(table) {
          const myAwesomeDB = db.db(destDbName);
          var collection = myAwesomeDB.collection(table);
          ++jobs;
          tableToCollection(MysqlCon, table, collection, function(error) {
            if (error) throw error;
            --jobs;
            if (jobs <= 0) {
              clearInterval(interval);
              console.log("done!");
              db.close();
              MysqlCon.end();
              finalCallback()
            }
          });
        });
      });

      // Waiting for all jobs to complete before closing databases connections.
      var interval = setInterval(function() {
        if (jobs <= 0) {
          clearInterval(interval);
          console.log("done!");
          db.close();
          MysqlCon.end();
        }
      }, 30000);
    }
  );
};

module.exports = { importMySql };
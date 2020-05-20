var Promise = require('bluebird');

var mongoClient = Promise.promisifyAll(require('mongodb')).MongoClient;

function getMongoConnection(connectionString) {
    return mongoClient.connect(connectionString)
        .disposer(function(connection){
            connection.close();
        });
}

module.exports = {
    getMongoConnection
};
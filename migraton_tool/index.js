const Promise = require('bluebird');
const mongodb = require('mongodb');
const mysqlLib = require('./mysqlLib.js');
const transformer = require('./transform.js');
const MongoClient = mongodb.MongoClient;
const Collection = mongodb.Collection;
const Db = mongodb.Db;

Promise.promisifyAll(Collection.prototype);
Promise.promisifyAll(Db.prototype);
Promise.promisifyAll(MongoClient);

const relativePathToAlbums = '../server/static/albums/';
let tempDb = "tempDb";
const mongoPort = 27017;
let connectionStringTempDb = 'mongodb://localhost:' + mongoPort + '/' + tempDb
let destinationDb = "gunnesgard";
let connectionStringDestinationDb = 'mongodb://localhost:' + mongoPort + '/' + destinationDb

function getMongoConnectionAsync(connectionString){
    // process.env.MongoDbUrl stored in my .env file using the require above
    return mongodb.MongoClient.connectAsync(connectionString)
        // .disposer is what handles cleaning up the connection
        .disposer(function(connection){
            connection.close();
        });
}

async function writeToMongo(connectionString, dbName, toBeInsertIntoMongoDb) {
    await Promise.using(
        getMongoConnectionAsync(connectionString),
        async function (db) {
            await Promise.all(Object.keys(toBeInsertIntoMongoDb).map(async (table) => {
                const myAwesomeDB = db.db(dbName);
                let value = toBeInsertIntoMongoDb[table];
                if (value.length == 0) {
                    console.log(table + " was empty!!");
                    return;
                }
                const collection = myAwesomeDB.collection(table);
                await collection.insertManyAsync(value)
            }));
        });
}

async function dropMongoDb(connectionString, dbName) {
    await Promise.using(
        getMongoConnectionAsync(connectionString),
        async function (db) {
            const myAwesomeDB = db.db(dbName);
            await myAwesomeDB.dropDatabaseAsync();
        });
}

async function getTablesFromMySql() {
    var tables = await mysqlLib.querySql("show full tables where Table_Type = 'BASE TABLE';")
        .then(results => {
            var tables = [];
            results.forEach(function (row) {
                for (var key in row) {
                    if (row.hasOwnProperty(key)) {
                        if (key.startsWith("Tables_in")) {
                            tables.push(row[key]);
                        }
                    }
                }
            })
            return tables;
        });

    let toBeInsertIntoMongoDb = {};
    await Promise.all(tables.map(async (tableName) => {
        await mysqlLib.querySql("SELECT * FROM " + tableName + ";")
            .then(result => toBeInsertIntoMongoDb[tableName] = result)
    }));
    return toBeInsertIntoMongoDb;
}

async function readFromTemDb() {
    let readFromTempDb = {};
    await Promise.using(
        getMongoConnectionAsync(connectionStringTempDb),
        async function (db) {
            await db.db(tempDb).collectionsAsync()
                .then(async collections =>
                    await Promise.all(collections.map(async (collection) => {
                        await collection.findAsync({})
                            .then(async (cursor) => {
                                let toArray = await cursor.toArray();
                                readFromTempDb[cursor.namespace.collection] = toArray;
                            })
                    })))
        });
    return readFromTempDb;
}

const migrate = async () => {
    try {
        const toBeInsertIntoMongoDb = await getTablesFromMySql();
        await writeToMongo(connectionStringTempDb, tempDb, toBeInsertIntoMongoDb);
        const readFromTempDb = await readFromTemDb();
        const transformedData = await transformer.transformData(relativePathToAlbums, readFromTempDb)
        await writeToMongo(connectionStringDestinationDb, destinationDb, transformedData);

        console.log("Finnised!");
    } catch (e) {
        console.log("There was an error!!" + e);
    } finally {
        dropMongoDb(connectionStringTempDb, tempDb);
    }


}

let a = migrate();


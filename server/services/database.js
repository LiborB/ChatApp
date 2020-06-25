const { Db } = require("mongodb");

const MongoClient = require("mongodb").MongoClient;
var _db;
function setupDatabase(url, dbName) {
	MongoClient.connect(url, function (err, client) {
		console.log("Connected successfully to server");

		_db = client.db(dbName);
	});
}

/**
 * @return {Db}
 */
function getDb() {
	return _db;
}

const collections = {
	MatchFoundStatistics: "MatchFoundStatistics",
};

module.exports.collections = collections;
module.exports.setupDatabase = setupDatabase;
module.exports.getDb = getDb;

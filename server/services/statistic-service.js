const { collections, getDb } = require("./database");

function insertTopicMatch(topicName, numberToInsert) {
	topicName = topicName.toLowerCase();
	getDb()
		.collection(collections.MatchFoundStatistics)
		.updateOne(
			{ topicName: topicName },
			{
				$inc: {
					count: numberToInsert,
				},
			},
			{ upsert: true },
			(err, result) => {
				if (err) {
					console.log(err);
				} else {
					console.log("Inserted topic: " + topicName);
				}
			}
		);
}

function getTenPopularTopics() {
	const topTen = getDb()
		.collection(collections.MatchFoundStatistics)
		.find()
		.sort({ count: -1 })
		.limit(10)
		.toArray();
	return topTen;
}

module.exports = {
	insertTopicMatch: insertTopicMatch,
	getTenPopularTopics: getTenPopularTopics,
};

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

function getMatchingTopics(searchValue) {
	const matchingTopics = getDb()
		.collection(collections.MatchFoundStatistics)
		.find({
			topicName: {
				$regex: ".*" + searchValue.toLowerCase() + ".*",
			},
		})
		.sort({
			count: -1,
		})
		.toArray();
	return matchingTopics;
}

module.exports = {
	insertTopicMatch: insertTopicMatch,
	getTenPopularTopics: getTenPopularTopics,
	getMatchingTopics: getMatchingTopics,
};

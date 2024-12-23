// Use to manage queue because requiring the client is circular and breaks the code


const queues = new Map();

module.exports = {
	getQueue(guildId) {
		if (!queues.has(guildId)) {
			queues.set(guildId, { songs: [], player: null, connection: null });
		}
		return queues.get(guildId);
	},
	deleteQueue(guildId) {
		if (queues.has(guildId)) {
			queues.delete(guildId);
		}
	},
	hasQueue(guildId) {
		return queues.has(guildId);
	},
};
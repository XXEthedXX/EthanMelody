// Return song currently playing
// Return songs up next in a list

// const client = require('../../src/index.js');
const { SlashCommandBuilder } = require('discord.js');
const queueManager = require('../../src/queueManager');
// Adjust path to index.js ???

module.exports = {
	data: new SlashCommandBuilder()
		.setName('equeue')
		.setDescription('Show what is in the queue'),
	async execute(interaction) {
		const guildID = interaction.guild.id;

		// Check if a queue exists for the guild
		if (!queueManager.hasQueue(guildID) || queueManager.getQueue(guildID).songs.length === 0) {
			return interaction.reply('The queue is currently empty.');
		}

		const guildQueue = queueManager.getQueue(guildID);
		const nowPlaying = guildQueue.songs[0];
		const upNext = guildQueue.songs.slice(1);

		let response = `🎶 **Now Playing:**\n**${nowPlaying.title}** by ${nowPlaying.artist}\n\n`;

		if (upNext.length > 0) {
			response += '📋 **Up Next:**\n';
			upNext.forEach((song, index) => {
				response += `${index + 1}. **${song.title}** by ${song.artist}\n`;
			});
		} else {
			response += '🚫 **No more songs in the queue.**';
		}

		return interaction.reply(response);
	},
};
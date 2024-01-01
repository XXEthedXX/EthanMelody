// if queue is not started, start queue
// add song to queue
// while queue is not empty, play song once song is finished
// const optionData = JSON.stringify(interaction.options.get('search-or-link').value);
// Todo: Create audio player
// Todo: Use (yt-search) to find song link or search YT and add song to queue
// take user input, then input as variable into yt-search and find list of likely songs and their length
// allow user to click discord button to select song (and throw into queue, or play if queue is empty)
// Todo: Use (ytdl-core) to "download" and stream song through bot
// Todo: Continue playing through queue until out of songs

const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnections } = require('@discordjs/voice');
const ytsearch = require('yt-search');
const ytdl = require('ytdl-core');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eplay')
		.setDescription('Play a song by entering a link or search')
		.addStringOption(option =>
			option.setName('search-or-link')
				.setDescription('Paste link or search up a song')
				.setRequired(true)),
	async execute(interaction) {
		// figure out current voice channel
		const currVoiceChannel = interaction.member.voice.channel;

		// if voicechannel is empty, reply join voice channel, end command
		if (!currVoiceChannel) {
			return interaction.reply('You\'re not in a voice channel bud...');
		}

		// create a queue to hold songs
		let queue = [];

		try {
			// take user search/link
			let searchterm = interaction.options.get('search-or-link').value;
			// search using yt-search
			let searchresults = await ytsearch(searchterm);
			console.log('This is the searchterm: ' + searchterm);
			console.log('"searchresults are below....."');
			console.log(searchresults);
			await interaction.reply(`You searched: ${searchterm}.`);
		}
		catch (error) {
			await interaction.reply(`Something fucked up`);
		}
	},
};
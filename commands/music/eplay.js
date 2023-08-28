// if queue is not started, start queue
// add song to queue
// while queue is not empty, play song once song is finished
// const optionData = JSON.stringify(interaction.options.get('search-or-link').value);
// Todo: Create audio player
// Todo: Use (yt-search) to find song link or search YT and add song to queue
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

		// take user search/link
		let searchterm = interaction.options.get(`search-or-link`).value;
		ytsearch.
	},
};
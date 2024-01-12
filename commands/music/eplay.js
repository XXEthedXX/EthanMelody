// if queue is not started, start queue
// add song to queue
// while queue is not empty, play song once song is finished
// const optionData = JSON.stringify(interaction.options.get('search-or-link').value);
// Todo: Create audio player
// Todo: Use (yt-search) to find song link or search YT and add song to queue
// if link matches link in top 5 results, auto play song
// take user input, then input as variable into yt-search and find list of likely songs and their length
// allow user to click discord button to select song (and throw into queue, or play if queue is empty)
// Todo: Use (ytdl-core) to "download" and stream song through bot
// Todo: Continue playing through queue until out of songs

const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
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
				.setRequired(true),
		),
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
			let searchterm = interaction.options.get('search-or-link')?.value;

			// search using yt-search
			let searchresults = await ytsearch(searchterm);
			console.log('This is the searchterm: ' + searchterm);

			// find five video 'all' results and save them to variable
			let fivevideosearchresults = [];
			let iteration = 0;
			for (let current of searchresults.all) {
				// If five videos found, exit loop
				if (iteration === 5) {
					break;
				}
				// if the current part of the all is a video, then add to the FVSR
				if (current.type === 'video') {
					fivevideosearchresults.push(current);
					iteration += 1;
				}
			}
			console.log('Five videos were found: ');
			console.log(fivevideosearchresults);

			// let fivesearchresults = searchresults.all.slice(0, 5);
			// console.log('"use searchresults to understand how the object works....."');
			// console.log(fivesearchresults[0]);

			// create a select menu to show to users
			const songSelect = new StringSelectMenuBuilder()
				.setCustomId('songsfromytsearch')
				.setPlaceholder('Pick something...')
				.addOptions(
					new StringSelectMenuOptionBuilder()
						.setLabel(fivevideosearchresults[0].title)
						.setDescription(fivevideosearchresults[0].timestamp + ' || ' + fivevideosearchresults[0].author.name)
						.setValue('Result0'),
					new StringSelectMenuOptionBuilder()
						.setLabel(fivevideosearchresults[1].title)
						.setDescription(fivevideosearchresults[1].timestamp + ' || ' + fivevideosearchresults[1].author.name)
						.setValue('Result1'),
					new StringSelectMenuOptionBuilder()
						.setLabel(fivevideosearchresults[2].title)
						.setDescription(fivevideosearchresults[2].timestamp + ' || ' + fivevideosearchresults[2].author.name)
						.setValue('Result2'),
					new StringSelectMenuOptionBuilder()
						.setLabel(fivevideosearchresults[3].title)
						.setDescription(fivevideosearchresults[3].timestamp + ' || ' + fivevideosearchresults[3].author.name)
						.setValue('Result3'),
					new StringSelectMenuOptionBuilder()
						.setLabel(fivevideosearchresults[4].title)
						.setDescription(fivevideosearchresults[4].timestamp + ' || ' + fivevideosearchresults[4].author.name)
						.setValue('Result4'),
				);

			// create action row to show to user
			const actionRow = new ActionRowBuilder()
				.addComponents(songSelect);
			console.log('I\'ve created the actionRow and added songSelect as a component');

			await interaction.reply({
				content: 'Which video are you talking about?',
				components: [actionRow],
			});
		}
		catch (error) {
			await interaction.reply('Something fucked up, more specifically: ' + error);
			console.log(error);
		}
	},
};
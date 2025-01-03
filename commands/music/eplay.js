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
// installed ffmpeg-static, libsodium-wrappers
// Youtube dropping ban hammer on ytdl by 403'ing requests??
// fix using this https://stackoverflow.com/questions/78743288/403-forbidden-when-using-ytdl-core
// Doesn't play links properly??

const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnections, createAudioPlayer, createAudioResource, entersState, AudioPlayerStatus, StreamType } = require('@discordjs/voice');
const ytsearch = require('yt-search');
const ytdl = require('@distube/ytdl-core');

const queueManager = require('../../src/queueManager');
// const client = require('../../src/index.js');
// should point to index.js
// const { queues } = require('../../src/index.js');

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

		// create a queue if server doesnt have one already
		const guildID = interaction.guild.id;

		if (!queueManager.hasQueue(guildID)) {
			// client.queues.set(guildID, { songs: [], player: null, connection: null });
			// TODO: chat what was I trying to do here
		}

		// get guilds queue
		const guildQ = queueManager.getQueue(guildID);

		// function to push requested song into queue
		async function addQueue(songURL) {
			// when "eplay", takes their songURL in and plays once now playing is empty
			const songInfo = await ytdl.getInfo(songURL);
			// create an object for the "song" and then send it into queue
			const song = {
				title: songInfo.videoDetails.title,
				link: songInfo.videoDetails.video_url,
				length: songInfo.videoDetails.lengthSeconds,
				artist: songInfo.videoDetails.author.name,
			};

			guildQ.songs.push(song);

			// start playing only if first song in queue
			if (guildQ.songs.length === 1) {
				if (!guildQ.connection) {
					guildQ.connection = joinVoiceChannel({
						channelId: currVoiceChannel.id,
						guildId: currVoiceChannel.guild.id,
						adapterCreator: currVoiceChannel.guild.voiceAdapterCreator,
					});
				}

				if (!guildQ.player) {
					guildQ.player = createAudioPlayer();
					guildQ.connection.subscribe(guildQ.player);

					guildQ.player.on(AudioPlayerStatus.Idle, () => {
						guildQ.songs.shift();
						if (guildQ.songs.length > 0) {
							playNext();
						}
						else {
							guildQ.connection.destroy();
							queueManager.deleteQueue(guildID);
						}
					});

					guildQ.player.on('error', (error) => {
						console.error('Error:', error.message);
					});
				}

				// play next song
				playNext();
			}
		}

		async function playNext() {
			// try grabbing first song if exists
			const nextSong = guildQ.songs[0];
			if (!nextSong) { return; }

			// try creating a connection to the voice channel
			try {
				const stream = ytdl(nextSong.link, { filter: 'audioonly' });
				console.log('stream created (made of ytdl song.link and "audioonly" filter 1/4');
				const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
				console.log('resource created 2/4');
				guildQ.player.play(resource);
				console.log('connecting to player, and passed in resource 3/4');
				console.log(`Now playing: ${nextSong.link.name}, requested by TBD`);

				// update user & discord add length eventually
				await interaction.channel.send({
					content: `🎶 **Now Playing:**\n**${nextSong.title}** by **${nextSong.artist}**\nLength: ${nextSong.length}`,
				});

				guildQ.player.on('stateChange', (oldState, newState) => {
					console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
				});

			} catch (e) {
				console.log(`Error while attempting to play: ${nextSong.link.name}`);
				guildQ.songs.shift();
				nextSong();
			}

		}


		try {
			// take user search/link
			let searchterm = interaction.options.get('search-or-link')?.value;

			// search using yt-search
			let searchresults = await ytsearch(searchterm);
			console.log('This is the searchterm: ' + searchterm);

			// find five video 'all' results and save them to variable
			let fivevideosearchresults = []; // FVSR
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

			const userResponse = await interaction.reply({
				content: 'Which video are you talking about?',
				components: [actionRow],
			});
			// ensures only the interaction creator can use the string select menu
			const collectorFilter = i => i.user.id === interaction.user.id;

			try {
				const waitForUserClick = await userResponse.awaitMessageComponent({ filter: collectorFilter, time: 15_000 });

				waitForUserClick.update(
					{ content: `Adding to the queue: **${waitForUserClick.values[0]}**.`, components: [] });
				console.log('WaitForUserClick Things: ');
				console.log(waitForUserClick);
				// Figure out which button they clicked (resultX), check customId of user click

				switch (waitForUserClick.values[0]) {
				case 'Result0':
					await addQueue(fivevideosearchresults[0].url);
					break;
				case 'Result1':
					await addQueue(fivevideosearchresults[1].url);
					break;
				case 'Result2':
					await addQueue(fivevideosearchresults[2].url);
					break;
				case 'Result3':
					await addQueue(fivevideosearchresults[3].url);
					break;
				case 'Result4':
					await addQueue(fivevideosearchresults[4].url);
					break;
				default:
					console.log('SWITCH STATEMENT IS COOKED!!! VERY BAD!!!');
					// adds songs to queue
				}

			} catch (e) {
				await interaction.editReply({ content: 'Connection timed out after 15 seconds', components: [] });
			}
		}
		catch (error) {
			await interaction.reply(error);
			console.log(error);
		}
	},
};
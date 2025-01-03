const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnections, createAudioResource, StreamType } = require('@discordjs/voice');
const queueManager = require('../../src/queueManager');
const ytdl = require('@distube/ytdl-core');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eskip')
		.setDescription('Bot will skip the current song'),
	async execute(interaction) {
		// figure out current voice channel
		const currVoiceChannel = interaction.member.voice.channel;

		// if voicechannel is empty, reply join voice channel, end command
		if (!currVoiceChannel) {
			return interaction.reply('Please join a voice channel.');
		}

		const guildID = interaction.guild.id;

		// get queue from guild
		const meQ = queueManager.getQueue(guildID);

		if (!meQ.player || !meQ || meQ.songs.length === 0) {
			return interaction.reply('Nothing is playing currently.');
		}

		// play next function
		async function playNext() {
			// try grabbing first song if exists
			const nextSong = meQ.songs[0];
			if (!nextSong) {
				meQ.connection.destroy();
				queueManager.deleteQueue(guildID);
				return interaction.channel.send('Stopped playback. Queue is empty.');
			}

			// try creating a connection to the voice channel
			try {
				const stream = ytdl(nextSong.link, { filter: 'audioonly' });
				const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
				meQ.player.play(resource);
				await interaction.channel.send({
					content: `🎶 **Now Playing:**\n**${nextSong.title}**`,
				});
			} catch (error) {
				console.error('Error playing the next song:', error);
				meQ.songs.shift(); // Remove problematic song
				await playNext(); // Attempt next
			}
		}
		// end play next function

		// skip to next song on queue
		try {
			// shift to next song
			meQ.songs.shift();

			if (meQ.songs.length > 0) {
				await interaction.reply(`⏭️ Skipping to the next song: **${meQ.songs[0].title}**`);
				await playNext();
			} else {
				meQ.player.stop();
				meQ.connection.destroy();
				queueManager.deleteQueue(guildID);
				await interaction.reply('⏹️ No more songs in the queue. Playback stopped.');
			}
		} catch (error) {
			console.error('Error while skipping song:', error);
			await interaction.reply('Shoot... An error occurred while trying to skip the song.');
		}
	},
};
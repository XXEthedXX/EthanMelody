// Todo: ejoin makes bot join user when called
// Todo: if already in call, reply to user-only, already in call

const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnections } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ejoin')
		.setDescription('Bot will join your current voice.'),
	async execute(interaction) {
		// figure out current voice channel
		const currVoiceChannel = interaction.member.voice.channel;

		// if voicechannel is empty, reply join voice channel, end command
		if (!currVoiceChannel) {
			return interaction.reply('Please join a voice channel.');
		} else {
			console.log('Current VC: ', currVoiceChannel.id);
		}

		// try joining voice channel, or catch the error, end command
		try {
			const connection = joinVoiceChannel({
				channelId: currVoiceChannel.id,
				guildId: currVoiceChannel.guild.id,
				adapterCreator: currVoiceChannel.guild.voiceAdapterCreator,
				selfDeaf: false,
				selfMute: false,
			});

			console.log(getVoiceConnections());
			await interaction.reply(`Joined: ${currVoiceChannel.name}.`);

		}
		catch (error) {
			console.log(error);
			await interaction.reply('Could not join voice channel.');
		}

		// if called when already in a voice channel, reply already in call, end command

	},
};
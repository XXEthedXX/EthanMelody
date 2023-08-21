// Todo: ejoin makes bot join user when called
// Todo: if already in call, reply to user-only, already in call

/* const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ejoin')
		.setDescription('Bot will join your current voice.'),
	async execute(interaction) {
		// figure out current voice channel
		const currVoiceChannel = interaction.member.voice.channel;

		// if voicechannel is empty, reply join voice channel, end command
		if (!currVoiceChannel) {
			return interaction.reply("Please join a voice channel.");
		}

		// try joining voice channel, or catch the error, end command
		try {
			const connection = joinVoiceChannel({
				channelId: voiceChannel.id,
				guildId: interaction.guild.id,
				adapterCreator: interaction.guild.voiceAdapterCreator,
			});

			await interaction.reply(`Joined: ${voiceChannel.name}.`);

		} catch (error) {
			console.log(error);
			await interaction.reply("Could not join voice channel.");
		}

		// if called when already in a voice channel, reply already in call, end command

	},
};*/
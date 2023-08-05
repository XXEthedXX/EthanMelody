// Todo: ejoin makes bot join user when called
// Todo: if already in call, reply to user-only, already in call

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ejoin')
        .setDescription('Bot will join your current voice.'),
    async execute(interaction) {
        // figure out current voice channel
        const currVoiceChannel = interaction.member.voice.channel;

        if (!currVoiceChannel) { // if not in a voice channel, ask user to join
            return interaction.reply("Please join a voice channel.");
        }

        try { // joining the voice channel
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

    }
}
const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('estringselecttest')
		.setDescription('Play a song by entering a link or search')
		.addStringOption(option =>
			option.setName('search-or-link')
				.setDescription('Paste link or search up a song')
				.setRequired(true),
		),
	async execute(interaction) {
		const select = new StringSelectMenuBuilder()
			.setCustomId('starter')
			.setPlaceholder('Make a selection!')
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('Bulbasaur')
					.setDescription('The dual-type Grass/Poison Seed Pokémon.')
					.setValue('bulbasaur'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Charmander')
					.setDescription('The Fire-type Lizard Pokémon.')
					.setValue('charmander'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Squirtle')
					.setDescription('The Water-type Tiny Turtle Pokémon.')
					.setValue('squirtle'),
			);
		const actionRow = new ActionRowBuilder()
			.addComponents(select);
		console.log('I\'ve created the actionRow and added select as a component');

		await interaction.reply({
			content: 'Choose your starter!',
			components: [actionRow],
		});
	},
};
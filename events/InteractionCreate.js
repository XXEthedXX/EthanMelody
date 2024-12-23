const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);
		console.log('interaction.client: ');
		console.log(interaction.client);
		console.log('interaction.client.commands: ');
		console.log(interaction.client.commands);
		console.log('command: ');
		console.log(command);
		console.log('interaction.commandName: ');
		console.log(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		}
		catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
	},
};
// Ethan B - 8/3/2023
// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('../config.json');
console.log('line 7: ');

// Create a new client instance / initialize commands collection
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
// changed absolute path to relative path
console.log('line 14: ');
const foldersPath = path.join(__dirname, '..', 'commands');
console.log('foldersPath: ', foldersPath);
const commandFolders = fs.readdirSync(foldersPath);

// dynamically retrtieve your command files
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// create a listener for client#event:interactionCreate event that runs when code gets and interaction
client.on(Events.InteractionCreate, interaction => {
	console.log(interaction);
});

// not every interaction is a slash command, handle MessageComponent interactions
// find matching commands from client.commands
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commmands.get(interaction.commandName);

	if (!command) {
		console.error('No command matching ${interaction.commandName} was found.');
		return;
	}

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		}
		else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// When client is ready, run once
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord
client.login(token);
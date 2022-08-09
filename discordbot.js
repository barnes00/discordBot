// Initialize dotenv
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
// Discord.js versions ^13.0 require us to explicitly define client intents
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
});

//Read Messages
client.on('interactionCreate', async interaction => {
    console.log(interaction.commandName);
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.on('messageCreate', async msg => {
    if (msg.author.bot) return;
    //console.log(msg);
    
    const command = client.commands.get('pong');
    if (!command) return;
    
    try {
        console.log(command.execute('pong').content);
        await command.execute('pong');
    } catch (error) {
        console.error(error);
        await msg.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// Log In our bot
client.login(process.env.TOKEN);
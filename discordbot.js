// Initialize dotenv
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
// Discord.js versions ^13.0 require us to explicitly define client intents
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

let botPrefix = 'Rb';

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
});

//Read Messages
client.on('messageCreate', async msg => {
    if (msg.author.bot) return;
    
    //check if message starts with bot prefix 
    const msgArray = msg.content.split(" ");
    if (!(msgArray[0].toUpperCase() === botPrefix.toUpperCase())) return;
    
    //check for valid command
    if (msgArray.length < 2) return;
    const command = client.commands.get(msgArray[1]);
    if (!command) return;

    //execute command
    try {
        await command.execute(msgArray, msg.channel);
    } catch (error) {
        console.error(error);
        await msg.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// Log In our bot
client.login(process.env.TOKEN);
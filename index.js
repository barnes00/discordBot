// Initialize dotenv
require('dotenv').config();
const { Client, Discord, Collection, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
})

let bot = {
    client,
    prefix: "rb",
    owners: ["358818065863147521"]
}

client.commands = new Collection();
client.events = new Collection();

//load event/commands and handlers
client.loadEvents = (bot,reload) => require("./handlers/events")(bot, reload);
client.loadCommands = (bot, reload) => require("./handlers/commands")(bot, reload);

client.loadEvents(bot,false);
client.loadCommands(bot, false);

module.exports = bot

// Log in the bot
client.login(process.env.TOKEN);

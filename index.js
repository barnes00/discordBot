// Initialize dotenv
require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { Player } = require("discord-music-player");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
})

let bot = {
    client,
    prefix: "rb",
    owners: [process.env.OWNER_ID]
}

client.commands = new Collection();
client.events = new Collection();
client.aliases = new Collection();

//load event/commands and handlers
client.loadEvents = (bot,reload) => require("./handlers/events")(bot, reload);
client.loadCommands = (bot, reload) => require("./handlers/commands")(bot, reload);

client.loadEvents(bot,false);
client.loadCommands(bot, false);

//initialize music player
const player = new Player(client, {
    leaveOnEmpty: false, 
    leaveOnEnd: false,
    deafenOnJoin: true,
});

client.player = player;

module.exports = bot;

// Log in the bot
client.login(process.env.TOKEN);

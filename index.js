// Initialize dotenv
require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');



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
client.loadEvents = (bot, reload) => require("./handlers/events")(bot, reload);
client.loadCommands = (bot, reload) => require("./handlers/commands")(bot, reload);

client.loadEvents(bot, false);
client.loadCommands(bot, false);

//initialize music player
const { returnPlayer } = require('./handlers/player');
client.player = returnPlayer(client);

//initialize db connection
const { initDatabase } = require('./handlers/database');
client.dbClient = initDatabase();

//load reminders
const { loadReminders } = require('./handlers/reminders');
//loadReminders(client);

module.exports = bot;

// Log in the bot
client.login(process.env.TOKEN);

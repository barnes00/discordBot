// Initialize dotenv
require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { Player } = require("discord-music-player");
const pg = require('pg')

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

//initialize db connection
const dbClient = new pg.Client({
    host: 'localhost',
    port: 5432,
    database: 'test',
    user: 'postgres',
    password: process.env.DB_USER_PW,
  })

dbClient.connect((err) => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    client.dbClient = dbClient;
    console.log('Database connected')
  }
})

module.exports = bot;

// Log in the bot
client.login(process.env.TOKEN);

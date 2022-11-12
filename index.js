// Initialize dotenv
require('dotenv').config();
const { Client, Discord, Collection, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ]
})


let bot = {
    client,
    prefix: "Rb",
    owners: ["358818065863147521"]
}

client.commands = new Collection();
client.events = new Collection();
client.loadEvents = (bot,reload) => require("./handlers/events")(bot, reload);

client.loadEvents(bot,false);

module.exports = bot;


/*client.once('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
});

Read Messages
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
*/
// Log In our bot
client.login(process.env.TOKEN);

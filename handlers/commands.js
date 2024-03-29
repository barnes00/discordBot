const { getFiles } = require("../functions/other");
const fs = require("fs");

module.exports = (bot, reload) => {
    const { client } = bot;

    fs.readdirSync("./commands/").forEach((category) => {
        let commands = getFiles(`./commands/${category}`, ".js");

        commands.forEach((f) => {
            if (reload) {
                delete require.cache[require.resolve(`../commands/${category}/${f}`)];
            }
            const command = require(`../commands/${category}/${f}`)
            client.commands.set(command.name, command)
            
            if (command.aliases.length > 0) {
                for (const alias of command.aliases) {
                    client.aliases.set(alias, command.name)
                }
            }
        })
    })
    console.log(`Loaded ${client.commands.size} commands`)
    console.log(`Loaded ${client.aliases.size} aliases`)
}
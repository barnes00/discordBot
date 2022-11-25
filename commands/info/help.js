const fs = require("fs");
const { getFiles } = require("../../util/functions");
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "help",
    category: "info",
    description: "Display a help menu",
    syntax: "",
    permissions: [],
    devOnly: false,
    aliases: [],
    run: async ({ client, message, args }) => {
        console.log("help");

        const helpEmbed = new EmbedBuilder()
            .setColor(0x70d9ee)
            .setTitle('My Commands')
            .setURL('https://github.com/barnes00/discordBot')
            .setAuthor({ name: 'Robean', iconURL: 'https://i.imgur.com/BWdqBKG.png', url: 'https://discord.js.org' })
            .setDescription('My prefix is rb \nType `commandName help` for more details about each command')
            .setThumbnail('https://i.imgur.com/BWdqBKG.png')

        fs.readdirSync("./commands/").forEach((category) => {
            if (category !== "dev") {
                commands = getFiles(`./commands/${category}`, ".js");
                commandStr = commands.join(", ");
                commandStr = commandStr.replaceAll(/.js/g, "");
                helpEmbed.addFields({ name: `${category}`, value: commandStr })

            }
        })


        message.channel.send({ embeds: [helpEmbed] });

    }
}
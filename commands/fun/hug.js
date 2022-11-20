const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');
const { getGuildUserID } = require("../../util/functions");

module.exports = {
    name: "hug",
    category: "fun",
    description: "Sends a hug gif",
    syntax: "rb hug user",
    permissions: [],
    devOnly: false,
    aliases: [],
    run: async ({ client, message, args }) => {
        console.log("hug");

        let num = 0;
        let user;
        if (message.mentions.users.size > 0) {
            user = await message.guild.members.fetch(getGuildUserID(args[0]))
        }
        else {
            user = await message.guild.members.fetch({ query: args[0] })
            user = user.at(0)
        }
        if (user === undefined) {
            return message.channel.send("Error: cannot find user")
        }
        const descTxt = `<@${message.author.id}> hugs <@${user.user.id}>`
        const footerTxt = `That's ${num} hugs now!`

        res = await fetch('https://nekos.life/api/v2/img/hug').then(res => res.json());

        const Embed = new EmbedBuilder()
            .setColor(0x70d9ee)
            .setTitle("You gave a hug!")
            .setDescription(descTxt)
            .setImage(res.url)
            .setFooter({ text: footerTxt });

        message.channel.send({ embeds: [Embed] });
    }
}
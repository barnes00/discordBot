const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');
const { getGuildUserID } = require("../../util/functions");

module.exports = {
    name: "poke",
    category: "fun",
    description: "Sends a poke gif",
    syntax: "rb poke user",
    permissions: [],
    devOnly: false,
    aliases: [],
    run: async ({ client, message, args }) => {
        console.log("poke");

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
        const descTxt = `Hey <@${user.user.id}>, ${message.author.username} wants your attention!`
        const footerTxt = `That's ${num} pokes now!`

        res = await fetch('https://nekos.best/api/v2/poke/').then(res => res.json());

        const Embed = new EmbedBuilder()
            .setColor(0x70d9ee)
            .setTitle("You gave a poke!")
            .setImage(res.results[0].url)
            .setFooter({ text: footerTxt });

        message.channel.send(descTxt)
        message.channel.send({ embeds: [Embed] });
    }
}
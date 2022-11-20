const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "hug",
    category: "fun",
    description: "Sends a hug gif",
    syntax: "rb hug",
    permissions: [],
    devOnly: false,
    aliases: [],
    run: async ({ client, message, args }) => {
        console.log("hug");
    
        const footerTxt = message.author.username + " gave you a hug"
        res = await fetch('https://nekos.life/api/v2/img/hug').then(res => res.json());
        
        const Embed = new EmbedBuilder()
            .setColor(0x70d9ee)
            .setImage(res.url)
            .setFooter({ text: footerTxt });

        message.channel.send({ embeds: [Embed] });
    }
}
const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "poke",
    category: "fun",
    description: "Sends a poke gif",
    syntax: "rb poke @user",
    permissions: [],
    devOnly: false,
    run: async({client, message, args}) => {
        console.log("poke");

        const footerTxt = message.author.username + " gave you a poke"
        const res = await fetch('https://nekos.best/api/v2/poke/').then(res => res.json())
        const Embed = new EmbedBuilder()
	        .setColor(0x70d9ee)
	        .setImage(res.results[0].url)
	        .setFooter({ text: footerTxt });    

        message.channel.send({ embeds: [Embed] });     
    }
}
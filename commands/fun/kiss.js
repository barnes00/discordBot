const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "kiss",
    category: "fun",
    description: "Sends a kiss gif",
    syntax: "rb kiss @user",
    permissions: [],
    devOnly: false,
    run: async({client, message, args}) => {
        console.log("kiss");

        const footerTxt = message.author.username + " gave you a kiss"
        const res = await fetch('https://nekos.life/api/v2/img/kiss').then(res => res.json())
        const exampleEmbed = new EmbedBuilder()
	        .setColor(0x70d9ee)
	        .setImage(res.url)
	        .setFooter({ text: footerTxt });    
        
        message.channel.send({ embeds: [exampleEmbed] });     
    }
}
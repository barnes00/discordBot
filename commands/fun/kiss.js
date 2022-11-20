const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "kiss",
    category: "fun",
    description: "Sends a kiss gif",
    syntax: "rb kiss",
    permissions: [],
    devOnly: false,
    aliases: [],
    run: async({client, message, args}) => {
        console.log("kiss");

        const footerTxt = message.author.username + " gave you a kiss"
        try{
            const res = await fetch('https://nekos.life/api/v2/img/kiss').then(res => res.json());
        }
        catch(err){
            console.log(err);
            return message.channel.send("There was an error executing that command");

        }
        
        const Embed = new EmbedBuilder()
	        .setColor(0x70d9ee)
	        .setImage(res.url)
	        .setFooter({ text: footerTxt });    
        
        message.channel.send({ embeds: [Embed] });     
    }
}
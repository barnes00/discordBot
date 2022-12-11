const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "cat",
    category: "fun",
    description: "Sends a random cat",
    syntax: "rb cat",
    permissions: [],
    devOnly: false,
    aliases: [],
    run: async ({ client, message, args }) => {
        console.log("cat");

        try{ //get cat from api
            var res = await fetch('https://cataas.com/cat?json=true').then(res => res.json());
        }
        catch(err){
            console.log(err);
            return message.channel.send("Error: could not get cat");
        }
        
        const Embed = new EmbedBuilder()
            .setColor(0x70d9ee)
            .setTitle("Meow!")
            .setImage(`https://cataas.com${res.url}`)

        message.channel.send({ embeds: [Embed] });
    }
}
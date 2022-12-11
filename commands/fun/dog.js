const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "dog",
    category: "fun",
    description: "Sends a random dog",
    syntax: "rb dog",
    permissions: [],
    devOnly: false,
    aliases: [],
    run: async ({ client, message, args }) => {
        console.log("cat");

        try{ //get cat from api
            var res = await fetch('https://dog.ceo/api/breeds/image/random').then(res => res.json());
        }
        catch(err){
            console.log(err);
            return message.channel.send("Error: could not get dog");
        }
        
        const Embed = new EmbedBuilder()
            .setColor(0x70d9ee)
            .setTitle("Woof!")
            .setImage(res.message)

        message.channel.send({ embeds: [Embed] });
    }
}
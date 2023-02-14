const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');
const { getGuildUserID } = require("../../functions/other");

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

        let user; //get user from message
        if (message.mentions.users.size > 0) {
            user = await message.guild.members.fetch(getGuildUserID(args[0]))
        }
        else if(args.length > 0){
            user = await message.guild.members.fetch({ query: args[0] })
            user = user.at(0)
        }
        else{
            return message.channel.send("Please enter a user to poke")
        }
        
        if (user === undefined) {
            return message.channel.send("Error: cannot find user")
        }

        const descTxt = `Hey <@${user.user.id}>, ${message.author.username} wants your attention!`
        
        try{ //get gif from api
            var res = await fetch('https://nekos.best/api/v2/poke/').then(res => res.json());
        }
        catch(err){
            console.log(err);
            return message.channel.send("Error: could not get poke gif");
        }
        
        const Embed = new EmbedBuilder()
            .setColor(0x70d9ee)
            .setTitle("You gave a poke!")
            .setImage(res.results[0].url)

        message.channel.send(descTxt)
        message.channel.send({ embeds: [Embed] });
    }
}
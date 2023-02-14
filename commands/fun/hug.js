const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');
const { getGuildUserID } = require("../../functions/other");
const { incrementActionCounter } = require('../../functions/action');

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

        let receiver; //get user from message
        if (message.mentions.users.size > 0) {
            receiver = await message.guild.members.fetch(getGuildUserID(args[0]))
        }
        else if(args.length > 0){
            receiver = await message.guild.members.fetch({ query: args[0] })
            receiver = receiver.at(0)
        }
        else{
            return message.channel.send("Please enter a user to hug")
        }

        if (receiver === undefined) {
            return message.channel.send("Error: cannot find user")
        }

        const descTxt = `<@${message.author.id}> hugs <@${receiver.user.id}>`

        let count = await incrementActionCounter(client, 'hug', BigInt(message.author.id), BigInt(receiver.user.id));

        let footerTxt;
        if(count === 1){
            footerTxt = `That's your first hug!`
        }
        else{
            footerTxt = `That's ${count} hugs now!`
        }

        try{ //get gif from api
            var res = await fetch('https://nekos.life/api/v2/img/hug').then(res => res.json());
        }
        catch(err){
            console.log(err);
            return message.channel.send("Error: could not get hug gif");
        }
        
        const Embed = new EmbedBuilder()
            .setColor(0x70d9ee)
            .setTitle("You gave a hug!")
            .setDescription(descTxt)
            .setImage(res.url)
            .setFooter({ text: footerTxt });

        message.channel.send({ embeds: [Embed] });
    }
}
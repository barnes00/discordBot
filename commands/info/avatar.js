const { getGuildUserID } = require("../../functions/other");
const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: "avatar",
    category: "info",
    description: "Shows a user's profile picture as a downloadable image",
    syntax: "rb avatar (username)",
    permissions: [],
    devOnly: false,
    aliases: ["pfp"],
    run: async({client, message, args}) => {
        console.log("avatar");
        
        let user;
        if(args.length === 0){
            user = message.author;
        }
        else if (message.mentions.users.size > 0) {
            user = message.mentions.users.at(0)
        }
        else if(args.length > 0){
            user = await message.guild.members.fetch({ query: args.join(" ") })
            if(user.size === 0){
                return message.channel.send("Error: unable to find user")
            }
            else{
                user = user.at(0).user
            }
            
        }

        if(user === undefined){
            return message.channel.send("Error: unable to find user")
        }

        let avatarURL = user.displayAvatarURL()
        avatarURL = avatarURL.replace(".webp", ".png?size=1024");
        
        const Embed = new EmbedBuilder()
	        .setColor(0x70d9ee)
	        .setTitle(user.tag)
	        .setURL(avatarURL)
	        .setImage(avatarURL)
	    
        message.channel.send({ embeds: [Embed] });
        
    }
}
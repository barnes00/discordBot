const { PermissionFlagsBits } = require("discord.js");
const { textToTime , getGuildUserID } = require("../../util/functions");

module.exports = {
    name: "ban",
    category: "moderation",
    description: "Ban a member. Optional: delete recent messages from the user up to 7 days",
    syntax: "Usage: rb ban @user (# minutes/hours/days) (reason)",
    permissions: [PermissionFlagsBits.ManageGuild],
    devOnly: false,
    run : async ({client, message, args}) => {
        console.log("ban");

        //get duration of message deletion
        if(args.length < 1){ //invalid input 
            return message.channel.send("Invalid input. Ban failed");
        }
        if(args.length > 1){ //duration input
            if(isNaN(Number(args[1])) || args.length < 2){
                return message.channel.send("Invalid input. Ban failed");
            }
            duration = textToTime(args[1], args[2]);
            if (duration > (7 * 86400000)){
                return message.channel.send('Duration error: max period 7 days. Ban failed')
            }
            else if(duration <= 0){
                return message.channel.send("Invalid input. Ban failed");
            }
        }
        
        //get member to ban
        const member = message.guild.members.cache.get(getGuildUserID(args[0]));
        if(member === undefined){
            return message.channel.send("Invalid member. Ban failed");
        }

        //get reason for ban
        const reason = args.slice(3).join(' ') || "No reason given";

        //execute ban
        try{ 
            if(duration === undefined){
                await member.ban({ reason: reason });
            }
            else{
                console.log(duration);
                await member.ban({ deleteMessageSeconds: (duration/1000), reason: reason });
            }
            return message.channel.send("Ban successful");
        }
        catch(err){
            console.error(err);
            return message.channel.send("Error. Ban failed")
        }
    }
}
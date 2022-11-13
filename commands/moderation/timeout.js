const { PermissionFlagsBits } = require("discord.js");
const { textToTime , getGuildUserID } = require("../../util/functions");

module.exports = {
    name: "timeout",
    category: "moderation",
    description: "Timeout a member. Max timeout: 28 days",
    syntax: "Usage: rb timeout @user # minutes/hours/days (reason)",
    permissions: [PermissionFlagsBits.ManageGuild],
    devOnly: false,
    run : async ({client, message, args}) => {
        console.log("timeout");

        //get duration of timeout
        if(args[1] === "remove"){ //case for removing timeout
            duration = null;
        }
        else if(isNaN(Number(args[1])) || args.length < 3){ //invalid input 
            return message.channel.send("Invalid input. Timeout failed");
        }
        else{ //valid input
            duration = textToTime(args[1], args[2]);
            if (duration > (28 * 86400000)){
                return message.channel.send('Duration error: max timeout 28 days. Timeout failed')
            }
            else if(duration <= 0){
                return message.channel.send("Invalid input. Timeout failed");
            }
        }
        
        //get member to timeout
        const member = message.guild.members.cache.get(getGuildUserID(args[0]));
        if(member === undefined){
            return message.channel.send("Invalid member. Timeout failed");
        }

        //get reason for timeout
        const reason = args.slice(3).join(' ') || "No reason given";

        //execute timeout
        try{ 
            await member.timeout(duration, reason);
            if(duration === null){
                return message.channel.send("Timeout removed");
            }
            return message.channel.send("Timeout successful");
        }
        catch(err){
            console.error(err);
            return message.channel.send("Error. Timeout failed")
        }
    }
}
const { PermissionFlagsBits } = require("discord.js");
const { getGuildUserID } = require("../../functions/other");

module.exports = {
    name: "kick",
    category: "moderation",
    description: "Kick a member.",
    syntax: "Usage: rb kick [@user] (for reason)",
    permissions: [PermissionFlagsBits.ManageGuild],
    devOnly: false,
    aliases: [],
    run: async ({ client, message, args }) => {
        console.log("kick");

        if (args.length < 1) {
            message.channel.send("Invalid syntax. Kick failed");
            return;
        }

        //get member from message
        const member = message.guild.members.cache.get(getGuildUserID(args[0]));
        if (member === undefined) {
            return message.channel.send("Invalid member. Kick failed");
        }

        const reason = args.slice(1).join(' ') || "No reason given";

        try {
            await member.kick(reason);
            return message.channel.send('Kick successful');
        }
        catch (err) {
            console.error(err);
            return message.channel.send("Error. Kick failed")
        }
    }
}
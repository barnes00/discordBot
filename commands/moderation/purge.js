const { PermissionFlagsBits } = require("discord.js");
module.exports = {
    name: "purge",
    category: "moderation",
    description: "Delete a number of messages from the current channel",
    syntax: "rb purge [number of messages]",
    permissions: [PermissionFlagsBits.ManageMessages],
    devOnly: false,
    aliases: [],
    run: async({client, message, args}) => {
        console.log("purge");
        
        if(args.length < 1 || isNaN(Number(args[0])) || !Number.isInteger(Number(args[0])) || Number(args[0]) < 1 || Number(args[0]) > 99){
            return message.channel.send("Error: Please enter a valid number (under 100)")
        }
        try{
            await message.channel.bulkDelete(Number(args[0]) + 1, true)
            const confirmMsg = await message.channel.send("Purge successful")
            setTimeout(() => {
                confirmMsg.delete()
            },5000)
        }
        catch(err){
            console.log(err)
            return message.channel.send("Error: Purge unsuccessful")
        }
    }
}
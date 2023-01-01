const { PermissionFlagsBits, parseEmoji } = require("discord.js");

module.exports = {
    name: "emojiimage",
    category: "misc",
    description: "Send an image link of an emoji",
    syntax: "rb emojiimage [emoji]",
    permissions: [],
    devOnly: false,
    aliases: ["ei"],
    run: async ({ client, message, args }) => {
        console.log("emojiimage");
        
        if (parseEmoji(message.content) !== null) { //check for emojis
            if (parseEmoji(message.content).id !== undefined) {
                const emoji = parseEmoji(message.content)
                if (emoji.animated == true) { //animated emoji found
                    return message.channel.send(`https://cdn.discordapp.com/emojis/${emoji.id}.gif`)
                }
                else { //non animated emoji found
                    return message.channel.send(`https://cdn.discordapp.com/emojis/${emoji.id}.png`)
                }
            }
            return message.channel.send("Error: Could not find emoji")
        }
        else {
            return message.channel.send("Error: Could not find emoji")
        }
    }
}
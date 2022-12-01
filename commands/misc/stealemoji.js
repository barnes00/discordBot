const { PermissionFlagsBits, parseEmoji } = require("discord.js");

module.exports = {
    name: "stealemoji",
    category: "misc",
    description: "Get the most recent channel emoji within 25 messages or the first emoji from a specified message and add it to the server emojis",
    syntax: "rb stealemoji (message link or id)",
    permissions: [PermissionFlagsBits.ManageEmojisAndStickers],
    devOnly: false,
    aliases: ["se"],
    run: async ({ client, message, args }) => {
        console.log("stealemoji");

        let emoji; 
        if (args.length > 0) {
            //message link and id support here
            const message = await message.channel.messages.fetch({ limit: 25, cache: false })
        }
        else { //no specified message
            //get past 25 messages and find most recent emoji
            let messages = await message.channel.messages.fetch({ limit: 25, cache: false })
            messages = messages.filter(msg => {
                if (parseEmoji(msg.content) !== null) {
                    return parseEmoji(msg.content).id !== undefined
                }
            })
            if (messages.size === 0) { //no emojis found
                return message.channel.send("Error: Could not find emoji")
            }
            emoji = parseEmoji(messages.at(0).content);
        }


        if (emoji.animated == true) { //animated emoji found
            message.guild.emojis.create({ attachment: `https://cdn.discordapp.com/emojis/${emoji.id}.gif`, name: emoji.name })
                .then(createdEmoji => message.channel.send(`Successfully added <a:${createdEmoji.name}:${createdEmoji.id}>`))
                .catch(err => {
                    console.log(err);
                    return message.channel.send("Error: Unable to upload emoji")
                });
        }
        else { //non animated emoji found
            message.guild.emojis.create({ attachment: `https://cdn.discordapp.com/emojis/${emoji.id}.png`, name: emoji.name })
                .then(createdEmoji => message.channel.send(`Successfully added <:${createdEmoji.name}:${createdEmoji.id}>`))
                .catch(err => {
                    console.log(err);
                    message.channel.send("Error: Unable to upload emoji")
                })
        }
    }
}

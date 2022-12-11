const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: "leave",
    category: "music",
    description: "Makes the bot stop playing music and leave the voice channel",
    syntax: "rb leave",
    permissions: [],
    devOnly: false,
    aliases: [],
    run: async ({ client, message, args }) => {
        console.log("leave")

        if (getVoiceConnection(message.guildId) !== undefined) {
            getVoiceConnection(message.guildId).destroy()
        }
        else {
            return message.channel.send("Error: Bot is not in a voice channel")
        }

    }
}
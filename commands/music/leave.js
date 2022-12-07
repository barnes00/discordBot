const { getVoiceConnection } = require('@discordjs/voice');
module.exports = {
    name: "leave",
    category: "music",
    description: "Makes the bot leave all voice channels",
    syntax: "rb leave",
    permissions: [],
    devOnly: false,
    aliases: [],
    run: async ({ client, message, args }) => {
        console.log("leave")
        console.log(client.voice.adapters)
        if (getVoiceConnection(message.guildId) !== undefined) {
            getVoiceConnection(message.guildId).destroy()
        }
        else {
            return message.channel.send("Error: Bot is not in a voice channel")
        }

    }
}
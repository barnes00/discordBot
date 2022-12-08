const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    name: "join",
    category: "music",
    description: "Makes the bot join the user's current voice channel",
    syntax: "rb join",
    permissions: [],
    devOnly: false,
    aliases: [],
    run: async ({ client, message, args }) => {
        console.log("join");

        let connection;
        if (!message.member.voice.channel) {
            return message.channel.send("Error: User must be in a voice channel")
        }
        else if (!message.member.voice.channel.joinable) {
            return message.channel.send("Error: Cannot join voice channel")
        }
        else {
            connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guildId,
                adapterCreator: message.guild.voiceAdapterCreator,
                selfDeaf: true
            });
        }
    }
}
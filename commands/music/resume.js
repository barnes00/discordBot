module.exports = {
    name: "resume",
    category: "music",
    description: "Resume a paused song",
    syntax: "rb resume",
    permissions: [],
    devOnly: false,
    aliases: [],
    run: async({client, message, args}) => {
        console.log("resume");
        let queue = client.player.getQueue(message.guild.id)
        
        if (queue === undefined || queue.nowPlaying === undefined) {
            return message.channel.send("Error: Nothing is currently paused")
        }
        queue.setPaused(false)
    }
}
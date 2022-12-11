module.exports = {
    name: "skip",
    category: "music",
    description: "Skip the current song",
    syntax: "rb skip",
    permissions: [],
    devOnly: false,
    aliases: [],
    run: async({client, message, args}) => {
        console.log("skip");
        let queue = client.player.getQueue(message.guild.id)
        
        if (queue === undefined || queue.nowPlaying === undefined) {
            return message.channel.send("Error: Nothing is currently playing")
        }
        queue.skip()
        
        
    }
}
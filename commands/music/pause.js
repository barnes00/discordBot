module.exports = {
    name: "pause",
    category: "music",
    description: "Pause the current song",
    syntax: "rb pause",
    permissions: [],
    devOnly: false,
    aliases: [],
    run: async({client, message, args}) => {
        console.log("pause");

        let queue = client.player.getQueue(message.guild.id)
        
        if (queue === undefined || queue.nowPlaying === undefined) {
            return message.channel.send("Error: Nothing is currently playing")
        }
        queue.setPaused(true)
        


    }
}
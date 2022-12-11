module.exports = {
    name: "clear",
    category: "music",
    description: "Clears the queue of all songs",
    syntax: "rb clear",
    permissions: [],
    devOnly: false,
    aliases: [],
    run: async ({ client, message, args }) => {
        console.log("clear");

        let queue = client.player.getQueue(message.guild.id)
        
        if (queue === undefined || queue.songs.length === 0) {
            return message.channel.send("Error: Nothing is currently queued")
        }
        await queue.clearQueue();
        
        message.channel.send("Success: queue was cleared")
        
    }
}
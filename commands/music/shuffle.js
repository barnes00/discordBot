module.exports = {
    name: "shuffle",
    category: "music",
    description: "Shuffle the current queue",
    syntax: "rb shuffle",
    permissions: [],
    devOnly: false,
    aliases: [],
    run: async({client, message, args}) => {
        console.log("shuffle");

        let queue = client.player.getQueue(message.guild.id)
        
        if (queue === undefined || queue.songs.length < 2) {
            return message.channel.send("Error: There is nothing to shuffle")
        }
        queue.shuffle();
        
        return message.channel.send("Queue was shuffled")
        
    }
}
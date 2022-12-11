module.exports = {
    name: "remove",
    category: "music",
    description: "Remove a song from the queue",
    syntax: "rb remove [# in the queue]",
    permissions: [],
    devOnly: false,
    aliases: ["rm"],
    run: async ({ client, message, args }) => {
        console.log("remove");

        let queue = client.player.getQueue(message.guild.id)

        if (queue === undefined || queue.songs.length < 2) {
            return message.channel.send("Error: Nothing is currently queued")
        }
        else if(args.length < 1 || isNaN(Number(args[0])) || !Number.isInteger(Number(args[0])) || Number(args[0]) > (queue.songs.length - 1) ||  Number(args[0]) < 1){
            return message.channel.send("Error: Enter a valid number from the queue")
        }

        const removedSong = queue.remove(Number(args[0]))

        if(removedSong === undefined){
            return message.channel.send("Error: Could not remove song")
        }else{
            return message.channel.send(`Successfully removed ${removedSong.name} by ${removedSong.author}`)
        }



    }
}
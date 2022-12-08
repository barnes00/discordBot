module.exports = {
    name: "queue",
    category: "music",
    description: "Shows the current queue",
    syntax: "rb queue",
    permissions: [],
    devOnly: false,
    aliases: ["q"],
    run: async({client, message, args}) => {
        console.log("queue");

        let queue = client.player.getQueue(message.guild.id)
        let songs;
        if (queue === undefined || queue.nowPlaying === undefined) {
            songs = [];
        }
        else{
            songs = queue.songs;
        }
        
        console.log(songs)
        
    }
}
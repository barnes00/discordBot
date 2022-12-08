module.exports = {
    name: "nowplaying",
    category: "music",
    description: "Show the current song",
    syntax: "rb nowplaying",
    permissions: [],
    devOnly: false,
    aliases: ["np"],
    run: async({client, message, args}) => {
        console.log("nowplaying");

        let queue = client.player.getQueue(message.guild.id)
        
        if (queue === undefined || queue.nowPlaying === undefined) {
            return message.channel.send("Error: Nothing is currently playing")
        }
        let song = queue.nowPlaying;
        console.log(song)
        
    }
}
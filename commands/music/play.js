const { Utils } = require("discord-music-player");

module.exports = {
    name: "play",
    category: "music",
    description: "Add a song to the queue",
    syntax: "rb play [song name]",
    permissions: [],
    devOnly: false,
    aliases: ["p"],
    run: async ({ client, message, args }) => {
        console.log("play");
        
        if (args.length === 0) {
            return message.channel.send("Error: Enter a song to play")
        }

        let queue = client.player.getQueue(message.guild.id)
        
        if (queue === undefined) {
            if (!message.member.voice.channel) {
                return message.channel.send("Error: User must be in a voice channel")
            }
            queue = client.player.createQueue(message.guild.id);
        }
        
        await queue.join(message.member.voice.channel);
        
        const addedSong = await queue.play(args.join(' '), {requestedBy: message.author.tag}).catch(err => {
            console.log(err);
            if (!queue){
                queue.stop();
            }
            return message.channel.send("Error: song not added")

        });

        return message.channel.send(`Success! ${addedSong.name} by ${addedSong.author} added to queue`)


    }
}
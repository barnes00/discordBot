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
        queue.play(args.join(' ')).catch(err => {
            console.log(err);
            if (!queue)
                queue.stop();
        });


    }
}
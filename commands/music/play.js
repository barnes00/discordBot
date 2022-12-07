module.exports = {
    name: "play",
    category: "music",
    description: "Play a song",
    syntax: "rb play [song name]",
    permissions: [],
    devOnly: false,
    aliases: ["p"],
    run: async({client, message, args}) => {
        console.log("play");
        let guildQueue = client.player.getQueue(message.guild.id)
        let queue = client.player.createQueue(message.guild.id);
        await queue.join(message.member.voice.channel);
        let song = await queue.play(args.join(' ')).catch(err => {
            console.log(err);
            if(!guildQueue)
                queue.stop();
        });
        
        
    }
}
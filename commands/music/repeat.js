module.exports = {
    name: "repeat",
    category: "music",
    description: "Repeat the current queue",
    syntax: "rb repeat (off)",
    permissions: [],
    devOnly: false,
    aliases: [],
    run: async({client, message, args}) => {
        console.log("repeat");

        let queue = client.player.getQueue(message.guild.id)
        
        if (queue === undefined || queue.nowPlaying === undefined) {
            return message.channel.send("Error: There is nothing to repeat")
        }

        if(args[0] === "off"){
            queue.setRepeatMode(0);
        }
        else{
            queue.setRepeatMode(2);
        }
        
        

    }
}
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "queue",
    category: "music",
    description: "Shows the current queue of 10 songs",
    syntax: "rb queue",
    permissions: [],
    devOnly: false,
    aliases: ["q"],
    run: async ({ client, message, args }) => {
        console.log("queue");

        let queue = client.player.getQueue(message.guild.id)

        if (queue === undefined || queue.songs.length === 0) {
            return message.channel.send("Error: Nothing is currently queued")
        }

        try {
            let maxList;
            if (queue.songs.length > 11) {
                maxList = 11;
            }
            else {
                maxList = queue.songs.length;
            }

            let descText = "";

            for (let i = 1; i < maxList; i++) {
                descText += `${i}. ${queue.songs[i].name} by ${queue.songs[i].author} ${queue.songs[i].duration}\nQueued by ${queue.songs[i].requestedBy}\n\n`
                if (i === 10 && queue.songs.length > 11) {
                    console.log("more than 10")
                    descText += `and ${queue.songs.length - 11} more songs`
                }
            }
            //create embed
            const Embed = new EmbedBuilder()
                .setColor(0x70d9ee)
                .setTitle("Up Next")
                .setDescription(descText)

            message.channel.send({ embeds: [Embed] })

        } catch (err) {
            return message.channel.send("Error: Nothing is currently playing")
        }

    }
}
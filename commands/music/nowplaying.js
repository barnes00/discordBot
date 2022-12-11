const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "nowplaying",
    category: "music",
    description: "Show the current song",
    syntax: "rb nowplaying",
    permissions: [],
    devOnly: false,
    aliases: ["np"],
    run: async ({ client, message, args }) => {
        console.log("nowplaying");

        let queue = client.player.getQueue(message.guild.id)

        if (queue === undefined || queue.songs.length === 0) {
            return message.channel.send("Error: Nothing is currently playing")
        }
        
        let song = queue.songs[0];
        try {
            //create embed
            const Embed = new EmbedBuilder()
                .setColor(0x70d9ee)
                .setTitle(song.name)
                .setURL(song.url)
                .setDescription(song.author)
                .setThumbnail(song.thumbnail)
                .addFields({ name: 'Progress', value: queue.createProgressBar().times })
                .setFooter({ text: `Queued by ${song.requestedBy}` })

            message.channel.send({ embeds: [Embed] })

        } catch (err) {
            return message.channel.send("Error: Nothing is currently playing")
        }




    }
}
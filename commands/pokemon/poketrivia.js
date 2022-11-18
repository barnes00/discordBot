const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "poketrivia",
    category: "pokemon",
    description: "Sends an image and users must name the pokemon. Questions timeout after 2 minutes or when a user types exit",
    syntax: "rb poketrivia [# of questions (max:20)]",
    permissions: [],
    devOnly: false,
    run: async ({ client, message, args }) => {
        console.log("poketrivia");
        let cont = false;
        // if (Number.isInteger(Number.parseInt(args[0])) && (args[0] <= 20) && (args[0] > 0)) {
        //     for (let i = 0; i < Number.parseInt(args[0]); i++) {
                
                let rndmPoke = (Math.floor(Math.random() * 905) + 1).toString();
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${rndmPoke}/`).then(res => res.json())
                const answer = res.species.name;
                let questionActive = true;
                const Embed = new EmbedBuilder()
                    .setColor(0x70d9ee)
                    .setImage(res.sprites.other['official-artwork'].front_default)
                    .setTitle("Who's That Pokémon?")

                message.channel.send({ embeds: [Embed] });
                message.channel.awaitMessages()

                const collector = message.channel.createMessageCollector({ time: 120000 });
                collector.on('collect', m => {
                    console.log(`Collected ${m.content}`);
                    if (m.content === answer) {
                        m.reply("Correct!")
                        collector.stop()
                        cont = true;
                    }
                    else if (m.content.includes('rb poketrivia help')) {
                    }
                    else if (m.content === 'skip') {
                        collector.stop()
                        cont = true;
                    }
                    else if (m.content === 'hint') {

                    }
                    else if (m.content === 'exit' || m.content.includes('rb poketrivia')) {
                        console.log("stop")
                        collector.stop()
                        cont = false;
                    }
                });
                
            }
        //}
    //}
}
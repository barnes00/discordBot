const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "poketrivia",
    category: "pokemon",
    description: "Sends an image and users must name the pokemon. Questions timeout after 2 minutes. \n Options during quiz: hint, skip, exit",
    syntax: "rb poketrivia (# of questions (max:20))",
    permissions: [],
    devOnly: false,
    aliases: [],
    run: async ({ client, message, args }) => {
        console.log("poketrivia");

        //multiple question logic
        let qNum = 1;
        if (Number.isInteger(Number.parseInt(args[0]))) {
            if (!((args[0] <= 20) && (args[0] > 0))) {
                return message.channel.send("Please enter a valid number (max: 20)")
            }
            qNum = Number.parseInt(args[0]);
        }

        for (let i = 0; i < qNum; i++) {
            //generate question and answers
            let rndmPoke = (Math.floor(Math.random() * 905) + 1).toString();
            const pokeInfo = await fetch(`https://pokeapi.co/api/v2/pokemon/${rndmPoke}/`).then(res => res.json())
            const speciesInfo = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${rndmPoke}/`).then(res => res.json())
            
            const engAns = pokeInfo.species.name.toLowerCase();
            const answers = new Set(); //other language support
            for (let i = 0; i < speciesInfo.names.length; i++) {
                answers.add(speciesInfo.names[i].name.toLowerCase())
            }

            const Embed = new EmbedBuilder()
                .setColor(0x70d9ee)
                .setImage(pokeInfo.sprites.other['official-artwork'].front_default)
                .setTitle("Who's That Pokémon?")
            message.channel.send({ embeds: [Embed] });

            //get answers
            const result = await resolveAfterAnswer(answers, engAns);
            if (result === "exit") {
                break;
            }
        }

        function resolveAfterAnswer(answers, engAns) {
            return new Promise(resolve => {
                const filter = m => !m.author.bot;
                let timeout = true;
                const collector = message.channel.createMessageCollector({ filter, time: 120000 });
                collector.on('collect', m => {
                    const msg = m.content.toLowerCase();

                    if (answers.has(msg)) {
                        m.reply("Correct!")
                        timeout = false;
                        collector.stop()
                        resolve();
                    }
                    else if (msg === 'skip'){
                        timeout = false;
                        collector.stop()
                        resolve();
                    }
                    else if (msg === 'hint') {
                        let hintMsg = engAns.charAt(0).padEnd((engAns.length), '?');
                        message.channel.send(hintMsg);
                    }
                    else if (msg === 'exit' || msg === 'rb poketrivia') {
                        message.channel.send("Trivia ended")
                        timeout = false;
                        collector.stop()
                        resolve("exit");
                    }
                })
                
                collector.on('end', collected => {
                    if(timeout === true){
                        message.channel.send("Question timeout")
                    }
                });
                setTimeout(() => {
                    resolve();
                }, 120000);
            });
        }
    }
}

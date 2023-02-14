const fetch = require('node-fetch');
const { EmbedBuilder, ApplicationCommandPermissionType } = require('discord.js');
const { getGenerationNums } = require("../../functions/pokemon");

module.exports = {
    name: "poketrivia",
    category: "pokemon",
    description: "Sends an image and users must name the pokemon. Questions timeout after 2 minutes. \n Options during quiz: hint, skip, exit",
    syntax: "rb poketrivia (# of questions (max:20)) (gen#)",
    permissions: [],
    devOnly: false,
    aliases: ["pt"],
    run: async ({ client, message, args }) => {
        console.log("poketrivia");

        //multiple question logic
        let qNum = 1;
        if (Number.isSafeInteger(Number(args[0]))) {
            if (!((args[0] <= 20) && (args[0] > 0))) {
                return message.channel.send("Please enter a valid number (max: 20)")
            }
            qNum = Number.parseInt(args[0]);
        }

        for (let i = 0; i < qNum; i++) {
            //generate question and answers
            let rndmPoke;
            let genNums;
            for (let i = 0; i < args.length; i++) {
                if (args[i].match(/gen[1-9]/i)) {
                    genNums = getGenerationNums(args[i]);
                }
            }
    
            if (genNums === undefined) {
                rndmPoke = (Math.floor(Math.random() * 1008) + 1).toString(); //no gen
            }
            else{
                console.log(genNums)
                rndmPoke = (Math.floor(Math.random() * (genNums[1] - genNums[0])) + genNums[0]).toString();
            }

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

        function resolveAfterAnswer(answers, engAns) { //function to collect answers after question is sent
            return new Promise(resolve => {
                const timeout = setTimeout(() => {
                    message.channel.send("Question timeout")
                }, 120000)

                const filter = m => !m.author.bot;

                const collector = message.channel.createMessageCollector({ filter, time: 120000 });
                collector.on('collect', m => {
                    const msg = m.content.toLowerCase();

                    if (answers.has(msg)) {
                        m.reply("Correct!")
                        collector.stop()
                    }
                    else if (msg === 'skip') {
                        collector.stop()
                    }
                    else if (msg === 'answer') {
                        message.channel.send(engAns)
                        collector.stop()
                    }
                    else if (msg === 'hint') {
                        let hintMsg = engAns.charAt(0) + " " + '\\_ '.repeat(engAns.length - 1);
                        message.channel.send(hintMsg);
                    }
                    else if (msg === 'exit' || msg === 'rb poketrivia') {
                        message.channel.send("Trivia ended")
                        resolve("exit");
                        collector.stop()
                    }
                })

                collector.on('end', collected => {
                    clearTimeout(timeout)
                    resolve();
                });
            });
        }
    }
}

const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "pokemon",
    category: "pokemon",
    description: "Sends information about a pokemon",
    syntax: "rb pokemon (forms) [name]",
    permissions: [],
    devOnly: false,
    aliases: [],
    run: async ({ client, message, args }) => {
        console.log("pokemon");

        try {
            var speciesInfo = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${args[args.length - 1]}/`).then(res => res.json());
        }
        catch (err) {
            console.log(err);
            return message.channel.send("Error: could not find pokemon");

        }
        console.log("v " + speciesInfo.varieties.length)
        const dexNum = speciesInfo.pokedex_numbers[0].entry_number;
        const pokeInfo = await fetch(`https://pokeapi.co/api/v2/pokemon/${dexNum}/`).then(res => res.json());
        console.log("f " + pokeInfo.forms.length)


        const Embed = new EmbedBuilder()
            .setColor(0x70d9ee)
            .setImage(pokeInfo.sprites.other['official-artwork'].front_default)
            .setFooter({ text: pokeInfo.species.name });

        message.channel.send({ embeds: [Embed] });
    }
}
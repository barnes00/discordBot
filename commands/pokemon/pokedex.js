const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');
const { formatPokeName, unformatPokeName } = require("../../util/functions");

module.exports = {
    name: "pokedex",
    category: "pokemon",
    description: "Sends information about a given pokemon",
    syntax: "rb pokedex (forms) [name: use hyphens instead of spaces]",
    permissions: [],
    devOnly: false,
    aliases: ["pd"],

    run: async ({ client, message, args }) => {
        console.log("pokedex");
        //get pokemon info
        try {
            var speciesInfo = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${args[args.length - 1].toLowerCase()}/`).then(res => res.json());
        }
        catch (err) {
            return message.channel.send("Error: could not find pokemon");
        }

        let url;
        let errMsg = [];
        if (args.length > 1) { //if different form, get api url
            const finalForm = formatPokeName(args)
            for (const element of speciesInfo.varieties) { //match input to valid form
                if (finalForm === element.pokemon.name) {
                    url = element.pokemon.url;
                }
                errMsg.push(unformatPokeName(element.pokemon.name))
            }
        }
        else {
            url = speciesInfo.varieties[0].pokemon.url;
        }

        //get more api data
        try {
            var pokeInfo = await fetch(url).then(res => res.json());
        }
        catch (err) {
            return message.channel.send("Error - Please enter a valid form: \n" + errMsg.join(", "))
        }

        
        console.log(unformatPokeName(pokeInfo.forms[0].name))
        console.log(speciesInfo.pokedex_numbers[0].entry_number)
        console.log(pokeInfo.sprites.front_default)
        console.log(pokeInfo.types)
        console.log(pokeInfo.stats)
        console.log("getWeaknesses(pokeInfo.types)")
        

        const Embed = new EmbedBuilder()
            .setColor(0x70d9ee)
            
        //message.channel.send({ embeds: [Embed] });

    }
}

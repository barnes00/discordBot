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
        run: async ({ client, message, args }) => {
            console.log("pokedex");
            //get pokemon info
            try {
                var speciesInfo = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${args[args.length - 1].toLowerCase()}/`).then(res => res.json());
            }
            catch (err) {
                console.log(err);
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
                console.log(err)
                return message.channel.send("Error - Please enter a valid form: \n" + errMsg.join(", "))
            }
    
            let footerTxt = unformatPokeName(pokeInfo.forms[0].name)
    
            const Embed = new EmbedBuilder()
                .setColor(0x70d9ee)
    
            if (args.includes("shiny")) {
                Embed.setImage(pokeInfo.sprites.other.home.front_shiny)
                Embed.setFooter({ text: "shiny " + footerTxt });
            }
            else {
                Embed.setImage(pokeInfo.sprites.other['official-artwork'].front_default)
                Embed.setFooter({ text: footerTxt });
            }
    
            message.channel.send({ embeds: [Embed] });
    
        }
    }
}
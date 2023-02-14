const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');
const { formatPokeName, unformatPokeName } = require("../../functions/pokemon");
const { upperCaseFirst } = require("../../functions/other");

module.exports = {
    name: "pokemon",
    category: "pokemon",
    description: "Sends an image of a given pokemon",
    syntax: "rb pokemon (forms) [name: use hyphens instead of spaces]",
    permissions: [],
    devOnly: false,
    aliases: ["pkm"],
    run: async ({ client, message, args }) => {
        console.log("pokemon");
        //get pokemon info
        try {
            var speciesInfo = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${args[args.length - 1].toLowerCase()}/`).then(res => res.json());
        }
        catch (err) {
            return message.channel.send("Error: could not find pokemon");
        }

        //get english species name
        let enName = speciesInfo.names.find(function (item) {
            if (item.language.name === "en") { return item; }
        });

        let url;
        let errMsg = [];
        if (args.length > 1) { //if different form, get api url
            const finalForm = formatPokeName(args)
            for (const element of speciesInfo.varieties) { //match input to valid form
                if (finalForm === element.pokemon.name) {
                    url = element.pokemon.url;
                }
                errMsg.push(upperCaseFirst(unformatPokeName(element.pokemon.name, enName.name)))
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

        let footerTxt;
        if(args.length > 1){
            footerTxt = (upperCaseFirst(unformatPokeName(pokeInfo.forms[0].name, enName.name)))
        }
        else{
            footerTxt = enName.name;
        }
        

        const Embed = new EmbedBuilder()
            .setColor(0x70d9ee)

        if (args.includes("shiny")) {
            if(pokeInfo.sprites.other.home.front_shiny === null){
                return message.channel.send("Error: No image available")
            }
            Embed.setImage(pokeInfo.sprites.other.home.front_shiny)
            Embed.setFooter({ text: upperCaseFirst("shiny " + footerTxt) });
        }
        else {
            if(pokeInfo.sprites.other['official-artwork'].front_default === null){
                return message.channel.send("Error: No image available")
            }
            Embed.setImage(pokeInfo.sprites.other['official-artwork'].front_default)
            Embed.setFooter({ text: upperCaseFirst(footerTxt) });
        }
        
        message.channel.send({ embeds: [Embed] });

    }
}
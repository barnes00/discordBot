const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');
const { formatPokeName, unformatPokeName, getMatchups } = require("../../functions/pokemon");
const { upperCaseFirst } = require("../../functions/other");

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

        //get english species name
        let enName = speciesInfo.names.find(function (item) {
            if (item.language.name === "en") { return item; }
        });

        let pokeURL;
        let errMsg = [];
        if (args.length > 1) { //if different form, get api url
            const finalForm = formatPokeName(args)
            for (const element of speciesInfo.varieties) { //match input to valid form
                if (finalForm === element.pokemon.name) {
                    pokeURL = element.pokemon.url;
                    break;
                }
                errMsg.push(unformatPokeName(element.pokemon.name, enName.name))
            }
        }
        else {
            pokeURL = speciesInfo.varieties[0].pokemon.url;
        }

        //get more api data
        try {
            var pokeInfo = await fetch(pokeURL).then(res => res.json());
        }
        catch (err) {
            return message.channel.send("Error - Please enter a valid form: \n" + errMsg.join(", "))
        }

        //get stats
        let statStr = '';
        pokeInfo.stats.forEach(stat => {
            statStr = statStr + upperCaseFirst(stat.stat.name) + ": " + stat.base_stat + "\n";
        });
        statStr = upperCaseFirst(statStr.replaceAll("Special-", "Sp "))

        //get description 
        let enGenus = speciesInfo.genera.find(function (item) {
            if (item.language.name === "en") { return item; }
        });

        let title;
        if(args.length > 1){
            title = ("#" + speciesInfo.id + " " + upperCaseFirst(unformatPokeName(pokeInfo.forms[0].name, enName.name)))
        }
        else{
            title = ("#" + speciesInfo.id + " " + enName.name);
        }

        const Embed = new EmbedBuilder()
            .setColor(0x70d9ee)
            .setTitle(title)
            .setURL(`https://pokemondb.net/pokedex/${args[args.length - 1].toLowerCase()}`)


        if(enGenus){
            Embed.setDescription(enGenus.genus)
        }
        if(pokeInfo.sprites.front_default){
            Embed.setThumbnail(pokeInfo.sprites.front_default)
        }
            
        // get type matchups and type
        let typeMatchups;
        if (pokeInfo.types.length === 1) {
            Embed.addFields(
                { name: 'Type', value: upperCaseFirst(pokeInfo.types[0].type.name) })
            typeMatchups = getMatchups([pokeInfo.types[0].type.name]);
        }
        else {
            Embed.addFields(
                { name: 'Types', value: upperCaseFirst(pokeInfo.types[0].type.name + ", " + pokeInfo.types[1].type.name) })
            typeMatchups = getMatchups([pokeInfo.types[0].type.name, pokeInfo.types[1].type.name]);
        }

        Embed.addFields(
            { name: 'Stats', value: statStr, inline: true },
            { name: 'Weaknesses', value: typeMatchups[0], inline: true },
            { name: 'Resistances', value: typeMatchups[1], inline: true },
        )

        message.channel.send({ embeds: [Embed] });

    }
}

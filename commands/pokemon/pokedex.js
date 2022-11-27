const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');
const { formatPokeName, unformatPokeName, upperCaseAll } = require("../../util/functions");

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

        //get stats
        let statStr = '';
        pokeInfo.stats.forEach(stat => {
            statStr = statStr + upperCaseAll(stat.stat.name) + ": " + stat.base_stat + "\n";
        });
        statStr = statStr.replaceAll("Special-", "Sp ")

        //get description 
        let enGenus = speciesInfo.genera.find(function (item) {
            if (item.language.name === "en") { return item; }
        });

        //calculate type matchups
        function getMatchups(typeArr) { //take an array of types and return an array of size 2 containing string of weaknesses and resistances
            let typeNames = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];
            const typeMap = new Map([
                ["normal", [001, 001, 001, 001, 001, 001, 002, 001, 001, 001, 001, 001, 001, 000, 001, 001, 001, 001]],
                ["fire", [001, 0.5, 002, 001, 0.5, 0.5, 001, 001, 002, 001, 001, 0.5, 002, 001, 001, 001, 0.5, 0.5]],
                ["water", [001, 0.5, 0.5, 002, 002, 0.5, 001, 001, 001, 001, 001, 001, 001, 001, 001, 001, 0.5, 001]],
                ["electric", [001, 001, 001, 0.5, 001, 001, 001, 001, 002, 0.5, 001, 001, 001, 001, 001, 001, 0.5, 001]],
                ["grass", [001, 002, 0.5, 0.5, 0.5, 002, 001, 002, 0.5, 002, 001, 002, 001, 001, 001, 001, 001, 001]],
                ["ice", [001, 002, 001, 001, 001, 0.5, 002, 001, 001, 001, 001, 001, 002, 001, 001, 001, 002, 001]],
                ["fighting", [001, 001, 001, 001, 001, 001, 001, 001, 001, 002, 002, 0.5, 0.5, 001, 001, 0.5, 001, 002]],
                ["poison", [001, 001, 001, 001, 0.5, 001, 0.5, 0.5, 002, 001, 002, 0.5, 001, 001, 001, 001, 001, 0.5]],
                ["ground", [001, 001, 002, 000, 002, 002, 001, 0.5, 001, 001, 001, 001, 0.5, 001, 001, 001, 001, 001]],
                ["flying", [001, 001, 001, 002, 0.5, 002, 0.5, 001, 000, 001, 001, 0.5, 002, 001, 001, 001, 001, 001]],
                ["psychic", [001, 001, 001, 001, 001, 001, 0.5, 001, 001, 001, 0.5, 002, 001, 002, 001, 002, 001, 001]],
                ["bug", [001, 002, 001, 001, 0.5, 001, 0.5, 001, 0.5, 002, 001, 001, 002, 001, 001, 001, 001, 001]],
                ["rock", [0.5, 0.5, 002, 001, 002, 001, 002, 0.5, 002, 0.5, 001, 001, 001, 001, 001, 001, 002, 001]],
                ["ghost", [000, 001, 001, 001, 001, 001, 000, 0.5, 001, 001, 001, 0.5, 001, 002, 001, 002, 001, 001]],
                ["dragon", [001, 0.5, 0.5, 0.5, 0.5, 002, 001, 001, 001, 001, 001, 001, 001, 001, 002, 001, 001, 002]],
                ["dark", [001, 001, 001, 001, 001, 001, 002, 001, 001, 001, 000, 002, 001, 0.5, 001, 0.5, 001, 002]],
                ["steel", [0.5, 002, 001, 001, 0.5, 0.5, 002, 000, 002, 0.5, 0.5, 0.5, 0.5, 001, 0.5, 001, 0.5, 0.5]],
                ["fairy", [001, 001, 001, 001, 001, 001, 0.5, 002, 001, 001, 001, 0.5, 001, 001, 000, 0.5, 002, 001]]
            ]);

            //calculate weaknesses and resistances into one map
            let typeMatchupMap = new Map();
            for (let i = 0; i < typeArr.length; i++) { // for each type
                typeMatchupArr = typeMap.get(typeArr[i]) //get the type matchups
                for (j = 0; j < 18; j++) { //iterate throught to find weakness/resistances
                    if (typeMatchupArr[j] !== 001) {
                        if (typeMatchupMap.has(typeNames[j])) {
                            typeMatchupMap.set(typeNames[j], typeMatchupMap.get(typeNames[j]) * typeMatchupArr[j])
                        }
                        else {
                            typeMatchupMap.set(typeNames[j], typeMatchupArr[j])
                        }
                    }
                }
            }

            //sort map into seperate arrays of weaknesses and resistances
            let weaknessArr = [];
            let resistanceArr = [];
            typeMatchupMap.forEach(function (value, type) {
                if (value > 1) {
                    weaknessArr.push(upperCaseAll(type) + " x" + value)
                }
                else if (value < 1) {
                    resistanceArr.push(upperCaseAll(type) + " x" + value)
                }
            })

            if (weaknessArr.length === 0) {
                weaknessArr.push("None")
            }
            if (resistanceArr.length === 0) {
                resistanceArr.push("None")
            }

            return [weaknessArr.join("\n"), resistanceArr.join("\n")];
        }

        const Embed = new EmbedBuilder()
            .setColor(0x70d9ee)
            .setTitle("#" + speciesInfo.pokedex_numbers[0].entry_number + " " + upperCaseAll(unformatPokeName(pokeInfo.forms[0].name)))
            .setURL(`https://pokemondb.net/pokedex/${args[args.length - 1].toLowerCase()}`)
            .setDescription(enGenus.genus)
            .setThumbnail(pokeInfo.sprites.front_default)
        
        // get type matchups and type
        let typeMatchups;
        if (pokeInfo.types.length === 1) {
            Embed.addFields(
                { name: 'Type', value: upperCaseAll(pokeInfo.types[0].type.name) })
            typeMatchups = getMatchups([pokeInfo.types[0].type.name]);
        }
        else {
            Embed.addFields(
                { name: 'Type', value: upperCaseAll(pokeInfo.types[0].type.name + " " + pokeInfo.types[1].type.name) })
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

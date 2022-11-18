const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "pokemon",
    category: "pokemon",
    description: "Sends information about a pokemon",
    syntax: "rb pokemon name/number",
    permissions: [],
    devOnly: false,
    run: async({client, message, args}) => {
        console.log("pokemon");

        
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${args[0]}/`).then(res => res.json())
        
        const Embed = new EmbedBuilder()
	        .setColor(0x70d9ee)
	        .setImage(res.sprites.other['official-artwork'].front_default)
	        .setFooter({ text: res.species.name });    
        
        message.channel.send({ embeds: [Embed] });     
        

    }
}
const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'help',
    description: 'Display a list of commands',
	async execute(msg, client) {
		console.log('Executing', this.name);
		
		//sends an embed listing all commands and their description
		let embed = new EmbedBuilder()
		.setTitle('Help Menu')
		.setColor('70daef')
		client.commands.forEach(cmd => {
			embed.addFields([{
				name: cmd.name,
				value: cmd.description,
				inline: false
			}])
		})

        msg.channel.send({embeds: [embed]});
	},
};
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('pong')
		.setDescription('Replies with pong'),
	async execute(msg) {
		return ('pong reply');
	},
};
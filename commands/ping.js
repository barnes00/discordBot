module.exports = {
	name: 'ping',
	description: 'Check if the bot is online',
	async execute(msgArray, channel) {
		console.log('Executing', this.name);
		channel.send('pong');
	},
};
module.exports = {
	name: 'help',
    description: 'Learn about my commands',
	async execute(msgArray, channel) {
		console.log('Executing', this.name);
		channel.send('Commands: help, ping');
	},
};
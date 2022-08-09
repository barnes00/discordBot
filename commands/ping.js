module.exports = {
	name: 'ping',
	async execute(msgArray, channel) {
		console.log('ping command');
		channel.send('pong');
	},
};
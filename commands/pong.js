module.exports = {
	name: 'pong',
	async execute(msgArray, channel) {
		console.log('pong command');
		channel.send('pong reply');
	},
};
module.exports = {
	name: 'choose',
	description: 'Randomly choose an item from a list of words',
	async execute(msg, client) {
		console.log('Executing', this.name);
		let msgArray = msg.content.split(' ');
		if (msgArray.length == 2){
			msg.channel.send("Please list options after the command");
			return;
		}
        let randomItemIndex = Math.floor(Math.random() * (msgArray.length - 2));
		console.log(randomItemIndex + 2);
		msg.channel.send(msgArray[randomItemIndex + 2]);
	},
};
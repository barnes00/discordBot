module.exports = {
    name: "choose",
    category: "misc",
    description: "Randomly choose from a group of options",
    syntax: "rb choose opt1 opt2 opt3...",
    permissions: [],
    devOnly: false,
    run: async({client, message, args}) => {
        console.log("choose");

        message.channel.send(args[Math.floor(Math.random() * args.length)]);
    }
}
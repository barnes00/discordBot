module.exports = {
    name: "choose",
    category: "misc",
    description: "Randomly choose from a group of options",
    syntax: "rb choose [options]",
    permissions: [],
    devOnly: false,
    aliases: [],
    run: async({client, message, args}) => {
        console.log("choose");
        if(args[0]){
            message.channel.send("I choose " + args[Math.floor(Math.random() * args.length)]);
        }
        else{
            message.channel.send("Please add options to choose");
        }
        
    }
}
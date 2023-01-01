module.exports = {
    name: "textreverse",
    category: "misc",
    description: "Reverse an input",
    syntax: "",
    permissions: [],
    devOnly: false,
    aliases: ["tr"],
    run: async({client, message, args}) => {
        console.log("textreverse");
        
        if(args.length === 0){
            return message.channel.send("Error: please enter an input")
        }
        let input = args.join(" ")
        let output = ""

        for(let i = 0; i < input.length; i++){
            output = output + input.charAt(input.length - i - 1)
        }

        message.channel.send(output)
    }
}
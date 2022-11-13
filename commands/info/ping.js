module.exports = {
    name: "ping",
    category: "info",
    description: "Check if the bot is online",
    syntax: "",
    permissions: [],
    devOnly: false,
    run: async({client, message, args}) => {
        console.log("ping");
        message.reply("Pong")
    }
}
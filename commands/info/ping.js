module.exports = {
    name: "ping",
    category: "info",
    description: "Check if the bot is online",
    permissions: [],
    devOnly: false,
    run: async({client, message, args}) => {
        message.reply("Pong")
    }
}
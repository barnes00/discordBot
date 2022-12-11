module.exports = {
    name: "ping",
    category: "info",
    description: "Check if the bot is online",
    syntax: "",
    permissions: [],
    devOnly: false,
    aliases: [],
    run: async({client, message, args}) => {
        console.log("ping");
        var date = Date.now()
        message.channel.send(`Pong! \nBot: ${Math.round(Date.now() - date)}ms \nAPI: ${Math.round(client.ws.ping)}ms`)
    }
}
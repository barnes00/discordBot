const fs = require("fs");
const { getFiles } = require("../../util/functions");

module.exports = {
    name: "help",
    category: "info",
    description: "Display a help menu",
    syntax: "",
    permissions: [],
    devOnly: false,
    run: async({client, message, args}) => {
        console.log("help");

        let helpMsg = '';
        fs.readdirSync("./commands/").forEach((category) => {
            if(category !== "dev"){
                helpMsg = helpMsg.concat(category, ": ");
                commands = getFiles(`./commands/${category}`, ".js");
                helpMsg = helpMsg.concat(commands.join(", "));
                helpMsg = helpMsg.concat("\n");
            }      
        })

        helpMsg = helpMsg.replaceAll(/.js/g, "");
        message.channel.send(helpMsg);
    }
}
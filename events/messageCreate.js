const Discord = require("discord.js");

module.exports = {
    name: "messageCreate",
    run: async function runAll(bot, message){
        const {client} = bot;

        if (!message.guild) return;
        if (message.author.bot) return;
        if (!message.content.toLowerCase().startsWith(bot.prefix)) return;

        const args = message.content.slice(bot.prefix.length).trim().split(/ +/g);
        const cmdstr = args.shift().toLowerCase();

        let command = client.commands.get(cmdstr);
        if (!command) return;
        let member = message.member;
        if (command.devOnly && !bot.owners.includes(member.id)){
            return message.reply("This command is only available to bot owners");
        }

        if (command.permissions && member.permissions.missing(command.permissions).length !== 0){
            return message.reply("You do not have permission to use this command");
        }
        if (args[0] === "help"){
            return message.channel.send(command.description + "\n" + command.syntax);
        }

        try{
            await command.run({...bot, message, args})
        }
        catch(err){
            let errMsg = err.toString();
            if(errMsg.startsWith("?")){
                errMsg = errMsg.slice(1);
                await message.reply(errMsg);
            }
            console.error(err);
        }

    }
}
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "messageCreate",
    run: async function runAll(bot, message){
        const {client} = bot;

        if (!message.guild) return;
        if (message.author.bot) return;
        if (!message.content.toLowerCase().startsWith(bot.prefix)) return;

        const args = message.content.slice(bot.prefix.length).trim().split(/ +/g);
        const cmdstr = args.shift().toLowerCase();

        let command;
        if(client.aliases.has(cmdstr)){
            command = client.commands.get(client.aliases.get(cmdstr));
        }
        else{
            command = client.commands.get(cmdstr);
        }
        
        if (!command) return;
        
        let member = message.member;
        if (command.devOnly && !bot.owners.includes(member.id)){
            return message.reply("This command is only available to bot owners");
        }

        if (command.permissions && member.permissions.missing(command.permissions).length !== 0){
            return message.reply("You do not have permission to use this command");
        }
        if (args[0] === "help"){
            let descStr = command.description;
            if(command.syntax !== ""){
                descStr += "\nSyntax: " + command.syntax;
            }
            if(command.aliases.length > 0){
                descStr += "\nAliases: "
                for (let i = 0; i < command.aliases.length; i++) {
                    descStr += command.aliases[i];
                    if(i !== command.aliases.length - 1){
                        descStr += ', ';
                    }
                }
            }

            const Embed = new EmbedBuilder()
                .setColor(0x70d9ee)
                .setTitle(command.name)
                .setDescription(descStr)
                
            return message.channel.send({ embeds: [Embed] });
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
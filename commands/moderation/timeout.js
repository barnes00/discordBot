const textToTime = (num, unit) => {
    if(unit.includes("minute")){
        return num * 60 * 1000;
    }
    else if(unit.includes("hour")){
        return num * 60 * 60 * 1000;
    }
    else if(unit.includes("day")){
        return num * 24 * 60 * 60 * 1000;
    }
    else{
        return 0;
    }
}

module.exports = {
    name: "timeout",
    category: "moderation",
    description: "Timeout a member",
    syntax: "rb timeout @user # minutes/hours/days for reason",
    permissions: ["MODERATE_MEMBERS"],
    devOnly: false,
    run : async ({client, message, args}) => {
        if((args.length < 3) || isNaN(Number(args[1]))){
            message.channel.send("Invalid syntax");
            return;
        }

        //get member from message
        let userID = args[0].includes('<@!') ? args[0].replace('<@!', '').replace('>', '')
        : args[0].includes('<@') ? args[0].replace('<@', '').replace('>', '') : '';
        const member = message.guild.members.cache.get(userID);
        
        const duration = textToTime(args[1], args[2]);
        const reason = args.slice(4).join(' ') || "No reason given";

        if (duration > 2592000000 || duration <= 0){
            return message.channel.send('Duration error: max timeout 30 days')
        }
        
        try{
            await member.timeout(duration, reason);
            return message.channel.send(`${member.user.username} has been timed out`);
        }
        catch(err){
            console.error(err);
            return message.channel.send("Failed to timeout")
        }
    }
}
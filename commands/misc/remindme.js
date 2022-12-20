const { messageLink } = require('discord.js');
const { addReminder, loadReminder } = require('../../handlers/reminders');

module.exports = {
    name: "remindme",
    category: "misc",
    description: "Set a DM reminder",
    syntax: "rb remindme to [reminder message] in [# minutes/hours/days]",
    permissions: [],
    devOnly: true,
    aliases: ["rme"],
    run: async ({ client, message, args }) => {
        console.log("remindme");

        let argsString = args.join(" ");
        let desc;
        let timeString;

        //cases for command
        if (args.length === 0) {
            return message.channel.send("Error: invalid syntax")
        }
        else if (args[0] === "in") { //divide args into time/description parts
            if (argsString.indexOf("to") === -1) {
                return message.channel.send("Error: please include a reminder description (start desc with to)")
            }
            else {
                desc = argsString.slice(argsString.indexOf(" to ") + 3, argsString.length).trim()
                timeString = argsString.slice(3, argsString.indexOf(" to ")).trim()
                console.log(desc)
                console.log(timeString)
            }
        }
        else if (args[0] === "to") {
            if (argsString.lastIndexOf("in") === -1) {
                return message.channel.send("Error: please include when (start time with in)")
            }
            else {
                desc = argsString.slice(3, argsString.lastIndexOf(" in ")).trim()
                timeString = argsString.slice(argsString.lastIndexOf(" in ") + 3, argsString.length).trim()
                console.log(desc)
                console.log(timeString)
            }
        }
        else if (args[0] === "list") {
        }
        else if (args[0] === "remove") {
        }
        else {
            return message.channel.send("Error: invalid syntax")
        }

        if (desc === undefined || desc.length === 0 || desc.length > 255) {
            return message.channel.send("Error: invalid description")
        }

        //create date from time string
        let timeArr = timeString.split(" ")
        let mins = 0;
        let hours = 0;
        let days = 0;
        
        if ((timeArr.length % 2) !== 0 || timeArr.length === 0) {
            return message.channel.send("Error: invalid time");
        }

        for (let i = 0; i < timeArr.length; i += 2) {
            const num = Number(timeArr[i])
            if (!(Number.isSafeInteger(num) && num > 0)) {
                return message.channel.send("Error: invalid time")
            }
            else if (timeArr[i + 1] === 'minute' || timeArr[i + 1] === 'minutes') {
                mins = num
            }
            else if (timeArr[i + 1] === 'hour' || timeArr[i + 1] === 'hours') {
                hours = num
            }
            else if (timeArr[i + 1] === 'day' || timeArr[i + 1] === 'days') {
                days = num
            }
        }

        let r_date = new Date();
        r_date.setMinutes(r_date.getMinutes() + mins);
        r_date.setHours(r_date.getHours() - 6 + hours);
        r_date.setDate(r_date.getDate() + days);
        let r_dateSt = r_date.toISOString().replace("T", " ").replace(".", "-").slice(0, -2);
        r_dateSt = r_dateSt.slice(0, r_dateSt.lastIndexOf('-'))

        let reminder = {
            date: r_dateSt,
            authorID: message.author.id,
            rDesc: desc
        }

        const newReminder = await addReminder(client, reminder);
       
        if (r_date - Date.now() < 86400000) {
            loadReminder(client, newReminder)
        }
        
        if(newReminder !== undefined){
            return message.channel.send(`Success! Reminder created for <t:${newReminder.r_date.getTime()/1000}:F>`)
        }
        else{
            return message.channel.send("Error: Could not create reminder")
        }
        
    }
}
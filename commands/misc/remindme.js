const { addReminder, loadReminder, getUserReminders, deleteReminder } = require('../../handlers/reminders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "remindme",
    category: "misc",
    description: "Set a DM reminder",
    syntax: "rb remindme to [reminder message] in [# minutes/hours/days] | list | remove [reminder #]",
    permissions: [],
    devOnly: true,
    aliases: ["rme"],
    run: async ({ client, message, args }) => {
        console.log("remindme");

        let argsString = args.join(" ");
        let desc;
        let timeString;

        //cases for command
        if (args.length === 0) { //no args
            return message.channel.send("Error: please enter reminder details")
        }
        else if (args[0] === "in") { //divide args into time/description parts
            if (argsString.indexOf("to") === -1) {
                return message.channel.send("Error: please include a reminder description (start desc with to)")
            } else {
                desc = argsString.slice(argsString.indexOf(" to ") + 3, argsString.length).trim()
                timeString = argsString.slice(3, argsString.indexOf(" to ")).trim()
            }
        }
        else if (args[0] === "to") { //divide args into time/description parts
            if (argsString.lastIndexOf("in") === -1) {
                return message.channel.send("Error: please include when (start time with in)")
            } else {
                desc = argsString.slice(3, argsString.lastIndexOf(" in ")).trim()
                timeString = argsString.slice(argsString.lastIndexOf(" in ") + 3, argsString.length).trim()
            }
        }
        else if (args[0] === "list") { // show list of user's reminders
            let userReminders = await getUserReminders(client, message.author.id);
            if(userReminders.length === 0){
                return message.channel.send("You have no reminders")
            }

            let reminderList = ""; //format reminder list
            for(let i = 0; i < userReminders.length; i++){
                reminderList += `${i+1}: ${userReminders[i].r_desc} on <t:${userReminders[i].r_date.getTime() / 1000}:F> \n`
            }

            const Embed = new EmbedBuilder()
                .setColor(0x70d9ee)
                .setTitle(`${message.author.username}'s Reminders`)
                .setDescription(reminderList)
                .setTimestamp()
            return message.channel.send({ embeds: [Embed] });
        }
        else if (args[0] === "remove") { // remove a reminder
            let userReminders = await getUserReminders(client, message.author.id);
            const num = Number(args[1])
            if (!(Number.isSafeInteger(num) && num > 0 && num <= userReminders.length)) {
                return message.channel.send("Error: invalid reminder number")
            }
            let deleted = await deleteReminder(client, userReminders[num - 1].r_id)
            return message.channel.send(`Success! Removed reminder to ${deleted.r_desc} on <t:${deleted.r_date.getTime() / 1000}:F>`)
        }
        else {
            return message.channel.send("Error: invalid syntax")
        }

        if (desc === undefined || desc.length === 0 || desc.length > 255) {
            return message.channel.send("Error: invalid description")
        }

        //create date object from time string
        let timeArr = timeString.split(" ")
        let r_date = new Date();
        r_date.setHours(r_date.getHours());

        if ((timeArr.length % 2) !== 0 || timeArr.length === 0 || timeString === undefined) {
            return message.channel.send("Error: invalid time");
        }

        for (let i = 0; i < timeArr.length; i += 2) {
            const num = Number(timeArr[i])
            if (!(Number.isSafeInteger(num) && num > 0)) {
                return message.channel.send("Error: invalid time")
            }
            else if (timeArr[i + 1] === 'minute' || timeArr[i + 1] === 'minutes') {
                r_date.setMinutes(r_date.getMinutes() + num);
            }
            else if (timeArr[i + 1] === 'hour' || timeArr[i + 1] === 'hours') {
                r_date.setHours(r_date.getHours() + num);
            }
            else if (timeArr[i + 1] === 'day' || timeArr[i + 1] === 'days') {
                r_date.setDate(r_date.getDate() + num);
            }
        }

        let r_dateSt = r_date.toISOString().replace("T", " ").replace(".", "-").slice(0, -2);
        r_dateSt = r_dateSt.slice(0, r_dateSt.lastIndexOf('-'))

        // add reminder to database and load if less than 24 hrs
        let reminder = {
            date: r_dateSt,
            authorID: message.author.id,
            rDesc: desc
        }

        const newReminder = await addReminder(client, reminder);
        if (r_date - Date.now() < 86400000) {
            loadReminder(client, newReminder)
        }

        if (newReminder !== undefined) {
            return message.channel.send(`Success! Reminder created for <t:${newReminder.r_date.getTime() / 1000}:F>`)
        }
        else {
            return message.channel.send("Error: Could not create reminder")
        }

    }
}

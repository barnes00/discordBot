const { addReminder, loadReminder, getUserReminders, deleteReminder } = require('../../functions/reminders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "remindme",
    category: "misc",
    description: "Set a DM reminder",
    syntax: "rb remindme to [reminder message] in [# minutes/hours/days] | list | remove [reminder #]",
    permissions: [],
    devOnly: false,
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
            let userReminders = await getUserReminders(client, BigInt(message.author.id));
            if(userReminders.length === 0){
                return message.channel.send("You have no reminders")
            }

            let reminderList = ""; //format reminder list
            for(let i = 0; i < userReminders.length; i++){
                reminderList += `${i+1}: ${userReminders[i].reminder_message} on <t:${Math.trunc(userReminders[i].remind_on.getTime() / 1000)}:F> \n`
            }

            const Embed = new EmbedBuilder()
                .setColor(0x70d9ee)
                .setTitle(`${message.author.username}'s Reminders`)
                .setDescription(reminderList)
                .setTimestamp()
            return message.channel.send({ embeds: [Embed] });
        }
        else if (args[0] === "remove") { // remove a reminder
            let userReminders = await getUserReminders(client, BigInt(message.author.id));
            const num = Number(args[1])
            if (!(Number.isSafeInteger(num) && num > 0 && num <= userReminders.length)) {
                return message.channel.send("Error: invalid reminder number")
            }
            let deleted = await deleteReminder(client, userReminders[num - 1].reminder_id)
            return message.channel.send(`Success! Removed reminder to ${deleted.reminder_message} on <t:${deleted.remind_on.getTime() / 1000}:F>`)
        }
        else {
            return message.channel.send("Error: invalid syntax")
        }

        if (desc === undefined || desc.length === 0 || desc.length > 255) {
            return message.channel.send("Error: invalid description length")
        }

        //create date object from time string
        let timeArr = timeString.split(" ")
        let reminder_date = new Date();
       
        if ((timeArr.length % 2) !== 0 || timeArr.length === 0 || timeString === undefined) {
            return message.channel.send("Error: invalid time");
        }

        for (let i = 0; i < timeArr.length; i += 2) {
            const num = Number(timeArr[i])
            if (!(Number.isSafeInteger(num) && num > 0)) {
                return message.channel.send("Error: invalid time")
            }
            else if (timeArr[i + 1] === 'minute' || timeArr[i + 1] === 'minutes') {
                reminder_date.setMinutes(reminder_date.getMinutes() + num);
            }
            else if (timeArr[i + 1] === 'hour' || timeArr[i + 1] === 'hours') {
                reminder_date.setHours(reminder_date.getHours() + num);
            }
            else if (timeArr[i + 1] === 'day' || timeArr[i + 1] === 'days') {
                reminder_date.setDate(reminder_date.getDate() + num);
            }
        }

        // add reminder to database and load if less than 24 hrs
        let reminder = {
            reminder_date: reminder_date,
            creator_id: BigInt(message.author.id),
            reminder_message: desc
        }

        const newReminder = await addReminder(client, reminder);
        if (reminder_date - Date.now() < 86400000) {
            loadReminder(client, newReminder)
        }
        
        if (newReminder !== undefined) {
            return message.channel.send(`Success! Reminder created for <t:${Math.trunc(newReminder.remind_on.getTime() / 1000)}:F>`)
        }
        else {
            return message.channel.send("Error: Could not create reminder")
        }

    }
}

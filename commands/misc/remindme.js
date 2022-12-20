const { addReminder } = require('./handlers/reminders');

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

        let arrayCopy = [...args];
        let r_date;
        let desc = "test";

        r_date = new Date();
        r_date.setSeconds(r_date.getSeconds() + 10);
        r_date.setHours(r_date.getHours() - 6);
        r_date = r_date.toISOString().replace("T", " ").replace(".", "-").slice(0, -2);
        r_date = r_date.slice(0, r_date.lastIndexOf('-'))

        let reminder = {
            date: r_date, 
            authorID: message.authorID, 
            remDesc: desc
        }

        addReminder(client, reminder);

        // console.log(typeof(propDate), propDate)//create reminder 1m into the future lol
        // //insert
        // //const text1 = `INSERT INTO reminders VALUES(DEFAULT, NOW(), '358818065863147521', 'test desc now')`
        // const text2 = `INSERT INTO reminders VALUES(DEFAULT, '${propDate}', '358818065863147521', 'test desc 10s')`

        

    }
}
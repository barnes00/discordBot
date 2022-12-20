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

        const remind_date = new Date();
        remind_date.setSeconds(remind_date.getSeconds() + 10);
        remind_date.setHours(remind_date.getHours() - 6);
        let propDate = remind_date.toISOString().replace("T", " ").replace(".", "-").slice(0, -2);
        propDate = propDate.slice(0, propDate.lastIndexOf('-'))
        console.log(typeof(propDate), propDate)
        //create reminder 1m into the future lol
        // insert
        //const text1 = `INSERT INTO reminders VALUES(DEFAULT, NOW(), '358818065863147521', 'test desc now')`
        const text2 = `INSERT INTO reminders VALUES(DEFAULT, '${propDate}', '358818065863147521', 'test desc 10s')`

        // callback
        // client.dbClient.query(text1, (err, res) => {
        //     if (err) {
        //         console.log(err.stack)
        //     } else {
        //         //console.log(res)
        //     }
        // })
        client.dbClient.query(text2, (err, res) => {
            if (err) {
                console.log(err.stack)
            } else {
                //console.log(res)
            }
        })

    }
}
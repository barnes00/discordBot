const pg = require('pg')

const deleteReminder = (client) => {
}

const addReminder = (client) => {
}

const loadReminders = (client) => {
    setInterval(function () { createReminders(client); }, 10000); //86400 for day

    async function createReminders(client) {
        let remindersToday;
        // get todays reminders
        try {
            const res = await client.dbClient.query("SELECT * FROM reminders WHERE NOW() < reminder_date::timestamp AND reminder_date::timestamp - NOW() <= interval '10 seconds' ORDER BY reminder_date")
            remindersToday = res.rows;
        } catch (err) {
            console.log(err.stack)
        }

        console.log(remindersToday)
        for (let i = 0; i < remindersToday.length; i++) {

            let id = remindersToday[i].id;
            let user = await client.users.fetch(remindersToday[i].authorid);
            let remText = remindersToday[i].r_desc;
            let date = new Date(remindersToday[i].reminder_date);
            let seconds = Math.round(date - Date.now())
            console.log(seconds)

            const reminder = setTimeout(() => {
                console.log("send rem")
                user.send(remText)
                client.dbClient.query(`DELETE FROM reminders WHERE id=${id};`, (err, res) => {
                    if (err) {
                        console.log(err.stack)
                    } else {
                        console.log(res.rows)
                    }
                })
            }, seconds)
        }
    }
}

module.exports = {
    loadReminders
}

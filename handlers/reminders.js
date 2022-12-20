const addReminder = async (client, reminder) => { // add reminder to database
    const { date, authorID, remDesc } = reminder;
    const query = 'INSERT INTO reminders(r_id, r_date, author_id, r_desc) VALUES(DEFAULT, $1, $2, $3) RETURNING *';
    const values = [date, authorID, remDesc];

    try {
        const res = await client.dbClient.query(query, values)
        console.log("added", res.rows)
        // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
    } catch (err) {
        console.log(err.stack)
    }
}

const loadReminder = async (client, reminder) => { // create active reminder
    let user = await client.users.fetch(reminder.author_id);
    let date = new Date(reminder.r_date);
    let timeUntil = Math.round(date - Date.now())

    const reminder = setTimeout(() => {
        console.log("send rem")
        user.send(reminder.r_desc)
        deleteReminder(client, reminder.r_id);

    }, timeUntil)

    client.reminders.set(remID, reminder)
    console.log("rem loaded")

}

const deleteReminder = async (client, remID) => { // delete reminder
    try {
        const res = await client.dbClient.query("DELETE FROM reminders WHERE r_id= $1", [remID])
    } catch (err) {
        console.log(err)
    }

    if (client.reminders.has(remID)) { //delete if reminder is active
        clearTimeout(client.reminders.get(remID))
        client.reminders.delete(remID)
    }
    console.log("rem deleted")

}

const loadReminders = (client) => { // create active reminders for today
    setInterval(async (client) => {
        let reminders = [];
        clearReminders();
        // get todays reminders
        try {
            const res = await client.dbClient.query("SELECT * FROM reminders WHERE NOW() < r_date::timestamp AND r_date::timestamp - NOW() <= interval '10 seconds' ORDER BY reminder_date")
            reminders = res.rows;
        } catch (err) {
            console.log(err)
        }

        console.log(reminders)
        for (let i = 0; i < reminders.length; i++) {
            loadReminder(client, reminders[i])
        }
        console.log("Reminders loaded")
    }, 10000) //86400 for day
}

const clearReminders = async () => { // clear old reminders
    try {
        const res = await client.dbClient.query("DELETE * FROM reminders WHERE NOW() > r_date::timestamp")
    } catch (err) {
        console.log(err)
    }

}

module.exports = {
    addReminder,
    loadReminder,
    deleteReminder,
    loadReminders
}

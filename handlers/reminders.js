const addReminder = async (client, reminder) => { // add reminder to database
    const { date, authorID, rDesc } = reminder;
    const query = 'INSERT INTO reminders(r_id, r_date, author_id, r_desc) VALUES(DEFAULT, $1, $2, $3) RETURNING *';
    const values = [date, authorID, rDesc];
    let res;
    try {
        const res = await client.dbClient.query(query, values)
        console.log("added", res.rows[0])
        return res.rows[0];
    } catch (err) {
        console.log(err.stack)
    }
    
}

const loadReminder = async (client, reminder) => { // create active reminder
    let user = await client.users.fetch(reminder.author_id);
    let date = new Date(reminder.r_date);
    let timeUntil = Math.round(date - Date.now())

    if(client.reminders.has(reminder.r_id)){
        return;
    }

    const newReminder = setTimeout(() => {
        console.log("send rem")
        user.send(reminder.r_desc)
        deleteReminder(client, reminder.r_id);

    }, timeUntil)

    client.reminders.set(reminder.r_id, newReminder)
    console.log("rem loaded")

}

const deleteReminder = async (client, r_id) => { // delete reminder
    try {
        const res = await client.dbClient.query("DELETE FROM reminders WHERE r_id= $1", [r_id])
    } catch (err) {
        console.log(err)
    }

    if (client.reminders.has(r_id)) { //delete if reminder is active
        clearTimeout(client.reminders.get(r_id))
        client.reminders.delete(r_id)
    }
    console.log("rem deleted")

}

const loadReminders = async (client) => { // create active reminders for today
        let reminders = [];
        clearReminders(client);
        // get todays reminders
        try {
            const res = await client.dbClient.query("SELECT * FROM reminders WHERE NOW() < r_date::timestamp AND r_date::timestamp - NOW() <= interval '24 hours' ORDER BY r_date")
            reminders = res.rows;
        } catch (err) {
            console.log(err)
        }

        console.log(reminders)
        for (let i = 0; i < reminders.length; i++) {
            loadReminder(client, reminders[i])
        }
        console.log("Reminders loaded")
        setTimeout(loadReminders, 86400000, client) //repeat every 24 hrs
}

const clearReminders = async (client) => { // clear old reminders
    try {
        const res = await client.dbClient.query("DELETE FROM reminders WHERE NOW() > r_date::timestamp")
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

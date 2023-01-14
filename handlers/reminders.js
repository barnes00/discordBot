const addReminder = async (client, reminder) => { // add reminder to database
    const { reminder_date, creator_id, reminder_message } = reminder;

    const userQuery = 'INSERT INTO users(user_id) VALUES($1) ON CONFLICT (user_id) DO NOTHING RETURNING *';
    const userValue = [creator_id];
    try {
        const res = await client.dbClient.query(userQuery, userValue)
    } catch (err) {
        console.log(err.stack)
    }

    const reminderQuery = 'INSERT INTO reminders(reminder_id, remind_on, creator_id, reminder_message) VALUES(DEFAULT, $1, $2, $3) RETURNING *';
    const reminderValues = [reminder_date, creator_id, reminder_message];
    try {
        const res = await client.dbClient.query(reminderQuery, reminderValues)
        return res.rows[0];
    } catch (err) {
        console.log(err.stack)
    }
}

const loadReminder = async (client, reminder) => { // create active reminder
    let user = await client.users.fetch(String(reminder.creator_id));
    let date = new Date(reminder.remind_on);
    let timeUntil = Math.round(date - Date.now())

    if (client.reminders.has(reminder.reminder_id)) {
        return;
    }

    const newReminder = setTimeout(() => {
        console.log("send rem")
        try{
            user.send(reminder.reminder_message)
        }
        catch(err){
            console.log(err);
        }
        
        deleteReminder(client, reminder.reminder_id);

    }, timeUntil)

    client.reminders.set(reminder.reminder_id, newReminder)
}

const deleteReminder = async (client, reminder_id) => { // delete reminder
    let deleted;
    try {
        const res = await client.dbClient.query("DELETE FROM reminders WHERE reminder_id= $1 RETURNING *", [reminder_id])
        deleted = res.rows[0];
    } catch (err) {
        console.log(err);
    }

    if (client.reminders.has(reminder_id)) { //delete if reminder is active
        clearTimeout(client.reminders.get(reminder_id));
        client.reminders.delete(reminder_id);
    }
    console.log("rem deleted");
    return deleted;
}

const loadReminders = async (client) => { // create active reminders for today
    let reminders = [];
    clearReminders(client);
    // get todays reminders
    try {
        const res = await client.dbClient.query("SELECT * FROM reminders WHERE NOW() < remind_on::timestamp AND remind_on::timestamp - NOW() <= interval '24 hours' ORDER BY remind_on")
        reminders = res.rows;
    } catch (err) {
        console.log(err)
    }

    for (let i = 0; i < reminders.length; i++) {
        loadReminder(client, reminders[i])
    }
    console.log("Reminders loaded")
    setTimeout(loadReminders, 86400000, client) //repeat every 24 hrs
}

const clearReminders = async (client) => { // clear old reminders
    let failedReminders;
    try {
        const res = await client.dbClient.query("DELETE FROM reminders WHERE NOW() > remind_on::timestamp RETURNING *")
        failedReminders = res.rows;
    } catch (err) {
        console.log(err)
    }

    for (let i = 0; i < failedReminders.length; i++) { //notify failed reminders
        let failedRem = failedReminders[i];
        let user = await client.users.fetch(failedRem.creator_id);
        try{
            user.send(`Reminder failed to send: ${failedRem.reminder_message} on <t:${failedRem.remind_on.getTime() / 1000}:F>`)
        }
        catch(err){
            console.log(err);
        }

    }
}

const getUserReminders = async (client, creator_id) => { // get all reminders for a user
    try {
        const res = await client.dbClient.query("SELECT * FROM reminders WHERE creator_id= $1 ORDER BY remind_on", [creator_id])
        return res.rows;
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    addReminder,
    loadReminder,
    deleteReminder,
    loadReminders,
    getUserReminders
}

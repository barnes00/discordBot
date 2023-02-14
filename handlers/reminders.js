const { clearReminders, loadReminder } = require('../functions/reminders');

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

module.exports = {
    loadReminders
}

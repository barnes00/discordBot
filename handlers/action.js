const incrementActionCounter = async (client, actionType, sender, receiver) => { // increment action counter

    const senderQuery = 'INSERT INTO users(user_id) VALUES($1) ON CONFLICT (user_id) DO NOTHING RETURNING *';
    const senderValue = [sender];
    try {
        const res = await client.dbClient.query(senderQuery, senderValue)
    } catch (err) {
        console.log(err.stack)
    }

    const receiverQuery = 'INSERT INTO users(user_id) VALUES($1) ON CONFLICT (user_id) DO NOTHING RETURNING *';
    const receiverValue = [receiver];
    try {
        const res = await client.dbClient.query(receiverQuery, receiverValue)
    } catch (err) {
        console.log(err.stack)
    }

    let action_type_id;
    const actionQuery = 'SELECT action_type_id FROM action_types WHERE action_name=$1';
    const actionValue = [actionType];
    try {
        const res = await client.dbClient.query(actionQuery, actionValue)
        action_type_id = res.rows[0].action_type_id;
    } catch (err) {
        console.log(err.stack)
    }
    
    const counterQuery = 'INSERT INTO action_counters(action_counter_id, action_type_id, sender_id, receiver_id, count) VALUES(DEFAULT, $1, $2, $3, 1) ON CONFLICT (action_type_id, sender_id, receiver_id) DO UPDATE SET count = action_counters.count + 1 RETURNING *';
    const counterValues = [action_type_id, sender, receiver];
    try {
        const res = await client.dbClient.query(counterQuery, counterValues)
        return res.rows[0].count;
    } catch (err) {
        console.log(err.stack)
    }
}

module.exports = {
    incrementActionCounter
}

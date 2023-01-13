const { Client } = require('pg')

const initDatabase = () => { 
    const dbClient = new Client({
        host: 'localhost',
        port: 5432,
        database: process.env.DB_NAME,
        user: process.env.DB_USER_NAME,
        password: process.env.DB_USER_PW,
    })
    
    dbClient.connect((err) => {
        if (err) {
            console.error('connection error', err.stack)
        } else {
            console.log('Database connected')
        }
    })

    return dbClient;
}

module.exports = {
    initDatabase
}

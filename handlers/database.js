const { Client } = require('pg')

const initDatabase = () => { 
    const dbClient = new Client({
        host: 'localhost',
        port: 5432,
        database: 'test',
        user: 'postgres',
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

const { Pool, Client } = require('pg');
const { updateScores } = require('../routes/queries')

const pool = new Pool({
    user:'nshryock',
    host: 'localhost',
    database: 'propbets_api',
    password: 'rock10den',
    port: 5432,
    connectionTimeoutMillis : 5000,
    idleTimeoutMillis : 30000
});

const listener = new Client({
    user:'nshryock',
    host: 'localhost',
    database: 'propbets_api',
    password: 'rock10den',
    port: 5432,
    connectionTimeoutMillis : 5000,
    idleTimeoutMillis : 30000
});


module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback);
    },
    listener
}
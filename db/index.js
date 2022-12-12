const { Pool } = require('pg');

const pool = new Pool({
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
    }
}
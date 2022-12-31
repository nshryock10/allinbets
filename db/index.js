const { Pool, Client } = require('pg');
const { updateScores } = require('../routes/queries')

const devPool = new Pool({
    user:'nshryock',
    host: 'localhost',
    database: 'propbets_api',
    password: 'rock10den',
    port: 5432,
    connectionTimeoutMillis : 5000,
    idleTimeoutMillis : 30000
});

const prodPool = new Pool({ // create connection to database
    connectionString: process.env.DATABASE_URL,	// use DATABASE_URL environment variable from Heroku app 
    ssl: {
      rejectUnauthorized: false // don't check for SSL cert
    }
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

const prodListener = new Client({
    connectionString: process.env.DATABASE_URL,	// use DATABASE_URL environment variable from Heroku app 
    ssl: {
      rejectUnauthorized: false // don't check for SSL cert
    }
});


module.exports = {
    query: (text, params, callback) => {
        return prodPool.query(text, params, callback);
    },
    listener,
    prodListener
}
const config = require('../../config/config.js');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Questions',
  password: config.TOKEN,
  port: 5432
});

pool.connect((err, res) => {
  if (err) {
    throw err;
  } else {
    console.log('Connected to database');
  }
});

module.exports = pool;
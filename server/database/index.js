const config = require('../../config/config.js');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'ubuntu',
  host: 'ec2-18-221-137-102.us-east-2.compute.amazonaws.com',
  database: 'questions',
  password: config.TOKEN,
  port: '5432'
});

pool.connect((err, res) => {
  if (err) {
    throw err;
  } else {
    console.log('Connected to database');
  }
});

module.exports = pool;
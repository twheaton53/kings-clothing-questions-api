const config = require('../../../config/config.js');
const { Client, Pool } = require('pg');
const copyFrom = require('pg-copy-streams').from
const fs = require('fs');
const path = require('path');

const csv = require('csv-parser');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'Questions',
  password: config.TOKEN,
  port: 5432
});

client.connect(() => console.log('Connected!'));

const jsonPath = path.join(__dirname, 'questions.csv');
const tableName = 'questions';

const createTable = `
  DROP TABLE IF EXISTS ${tableName}
  CREATE TABLE IF NOT EXISTS ${tableName} (
    ID SERIAL PRIMARY KEY,
    PRODUCT_ID INT NOT NULL,
    BODY VARCHAR(1000) NOT NULL,
    DATE TIMESTAMP NOT NULL,
    NAME VARCHAR(60) NOT NULL,
    HELPFULNESS INT,
    REPORTED BOOLEAN,
    EMAIL VARCHAR(60) NOT NULL
  );`;


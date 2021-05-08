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
  DROP TABLE IF EXISTS ${tableName};
  CREATE TABLE IF NOT EXISTS ${tableName} (
    QUESTION_ID SERIAL PRIMARY KEY,
    PRODUCT_ID INT NOT NULL,
    BODY VARCHAR(1000) NOT NULL,
    DATE TIMESTAMP NOT NULL,
    NAME VARCHAR(60) NOT NULL,
    EMAIL VARCHAR(60) NOT NULL,
    REPORTED BOOLEAN,
    HELPFULNESS INT
  );`;

client.query(createTable)
    .then((res) => {
      console.log('Table successfully created!')
    })
    .catch((err) => {
      throw err;
    });

const stream = client.query(copyFrom(`COPY ${tableName} FROM STDIN DELIMITER ',' CSV HEADER`));

const fileStream = fs.createReadStream(jsonPath);

console.time('Execution Time');

fileStream.on('error', (error) => {
  console.log(`Error in reading file ${error}`);
})
stream.on('error', (error) => {
  console.log(`Error in copy command ${error}`);
})
stream.on('finish', () => {
  console.log(`Completed loading data into ${tableName}`);
  client.end();
})

fileStream.on('open', () => fileStream.pipe(stream));
fileStream.on('end', () => {
  console.log('Stream ended');
  console.timeEnd('Execution Time');
});
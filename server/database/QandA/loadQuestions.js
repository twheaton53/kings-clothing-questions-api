const config = require('../../../config/config.js');
const { Client, Pool } = require('pg');
const copyFrom = require('pg-copy-streams').from
const fs = require('fs');
const path = require('path');

const csv = require('csv-parser');

const client = new Client({
  user: 'ubuntu',
  host: 'ec2-18-188-53-43.us-east-2.compute.amazonaws.com',
  database: 'questions',
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

const alterTable = `
ALTER TABLE ${tableName}
DROP COLUMN QUESTION_ID,
ADD COLUMN QUESTION_ID SERIAL PRIMARY KEY;
DROP INDEX IF EXISTS questions_idx;
CREATE INDEX IF NOT EXISTS questions_idx ON ${tableName} (product_id);
`;

stream.on('finish', () => {
  console.log(`Completed loading data into ${tableName}`);
  console.log('Starting alter table');
    console.time('Alter execution time');
    client.query(alterTable).then(() => {
      console.log('Altered successfully!');
      console.timeEnd('Alter execution time');
      client.end();
    })
    .catch((err) => {
      console.error(err);
    })
});

fileStream.on('open', () => fileStream.pipe(stream));
fileStream.on('end', () => {
  console.log('Stream ended');
  console.timeEnd('Execution Time');
});
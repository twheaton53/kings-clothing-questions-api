const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const queries = require('./database/dbQueries.js');
const app = express();
const PORT = 3000;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded( { extended: true } ));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.get('/questions/:product_id', (req, res) => {
  console.log('received get request');
  queries.getQuestions(req.params.product_id, res);
})
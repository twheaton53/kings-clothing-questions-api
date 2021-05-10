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

app.get('/qa/questions/:product_id', (req, res) => {
  queries.getQuestions(req, res);
});

app.get('/qa/answers/:question_id', (req, res) => {
  queries.getAnswers(req, res);
});

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  queries.updateQuestionHelpfulness(req, res);
});

app.put('/qa/questions/:question_id/report', (req, res) => {
  queries.reportQuestion(req, res);
});

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  queries.updateAnswerHelpfulness(req, res);
});

app.put('/qa/answers/:answer_id/report', (req, res) => {
  queries.reportAnswer(req, res);
});

app.post('/qa/questions', (req, res) => {
  queries.postQuestion(req, res);
});

app.post('/qa/answers', (req, res) => {
  queries.postAnswer(req, res);
});
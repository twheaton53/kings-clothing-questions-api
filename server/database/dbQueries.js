const pg = require('pg');
const db = require('./index.js');

module.exports = {

  // Requires product_id, get all questions determined by product_id
  getQuestions: (req, res) => {
    const product_id = req.params.product_id;
    const count = req.query.count || 5;
    const page = req.query.page || 1;
    const offset = count * page - count;
    db.query(`SELECT * FROM questions WHERE product_id = ${product_id} ORDER BY helpfulness DESC LIMIT '${count}' OFFSET '${offset}';`, (err, data) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(data.rows);
        res.end();
      }
    });
  },

  // Requires question_id, get all answers determined by question_id
  getAnswers: (req, res) => {
    const question_id = req.params.question_id;
    const count = req.query.count || 5;
    const page = req.query.page || 1;
    const offset = count * page - count;
    db.query(`SELECT * FROM answers WHERE question_id = ${question_id} ORDER BY helpfulness DESC LIMIT '${count}' OFFSET '${offset}';`, (err, data) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(data.rows);
        res.end();
      }
    });
  },

  // Requires answer_id, get all photos determined by answer_id
  getPhotos: (req, res) => {

  },

  updateQuestionHelpfulness: (req, res) => {
    const question_id = req.params.question_id;
    db.query(`UPDATE questions SET helpfulness = helpfulness + 1 WHERE question_id = ${question_id};`, (err, data) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(204).end();
      }
    });
  },

  reportQuestion: (req, res) => {
    const question_id = req.params.question_id;
    db.query(`UPDATE questions SET reported = true WHERE question_id = ${question_id};`, (err, data) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(204).end();
      }
    });
  },

  updateAnswerHelpfulness: (req, res) => {
    const answer_id = req.params.answer_id;
    db.query(`UPDATE answers SET helpfulness = helpfulness + 1 WHERE answer_id = ${answer_id};`, (err, data) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(204).end();
      }
    })
  },

  reportAnswer: (req, res) => {
    const answer_id = req.params.answer_id;
    db.query(`UPDATE answers SET reported = true WHERE answer_id = ${answer_id};`, (err, data) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(204).end();
      }
    });
  },

  post: (req, res) => {

  },
}
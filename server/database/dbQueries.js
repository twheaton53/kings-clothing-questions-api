const pg = require('pg');
const db = require('./index.js');

module.exports = {

  // Requires product_id, get all questions determined by product_id
  getQuestions: (product_id, res) => {
    console.log(product_id);
    db.query(`SELECT * FROM questions WHERE product_id::TEXT LIKE '${product_id}' LIMIT 5;`, (err, data) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(data.rows);
      }
    });
  },

  // Requires question_id, get all answers determined by question_id
  getAnswers: (req, res) => {

  },

  // Requires answer_id, get all photos determined by answer_id
  getPhotos: (req, res) => {

  },

  post: (req, res) => {

  },
}
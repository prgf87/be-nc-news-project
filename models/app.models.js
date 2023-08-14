const db = require('../db/connection');
const { readFile } = require('node:fs/promises');

const fetchAllTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

const fetchEndPoints = () => {
  return readFile('endpoints.json', 'utf-8').then((file) => {
    return JSON.parse(file);
  });
};

const fetchArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = ${id}`)
    .then(({ rows }) => {
      const id = rows[0];

      return id;
    });
};

module.exports = { fetchAllTopics, fetchEndPoints, fetchArticleById };

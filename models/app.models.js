const db = require('../db/connection');
const { readFile } = require('node:fs/promises');

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

const fetchEndPoints = () => {
  return readFile('endpoints.json', 'utf-8').then((file) => {
    return JSON.parse(file);
  });
};

const fetchArticles = () => {
  return db.query(`SELECT * FROM articles`).then(({ rows }) => {
    return rows;
  });
};

module.exports = { fetchTopics, fetchEndPoints, fetchArticles };

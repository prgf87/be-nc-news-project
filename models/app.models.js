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

const fetchArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = ${id}`)
    .then(({ rows }) => {
      const id = rows[0];
      if (!id) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      }
      return id;
    });
};

const fetchArticles = () => {
  return db
    .query(
      `
    SELECT *, COUNT(articles.article_id) as comment_count
    FROM articles
    JOIN comments ON comments.article_id = articles.article_id 
    WHERE articles.article_id = comments.article_id
    GROUP BY articles.article_id, comments.comment_id
    ORDER BY articles.created_at DESC
    `
    )
    .then(({ rows }) => {
      return { rows };
    });
};

module.exports = {
  fetchTopics,
  fetchEndPoints,
  fetchArticles,
  fetchArticleById,
};

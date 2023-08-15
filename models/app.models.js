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
      if (!id) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      }
      return id;
    });
};

const fetchCommentsByArticleID = (id) => {
  return db
    .query(
      `
    SELECT * FROM comments 
    LEFT JOIN articles ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    ORDER BY comments.created_at ASC
  `,
      [id]
    )
    .then(({ rows }) => {
      const result = rows;
      if (result === []) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      }
      return rows;
    });
};

module.exports = {
  fetchAllTopics,
  fetchEndPoints,
  fetchArticleById,
  fetchCommentsByArticleID,
};

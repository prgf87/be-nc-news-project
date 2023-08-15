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
const fetchArticles = () => {
  return db
    .query(
      `
    SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC
  `
    )
    .then(({ rows }) => {
      return rows;
    });
};

module.exports = {
  fetchEndPoints,
  fetchArticleById,
  fetchCommentsByArticleID,
  fetchTopics,
  fetchEndPoints,
  fetchArticles,
  fetchArticleById,
};

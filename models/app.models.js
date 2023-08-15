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

const putNewComment = (newComment, id) => {
  const { username, body } = newComment;
  return db
    .query(
      `
      INSERT INTO comments(body, author, article_id)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [body, 1, id]
    )
    .then(({ rows }) => {
      console.log(rows);
      return rows;
    });
};

module.exports = {
  fetchTopics,
  fetchEndPoints,
  fetchArticles,
  fetchArticleById,
  putNewComment,
};

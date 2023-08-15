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
  return db
    .query(
      `
    SELECT *,
    SUM(comments.article_id) as comment_count
    FROM articles
    JOIN comments ON comments.article_id = articles.article_id 
    WHERE articles.article_id = comments.article_id
    GROUP BY articles.article_id, comments.comment_id
    ORDER BY articles.article.date ASC
    `
    )
    .then(({ rows }) => {
      console.log(rows);
      const comment_count = rows.length;
      return { rows: rows, comment_count: comment_count };
    });
};

module.exports = { fetchTopics, fetchEndPoints, fetchArticles };

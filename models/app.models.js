const db = require("../db/connection");
const { readFile } = require("node:fs/promises");
const users = require("../db/data/test-data/users");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

const fetchEndPoints = () => {
  return readFile("endpoints.json", "utf-8").then((file) => {
    return JSON.parse(file);
  });
};

const fetchArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = ${id}`)
    .then(({ rows }) => {
      const id = rows[0];
      if (!id) {
        return Promise.reject({ status: 404, msg: "Not found" });
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
      if (!result.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows;
    });
};
const fetchArticles = (query) => {
  const { topic, sort_by, order_by } = query;
  const acceptedTopics = ["mitch", "cats", "paper"];
  const acceptedOrderBy = ["DESC", "ASC"];
  const acceptedSortBy = [
    "date",
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "body",
  ];
  let sortBy = "created_at";
  let orderBy = "DESC";

  let baseStr = `
  SELECT articles.*, COUNT(comments.article_id) AS comment_count 
  FROM articles
  LEFT JOIN comments 
  ON comments.article_id = articles.article_id `;

  if (!acceptedTopics.includes(topic) && topic !== undefined) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  } else if (acceptedTopics.includes(topic)) {
    baseStr += `    
    WHERE articles.topic = topic AND topic = '${topic}' `;
  }

  if (!acceptedSortBy.includes(sortBy) && sort_by !== undefined) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  } else if (sort_by) {
    sortBy = sort_by;
  }

  if (!acceptedOrderBy.includes(orderBy) && order_by !== undefined) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  } else if (order_by) {
    orderBy = order_by.toUpperCase();
  }

  baseStr += `    
    GROUP BY articles.article_id
    ORDER BY articles.${sortBy} ${orderBy}
  `;

  return db.query(baseStr).then(({ rows }) => {
    return rows;
  });
};

const updateArticle = (votes, id) => {
  const { inc_votes } = votes;
  return db
    .query(
      `
      UPDATE articles  
      SET
      votes = $1
      WHERE
      article_id = $2
      RETURNING *;
    `,
      [inc_votes, id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      }
      return rows[0];
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
      [body, username, id]
    )
    .then(({ rows }) => {
      return rows[0];
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
  updateArticle,
  putNewComment,
};

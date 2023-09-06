const { response } = require("../app");
const endpoints = require("../endpoints.json");

const {
  fetchTopics,
  fetchArticles,
  fetchArticleById,
  fetchCommentsByArticleID,
  updateArticle,
  putNewComment,
  removeComment,
  fetchUsers,
  fetchUserByUsername,
  updateComment,
} = require("../models/app.models");

const getTopics = (_, response, next) => {
  fetchTopics()
    .then((topics) => {
      response.status(200).send({ topics: topics });
    })
    .catch(next);
};

const getEndPoints = (_, response) => {
  response.status(200).send({ endpoints });
};

const getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
};

const getArticleComments = (request, response, next) => {
  // response.status(318).send();
  const { article_id } = request.params;
  fetchCommentsByArticleID(article_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch(next);
};

const getArticles = (request, response, next) => {
  const { query } = request;
  fetchArticles(query)
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch(next);
};

const getUsers = (_, response, next) => {
  fetchUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch(next);
};

const getUserByUsername = (request, response, next) => {
  const { username } = request.params;
  fetchUserByUsername(username)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch(next);
};

const postCommentByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  const newComment = request.body;
  putNewComment(newComment, article_id)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch(next);
};

const patchComment = (request, response, next) => {
  const { comment_id } = request.params;
  const newVote = response.req.body;
  updateComment(newVote, comment_id)
    .then((comment) => {
      response.status(200).send({ comment });
    })
    .catch(next);
};

const deleteComment = (request, response, next) => {
  const { comment_id } = request.params;
  removeComment(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch(next);
};

const patchArticle = (request, response, next) => {
  const { article_id } = request.params;
  const newVote = response.req.body;
  updateArticle(newVote, article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
};

module.exports = {
  getTopics,
  getEndPoints,
  getArticleById,
  getArticles,
  postCommentByArticleId,
  getArticleComments,
  deleteComment,
  patchArticle,
  getUsers,
  getUserByUsername,
  patchComment,
};

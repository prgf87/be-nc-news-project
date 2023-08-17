const {
  fetchTopics,
  fetchEndPoints,
  fetchArticles,
  fetchArticleById,
  fetchCommentsByArticleID,
  updateArticle,
  putNewComment,
  removeComment,
  fetchUsers,
} = require("../models/app.models");

const getTopics = (_, response, next) => {
  fetchTopics()
    .then((topics) => {
      response.status(200).send({ topics: topics });
    })
    .catch(next);
};

const getEndPoints = (_, response, next) => {
  fetchEndPoints()
    .then((endpoints) => {
      response.status(200).send({ endpoints });
    })
    .catch(next);
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
  const { article_id } = request.params;
  fetchCommentsByArticleID(article_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch(next);
};

const getArticles = (_, response, next) => {
  fetchArticles()
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

const postCommentByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  const newComment = request.body;
  putNewComment(newComment, article_id)
    .then((comment) => {
      response.status(201).send({ comment });
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
};

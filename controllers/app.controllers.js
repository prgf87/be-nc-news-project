const {
  fetchTopics,
  fetchEndPoints,
  fetchArticles,
  fetchArticleById,
  fetchCommentsByArticleID,
  putNewComment,
  removeComment,
} = require('../models/app.models');

const getTopics = (request, response, next) => {
  fetchTopics()
    .then((topics) => {
      response.status(200).send({ topics: topics });
    })
    .catch(next);
};

const getEndPoints = (request, response, next) => {
  fetchEndPoints()
    .then((endpoints) => {
      response.status(200).send(endpoints);
    })
    .catch(next);
};

const getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleById(article_id)
    .then((data) => {
      response.status(200).send({ article: data });
    })
    .catch(next);
};

const getArticleComments = (request, response, next) => {
  const { article_id } = request.params;
  fetchCommentsByArticleID(article_id)
    .then((data) => {
      response.status(200).send({ comments: data });
    })
    .catch(next);
};

const getArticles = (request, response, next) => {
  fetchArticles()
    .then((articles) => {
      response.status(200).send({ articles: articles });
    })
    .catch(next);
};

const postCommentByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  const newComment = request.body;
  putNewComment(newComment, article_id)
    .then((comment) => {
      response.status(201).send({ comment: comment });
    })
    .catch(next);
};

const deleteComment = (request, response, next) => {
  const { commnent_id } = request.params;
  removeComment(commnent_id)
    .then(() => {
      response.status(204).send();
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
};

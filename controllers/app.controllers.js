const {
  fetchAllTopics,
  fetchEndPoints,
  fetchArticleById,
  fetchCommentsByArticleID,
} = require('../models/app.models');

const getTopics = (request, response, next) => {
  fetchAllTopics()
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

module.exports = {
  getTopics,
  getEndPoints,
  getArticleById,
  getArticleComments,
};

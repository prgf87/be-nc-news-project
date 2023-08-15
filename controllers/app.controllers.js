const {
  fetchTopics,
  fetchEndPoints,
  fetchArticles,
  fetchArticleById,
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

const getArticles = (request, response, next) => {
  fetchArticles()
    .then((articles) => {
      response.status(200).send({ articles: articles });
    })
    .catch(next);
};

module.exports = { getTopics, getEndPoints, getArticleById, getArticles };

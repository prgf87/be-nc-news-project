const {
  fetchTopics,
  fetchEndPoints,
  fetchArticles,
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

const getArticles = (request, response, next) => {
  fetchArticles()
    .then((articles) => {
      console.log(articles);
      response.status(200).send({ articles: articles });
    })
    .catch(next);
};

module.exports = { getTopics, getEndPoints, getArticles };

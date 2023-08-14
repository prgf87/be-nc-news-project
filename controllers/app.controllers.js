const { fetchAllTopics } = require('../models/app.models');

const getTopics = (request, response, next) => {
  fetchAllTopics()
    .then((topics) => {
      response.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticleById = (request, response, next) => {
  console.log('we are here!');
  response.status(200).send();
};

module.exports = { getTopics, getArticleById };

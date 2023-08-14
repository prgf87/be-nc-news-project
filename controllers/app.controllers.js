const { fetchAllTopics, fetchEndPoints } = require('../models/app.models');

const getTopics = (request, response, next) => {
  fetchAllTopics()
    .then((topics) => {
      response.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
};

const getEndPoints = (request, response, next) => {
  fetchEndPoints()
    .then((endpoints) => {
      response.status(200).send(endpoints);
    })
    .catch(next);
};

module.exports = { getTopics, getEndPoints };

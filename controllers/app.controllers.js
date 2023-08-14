const { fetchAllTopics } = require('../models/app.models');

const getTopics = (request, response, next) => {
  fetchAllTopics()
    .then((topics) => {
      response.status(200).send({ msg: 'Okay', topics: topics });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getTopics };

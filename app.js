const { getTopics } = require('./controllers/app.controllers');

const express = require('express');

const app = express();

app.get('/api/topics', getTopics);

app.use((err, request, response, next) => {
  if (err.status) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send({ err });
  next();
});

module.exports = app;

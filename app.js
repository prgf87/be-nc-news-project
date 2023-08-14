const { getTopics, getEndPoints } = require('./controllers/app.controllers');

const express = require('express');

const app = express();

app.use(express.json());

app.get('/api', getEndPoints);

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
});

module.exports = app;

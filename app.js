const {
  getTopics,
  getEndPoints,
  getArticleById,
  getArticleComments,
} = require('./controllers/app.controllers');

const express = require('express');

const app = express();

app.get('/api', getEndPoints);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles/:article_id/comments', getArticleComments);

app.use((err, request, response, next) => {
  if (err.status) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.code === '42703' || err.code === '22P02') {
    response.status(400).send({ msg: 'Bad request' });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send({ err });
});

module.exports = app;

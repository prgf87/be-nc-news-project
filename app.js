const {
  getTopics,
  getEndPoints,
  getArticles,
  getArticleById,
  postCommentByArticleId,
} = require('./controllers/app.controllers');

const express = require('express');

const app = express();

app.use(express.json());

app.get('/api', getEndPoints);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.post('/api/articles/:article_id/comments', postCommentByArticleId);

app.use((_, res) => {
  res.status(404).send({ msg: 'Not found' });
});

app.use((err, request, response, next) => {
  if (err.status) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.code === '42703') {
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

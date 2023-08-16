const {
  fetchTopics,
  fetchEndPoints,
  fetchArticles,
  fetchArticleById,
  fetchCommentsByArticleID,
  updateArticle,
  putNewComment,
} = require("../models/app.models");

const getTopics = (request, response, next) => {
  fetchTopics()
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
    .catch((err) => {
      next(err);
    });
};

const getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleById(article_id)
    .then((data) => {
      response.status(200).send({ article: data });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticleComments = (request, response, next) => {
  const { article_id } = request.params;
  fetchCommentsByArticleID(article_id)
    .then((data) => {
      response.status(200).send({ comments: data });
    })
    .catch(next);
};

const getArticles = (request, response, next) => {
  fetchArticles()
    .then((articles) => {
      response.status(200).send({ articles: articles });
    })
    .catch((err) => {
      next(err);
    });
};

const getUsers = (request, response, next) => {
  response.status(200).send();
};

const postCommentByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  const newComment = request.body;
  putNewComment(newComment, article_id)
    .then((comment) => {
      response.status(201).send({ comment: comment });
    })
    .catch(next);
};

const patchArticle = (request, response, next) => {
  const { article_id } = request.params;
  const newVote = response.req.body;
  updateArticle(newVote, article_id)
    .then((article) => {
      response.status(200).send({ article: article });
    })
    .catch(next);
};

module.exports = {
  getTopics,
  getEndPoints,
  getArticleById,
  getArticles,
  postCommentByArticleId,
  getArticleComments,
  patchArticle,
  getUsers,
};

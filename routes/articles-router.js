const {
  getArticles,
  getArticleById,
  getArticleComments,
  postCommentByArticleId,
  patchArticle,
} = require("../controllers/app.controllers");

const articlesRouter = require("express").Router();

articlesRouter.get("/", getArticles);

articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postCommentByArticleId);

module.exports = articlesRouter;

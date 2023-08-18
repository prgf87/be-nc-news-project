const apiRouter = require("express").Router();

const { getEndPoints } = require("../controllers/app.controllers");
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router");
const userRouter = require("./users-router");

apiRouter.get("/", getEndPoints);

apiRouter.use("/users", userRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;

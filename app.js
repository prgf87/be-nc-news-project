const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.use((_, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use((_, res) => {
  res.status(400).send({ msg: "Bad request" });
});

app.use((err, request, response, next) => {
  if (err.status) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23503" || err.code === "42703") {
    response.status(404).send({ msg: "Not found" });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send({ err });
});

module.exports = app;

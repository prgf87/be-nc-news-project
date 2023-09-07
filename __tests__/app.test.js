const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/");
const endpointsFile = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("app()", () => {
  describe("GET", () => {
    describe("/api", () => {
      it("200: responds with status 200", () => {
        return request(app).get("/api").expect(200);
      });
      it("200: should respond with a list of all available endpoints as a JSON object", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body }) => {
            const { endpoints } = body;
            expect(endpoints).toEqual(endpointsFile);
          });
      });
    });
    describe("/api/topics", () => {
      it("200: return with a status of 200", () => {
        return request(app).get("/api/topics").expect(200);
      });

      it("200: return with a status of 200 and a body with all the results from the topics database", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            const { topics } = body;
            expect(topics.length).toBe(3);
            topics.forEach((topic) => {
              expect(topic).toHaveProperty("slug", expect.any(String));
              expect(topic).toHaveProperty("description", expect.any(String));
            });
          });
      });
    });

    describe("WRONG API PATH", () => {
      it("404: returns with a 404 error when making a request to an api that does not exist", () => {
        return request(app).get("/api/toothpicks").expect(404);
      });
    });

    describe("GET /api/articles", () => {
      it("200: should receive status 200", () => {
        return request(app).get("/api/articles").expect(200);
      });
      it("200: should receive status 200 and a body with all the articles inside and a count of the comments for each of those articles", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles.length).toBe(13);
            expect(articles).toBeSortedBy("created_at", { descending: true });
            articles.forEach((article) => {
              expect(article).toHaveProperty("author", expect.any(String));
              expect(article).toHaveProperty("title", expect.any(String));
              expect(article).toHaveProperty("article_id", expect.any(Number));
              expect(article).toHaveProperty("topic", expect.any(String));
              expect(article).toHaveProperty("created_at", expect.any(String));
              expect(article).toHaveProperty("votes", expect.any(Number));
              expect(article).toHaveProperty(
                "article_img_url",
                expect.any(String)
              );
              expect(article).toHaveProperty(
                "comment_count",
                expect.any(String)
              );
            });
          });
      });
    });
    describe("/api/articles/:article_id", () => {
      it("200: return with a status of 200", () => {
        return request(app).get("/api/articles/1").expect(200);
      });
      it("200: return with a status of 200 and the corresponding article 1 data", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            const { article } = body;
            expect(article).toHaveProperty("article_id", 1);
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("body", expect.any(String));
            expect(article).toHaveProperty("topic", expect.any(String));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", expect.any(Number));
            expect(article).toHaveProperty(
              "article_img_url",
              expect.any(String)
            );
          });
      });
      it("200: return with a status of 200 and the corresponding article 5 data, including the number of comments that article may have", () => {
        return request(app)
          .get("/api/articles/5")
          .expect(200)
          .then(({ body }) => {
            const { article } = body;
            expect(article).toHaveProperty("article_id", 5);
            expect(article).toHaveProperty("comment_count", "2");
          });
      });
      it("404: returns with a 404 error when making a request to an api that does not exist", () => {
        return request(app)
          .get("/api/toothpicks")
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Not found");
          });
      });
    });
    describe("/api/articles/:article_id/comments", () => {
      it("200: should return with a status of 200", () => {
        return request(app).get("/api/articles/1/comments").expect(200);
      });
      it("200: should return with an array of comments for the given article_id, with the correct properties and in the correct order", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            const { comments } = body;
            expect(comments.length).toBe(11);
            expect(comments).toBeSortedBy("created_at", { ascending: true });
            comments.forEach((comment) => {
              expect(comment).toHaveProperty("article_id", 1);
              expect(comment).toHaveProperty("comment_id", expect.any(Number));
              expect(comment).toHaveProperty("votes", expect.any(Number));
              expect(comment).toHaveProperty("created_at", expect.any(String));
              expect(comment).toHaveProperty("author", expect.any(String));
              expect(comment).toHaveProperty("body", expect.any(String));
            });
          });
      });
      it("400: should return a status 400 and a message of Bad request when a bad request is made", () => {
        return request(app)
          .get("/api/articles/hello/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
      it("404: should return a status 404 and a message of Not found when it cannot find the id given", () => {
        return request(app)
          .get("/api/articles/999/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not found");
          });
      });
    });
    describe("/api/users", () => {
      it("200: should respond with a status of 200", () => {
        return request(app).get("/api/users").expect(200);
      });
      it("200: should respond with a status of 200 and a list of all the users in the database", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            const { users } = body;
            expect(users.length).toBe(4);
            users.forEach((user) => {
              expect(user).toHaveProperty("username", expect.any(String));
              expect(user).toHaveProperty("name", expect.any(String));
              expect(user).toHaveProperty("avatar_url", expect.any(String));
            });
          });
      });
    });
    describe("/api/users/:username", () => {
      it("200: should respond with a status 200 when looking for the user rogersop", () => {
        return request(app).get("/api/users/rogersop").expect(200);
      });
      it("200: should respond with a status 200 and a body of users with the correct data for the user rogersop", () => {
        return request(app)
          .get("/api/users/rogersop")
          .expect(200)
          .then(({ body }) => {
            const { user } = body;
            expect(typeof user).toBe("object");
            expect(user).toHaveProperty("username", "rogersop");
            expect(user).toHaveProperty(
              "avatar_url",
              "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4"
            );
            expect(user).toHaveProperty("name", "paul");
          });
      });
      it("404: should respond with a status 404 and a msg of Not found for a user search that does not exist", () => {
        return request(app)
          .get("/api/users/9999")
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Not found");
          });
      });
    });
  });

  describe("PATCH", () => {
    describe("/api/articles/:article_id", () => {
      it("200: should respond with a status of 200 and update the value of votes accordingly", () => {
        const newVote = { inc_votes: 500 };
        return request(app)
          .patch("/api/articles/1")
          .send(newVote)
          .expect(200)
          .then(({ body }) => {
            const { article } = body;
            expect(article.article_id).toBe(1);
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("topic", expect.any(String));
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("body", expect.any(String));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", 500);
            expect(article).toHaveProperty(
              "article_img_url",
              expect.any(String)
            );
          });
      });
      it("200: should respond with a status of 200 and update the value of votes accordingly", () => {
        const newVote = { inc_votes: -100 };
        return request(app)
          .patch("/api/articles/1")
          .send(newVote)
          .expect(200)
          .then(({ body }) => {
            const { article } = body;
            expect(article.article_id).toBe(1);
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("topic", expect.any(String));
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("body", expect.any(String));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", -100);
            expect(article).toHaveProperty(
              "article_img_url",
              expect.any(String)
            );
          });
      });
      it("200: should respond with a status of 200 and update the value of votes accordingly even when passed additional incorrect information", () => {
        const newVote = { inc_votes: 50, banana: [true, false] };
        return request(app)
          .patch("/api/articles/1")
          .send(newVote)
          .expect(200)
          .then(({ body }) => {
            const { article } = body;
            expect(article.article_id).toBe(1);
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("topic", expect.any(String));
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("body", expect.any(String));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", 50);
            expect(article).toHaveProperty(
              "article_img_url",
              expect.any(String)
            );
          });
      });
      it("400: should respond with a status of 400 and a message of Bad request when sending incorrect data", () => {
        const newVote = { inc_votes: "hello" };
        return request(app)
          .patch("/api/articles/1")
          .send(newVote)
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Bad request");
          });
      });
      it("400: should respond with a status of 400 and a message of Bad request when the article doesnt exist (notanid)", () => {
        const newVote = { inc_votes: -100 };
        return request(app)
          .patch("/api/articles/notanid")
          .send(newVote)
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Bad request");
          });
      });
      it("404: should respond with a status of 404 and a message of Not found when the article doesnt exist (999)", () => {
        const newVote = { inc_votes: -100 };
        return request(app)
          .patch("/api/articles/999")
          .send(newVote)
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Not found");
          });
      });
    });
    describe("/api/commnents/:comment_id", () => {
      it("200: should respond with a status of 200 and update the value of votes accordingly", () => {
        const newVote = { inc_votes: 1 };
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: newVote })
          .expect(200)
          .then(({ body }) => {
            const { comment } = body;
            expect(comment).toHaveProperty("comment_id", 1);
            expect(comment).toHaveProperty("article_id", 9);
            expect(comment).toHaveProperty("votes", 17);
            expect(comment).toHaveProperty("author", "butter_bridge");
            expect(comment).toHaveProperty("body", expect.any(String));
            expect(comment).toHaveProperty("created_at", expect.any(String));
          });
      });
      it("200: should respond with a status of 200 and update the value of votes accordingly", () => {
        const newVote = { inc_votes: -1 };
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: newVote })
          .expect(200)
          .then(({ body }) => {
            const { comment } = body;
            expect(comment).toHaveProperty("comment_id", 1);
            expect(comment).toHaveProperty("article_id", 9);
            expect(comment).toHaveProperty("votes", 15);
            expect(comment).toHaveProperty("author", "butter_bridge");
            expect(comment).toHaveProperty("body", expect.any(String));
            expect(comment).toHaveProperty("created_at", expect.any(String));
          });
      });
      it("200: should respond with a status of 200 and update the value of votes accordingly even when passed additional information or a ridiculous value", () => {
        const newVote = { inc_votes: -9999 };
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: newVote, data_mine: Function })
          .expect(200)
          .then(({ body }) => {
            const { comment } = body;
            expect(comment).toHaveProperty("comment_id", 1);
            expect(comment).toHaveProperty("article_id", 9);
            expect(comment).toHaveProperty("votes", 15);
          });
      });
      it("404: should respond with a status of 404 and msg of Not found when passing an update to a non exitent comment", () => {
        const newVote = { inc_votes: 1 };
        return request(app)
          .patch("/api/comments/999")
          .send({ inc_votes: newVote })
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Not found");
          });
      });
      it("400: should respond with a status of 400 and msg of Not found when passing an update to a non exitent comment by using the wrong data type", () => {
        const newVote = { inc_votes: 1 };
        return request(app)
          .patch("/api/comments/hello")
          .send({ inc_votes: newVote })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Bad request");
          });
      });
      it("400: should respond with a status of 400 and msg of Bad request when passing the wrong data type", () => {
        const newVote = { inc_votes: "bananas" };
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: newVote })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Bad request");
          });
      });
    });
  });
  describe("POST", () => {
    describe("/api/articles/:article_id/comments", () => {
      it("201: should respond with status 201 and a body object containing the inserted comment inside the correct article (1)", () => {
        const newComment = {
          username: "icellusedkars",
          body: "Really great work on this ticket!",
        };
        return request(app)
          .post("/api/articles/1/comments")
          .send(newComment)
          .expect(201)
          .then(({ body }) => {
            const { comment } = body;
            expect(comment).toHaveProperty("author", expect.any(String));
            expect(comment).toHaveProperty("body", expect.any(String));
            expect(comment.body).toBe(newComment.body);
          });
      });
      it("201: should return a status 201 and a message containing the new comment even when passed additional incorrect information inside request", () => {
        const newComment = {
          username: "icellusedkars",
          body: "Really great work on this ticket!",
          banana: true,
        };
        return request(app)
          .post("/api/articles/1/comments")
          .send(newComment)
          .expect(201)
          .then(({ body }) => {
            const { comment } = body;
            expect(comment).toHaveProperty("author", "icellusedkars");
            expect(comment).toHaveProperty(
              "body",
              "Really great work on this ticket!"
            );
            expect(comment).not.toHaveProperty("banana", true);
          });
      });
      it("400: should return a status 400 and a message of Bad request when a bad request is made", () => {
        const newComment = {
          username: "icellusedkars",
          body: "Really great work on this ticket!",
        };
        return request(app)
          .post("/api/articles/hello/comments")
          .send(newComment)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
      it("400: should return a status 400 and a message of Bad request when a bad request is made - no body", () => {
        const newComment = {
          username: "icellusedkars",
        };
        return request(app)
          .post("/api/articles/hello/comments")
          .send(newComment)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
      it("400: should return a status 400 and a message of Bad request when a bad request is made - no username", () => {
        const newComment = {
          body: "Really great work on this ticket!",
        };
        return request(app)
          .post("/api/articles/hello/comments")
          .send(newComment)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });

      it("404: should return a status 404 and a message of Not found when it cannot post to a comment as the article does not exist", () => {
        const newComment = {
          username: "icellusedkars",
          body: "Really great work on this ticket!",
        };
        return request(app)
          .post("/api/articles/999/comments")
          .send(newComment)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not found");
          });
      });
      it("404: should return a status 404 and a message of Not found when it cannot post a comment as the username does not exist", () => {
        const newComment = {
          username: "notarealuser",
          body: "Really great work on this ticket!",
        };
        return request(app)
          .post("/api/articles/1/comments")
          .send(newComment)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not found");
          });
      });
    });
  });
  describe("DELETE", () => {
    describe("/api/comments/:comment_id", () => {
      it("204: respond with status 204 and no body content", () => {
        return request(app)
          .delete("/api/comments/15")
          .expect(204)
          .then((response) => {
            expect(data.commentData.length === 17);
            expect(!response.body).toBe(false);
          });
      });
      it("400: should respond with a status of 400 and msg of Bad request when passed an incorrect endpoint", () => {
        return request(app)
          .delete("/api/comments/hello")
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Bad request");
          });
      });
      it("404: respond with status 404 and an empty body when passed an id that doesnt exit", () => {
        return request(app)
          .delete("/api/comments/999")
          .expect(404)
          .then(({ body }) => {
            expect(data.commentData.length === 18);
            const { msg } = body;
            expect(msg).toBe("Not found");
          });
      });
    });
  });
  describe("Queries", () => {
    describe("/api/articles?topic=coding", () => {
      it("200: should respond with a status code of 200 when searching for coding as a topic", () => {
        return request(app)
          .get("/api/articles?topic=coding")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles.length).toBe(0);
            articles.forEach((article) => {
              expect(article).toHaveProperty("topic", "coding");
            });
          });
      });
      it("200: should respond with a status code of 200 when searching for coding as a topic and using sortby article_id in descending order", () => {
        return request(app)
          .get("/api/articles?topic=coding&sort_by=article_id")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles.length).toBe(0);
            expect(articles).toBeSortedBy("article_id", { descending: true });
            articles.forEach((article) => {
              expect(article).toHaveProperty("topic", "coding");
            });
          });
      });
      it("200: should respond with a status code of 200 when searching for coding as a topic, using sortby article_id in ascending order", () => {
        return request(app)
          .get("/api/articles?topic=coding&sort_by=article_id&order_by=asc")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles.length).toBe(0);
            expect(articles).toBeSortedBy("article_id", { ascending: true });
            articles.forEach((article) => {
              expect(article).toHaveProperty("topic", "coding");
            });
          });
      });
      it("200: should return a status of 200 when passed a correct topic but no articles available", () => {
        return request(app)
          .get("/api/articles?topic=coding")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles.length).toBe(0);
            expect(articles).toEqual([]);
          });
      });
      it("404: should return status 404 and msg of Not found when passed an incorrect topic, ie: bananas", () => {
        return request(app)
          .get("/api/articles?topic=bananas")
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Not found");
          });
      });
      it("400: should return status 400 and msg of Bad request when passed an incorrect sort_by, ie: bananas", () => {
        return request(app)
          .get("/api/articles?topic=coding&sort_by=bananas")
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Bad request");
          });
      });
      it("400: should respond with a status code of 400 when searching for coding as a topic, using sort_by article_id, but the incorrect order_by, ie bananas", () => {
        return request(app)
          .get("/api/articles?topic=coding&sort_by=article_id&order_by=bananas")
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Bad request");
          });
      });
    });
  });
});

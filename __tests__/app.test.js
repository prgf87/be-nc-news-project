const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/');

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe('app()', () => {
  describe('/api/topics', () => {
    it('200: return with a status of 200', () => {
      return request(app).get('/api/topics').expect(200);
    });

    it('200: return with a status of 200 and a body with all the results from the topics database', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          expect(topics.length).toBe(3);
          topics.forEach((topic) => {
            expect(topic).toHaveProperty('slug', expect.any(String));
            expect(topic).toHaveProperty('description', expect.any(String));
          });
        });
    });
    it('404: returns with a 404 error when making a request to an api that does not exist', () => {
      return request(app).get('/api/toothpicks').expect(404);
    });
  });
  describe('/api/articles/:article_id', () => {
    it('200: return with a status of 200', () => {
      return request(app).get('/api/articles/5').expect(200);
    });
    it('200: return with a status of 200 and the corresponding article data', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toHaveProperty('author', expect.any(String));
          expect(article).toHaveProperty('title', expect.any(String));
          expect(article).toHaveProperty('article_id', expect.any(Number));
          expect(article).toHaveProperty('body', expect.any(String));
          expect(article).toHaveProperty('topic', expect.any(String));
          expect(article).toHaveProperty('created_at', expect.any(Number));
          expect(article).toHaveProperty('votes', expect.any(Number));
          expect(article).toHaveProperty('article_img_url', expect.any(String));
        });
    });
  });
});

const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/');

const endpoints = require('../endpoints.json');

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
  describe('/api', () => {
    it('200: responds with status 200', () => {
      return request(app).get('/api').expect(200);
    });
    it('200: should respond with a list of all available endpoints as a JSON object', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({ body: { endpoints } }) => {
          expect(typeof endpoints).toBe('object');
          Object.values(endpoints).forEach((object) => {
            expect(object).toHaveProperty('description', expect.any(String));
            expect(object).toHaveProperty('queries', expect.any(Array));
            expect(object).toHaveProperty(
              'exampleResponse',
              expect.any(Object)
            );
          });
        });
    });
    it('400: return with a 400 error if a query is passed', () => {});
  });
});

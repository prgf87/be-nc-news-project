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
    it('200: return with a status of 200 and a message of Okay', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          expect(body.msg).toBe('Okay');
        });
    });
    it('200: return with a status of 200 and a message of Okay and a body will all the results from the topics tdatabase', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
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
});

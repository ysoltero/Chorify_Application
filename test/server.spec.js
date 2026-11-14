// test/server.spec.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const db = require('../src/db'); // Adjust path if db.js is in root
const { expect } = chai;

chai.use(chaiHttp);

describe('API Integration Tests: /register', () => {
  // Clean up test user before running tests so results are repeatable
  beforeEach(async () => {
    await db.none('DELETE FROM users WHERE username = $1;', ['new_test_user']);
  });

  // Close the DB pool after all tests finish so Mocha exits cleanly
  after(async () => {
    await db.$pool.end();
  });

  // 1. Positive Test Case
  it('Positive: should successfully register a new user with valid credentials', (done) => {
    chai.request(app)
      .post('/register')
      .send({
        username: 'new_test_user',
        password: 'Password123!'
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  // 2. Negative Test Case
  it('Negative: should fail to register when password is missing', (done) => {
    chai.request(app)
      .post('/register')
      .send({
        username: 'invalid_user',
        password: ''
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
});
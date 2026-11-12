const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const { expect } = chai;
chai.use(chaiHttp);

describe('Welcome API', () => {
    it('should return a welcome message', async () => {
        const res = await chai.request(app).get('/welcome');
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Welcome!');
    });
});

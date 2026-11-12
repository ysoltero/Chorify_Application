
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

const app = require('../app');
const { db } = require('../ProjectSourceCode/src/db');

chai.use(chaiHttp);

describe('Registration Database Test', () => {
    const username = `test_${randomUUID()}`;
    const password = 'Password123!';

    afterEach(async () => {
        await db.none('DELETE FROM users WHERE username = $1', [username]);
    });

    it('should save one user with a hashed password', async () => {
        const res = await chai.request(app).post('/register').send({
            username: username,
            password: password
        });

        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('User registered successfully');

        const users = await db.any('SELECT * FROM users WHERE username = $1', [username]);

        expect(users).to.have.lengthOf(1);
        expect(users[0].username).to.equal(username);
        expect(users[0].password).to.not.equal(password);
        expect(await bcrypt.compare(password, users[0].password)).to.be.true;
    });
});



const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { randomUUID } = require('crypto');
const app = require('../ProjectSourceCode/app');
const { db } = require('../ProjectSourceCode/src/db');

chai.use(chaiHttp);

describe('Chore Creation API', () => {
    const choreName = `test_chore_${randomUUID()}`;

    afterEach(async () => {
        await db.none('DELETE FROM chores WHERE name = $1', [choreName]);
    });

    it('creates a chore with valid information', async () => {
        const res = await chai.request(app).post('/chores').send({
            name: choreName,
            points: 10
        });

        expect(res).to.have.status(201);
        expect(res.body.message).to.equal('Chore created successfully');

        const chores = await db.any('SELECT * FROM chores WHERE name = $1', [choreName]);

        expect(chores).to.have.lengthOf(1);
        expect(chores[0].points).to.equal(10);
    });

    it('rejects a chore without a name', async () => {
        const res = await chai.request(app).post('/chores').send({
            name: '',
            points: 10
        });

        expect(res).to.have.status(400);

        const chores = await db.any('SELECT * FROM chores WHERE name = $1', [choreName]);
        expect(chores).to.have.lengthOf(0);
    });
});


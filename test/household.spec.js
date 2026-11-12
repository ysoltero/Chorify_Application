
const chai = require('chai');
const chaiHttp = require('chai-http');
const {randomUUID} = require('crypto');
const app = require('../ProjectSourceCode/app');
const {db} = require('../ProjectSourceCode/src/db');

chai.use(chaiHttp);
const {expect} = chai;

describe('Household Creation API', () => {
    const username = `test_${randomUUID().slice(0, 8)}`;
    let householdId;

    before(async () => {
        await db.none(
            'INSERT INTO users (username, password) VALUES ($1, $2)',
            [username, 'testpassword']
        );
    });

    after(async () => {
        if (householdId) {
            await db.none('DELETE FROM households WHERE household_id = $1', [householdId]);
        }
        await db.none('DELETE FROM users WHERE username = $1', [username]);
    });

    it('creates a household and adds the creator as a member', async () => {
        const res = await chai.request(app).post('/households').send({
            household_name: 'Test Household',
            username: username
        });

        expect(res).to.have.status(201);
        expect(res.body.message).to.equal('Household created');

        householdId = res.body.household.household_id;

        const members = await db.any(
            'SELECT * FROM household_members WHERE household_id = $1',
            [householdId]
        );

        expect(members).to.have.lengthOf(1);
        expect(members[0].username).to.equal(username);
    });

    it('rejects a household without a name', async () => {
        const res = await chai.request(app).post('/households').send({
            household_name: '',
            username: username
        });

        expect(res).to.have.status(400);
    });

    it('rejects a household with a nonexistent user', async () => {
        const res = await chai.request(app).post('/households').send({
            household_name: 'Invalid Household',
            username: `missing_${randomUUID()}`
        });

        expect(res).to.have.status(400);
    });


    it('shows households that belong to the user', async () => {
        const res = await chai.request(app)
            .get('/households')
            .query({username: username});

        expect(res).to.have.status(200);
        expect(res.body.households).to.be.an('array');
        expect(res.body.households).to.have.lengthOf(1);
        expect(res.body.households[0].household_id).to.equal(householdId);
    });

    it('rejects a request without a username', async () => {
        const res = await chai.request(app).get('/households');
        expect(res).to.have.status(400);
    });

    it('adds another user to the household', async () => {
        const newUsername = `member_${randomUUID().slice(0, 8)}`;
        await db.none(
            'INSERT INTO users (username, password) VALUES ($1, $2)',
            [newUsername, 'testpassword']
        );
        try {
            const res = await chai.request(app)
                .post(`/households/${householdId}/members`)
                .send({username: newUsername});

            expect(res).to.have.status(201);

            const member = await db.oneOrNone(
                'SELECT * FROM household_members WHERE household_id = $1 AND username = $2',
                [householdId, newUsername]
            );
            expect(member).to.not.equal(null);
        } finally {
            await db.none(
                'DELETE FROM household_members WHERE household_id = $1 AND username = $2',
                [householdId, newUsername]
            );
            await db.none('DELETE FROM users WHERE username = $1', [newUsername]);
        }
    });

    it('rejects adding a user who does not exist', async () => {
        const res = await chai.request(app)
            .post(`/households/${householdId}/members`)
            .send({username: `missing_${randomUUID()}`});

        expect(res).to.have.status(404);
    });

    it('rejects adding a member to a nonexistent household', async () => {
        const res = await chai.request(app)
            .post('/households/999999999/members')
            .send({username: username});

        expect(res).to.have.status(404);
    });

});


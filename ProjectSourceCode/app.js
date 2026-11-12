const express = require('express');
const bcrypt = require('bcryptjs');
const {db} = require('./src/db');
const validateRegistration = require('./src/validateRegistration');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});

app.post('/register', async (req, res) => {
  if (!validateRegistration(req.body)) {
    return res.status(400).json({message: 'Invalid input'});
  }

  const {username, password} = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.none(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      [username, hashedPassword]
    );

    return res.status(201).json({message: 'Registration successful'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: 'Registration failed'});
  }
});


app.post('/chores', async (req, res) => {
    const { name, points } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Chore name is required' });
    }

    if (!Number.isInteger(points) || points < 0) {
        return res.status(400).json({ error: 'Points must be a nonnegative integer' });
    }

    try {
        await db.none(
            'INSERT INTO chores (name, points) VALUES ($1, $2)',
            [name, points]
        );

        return res.status(201).json({ message: 'Chore created successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to create chore' });
    }
});


app.post('/households', async (req, res) => {
    const {household_name, username} = req.body;
    if (!household_name || typeof household_name !== 'string' || !household_name.trim()) {
        return res.status(400).json({message: 'Household name is required'});
    }
    if (!username || typeof username !== 'string') {
        return res.status(400).json({message: 'Username is required'});
    }
    try {
        const household = await db.tx(async t => {
            const result = await t.one(
                'INSERT INTO households (household_name, created_by) VALUES ($1, $2) RETURNING *',
                [household_name.trim(), username]
            );
            await t.none(
                'INSERT INTO household_members (household_id, username) VALUES ($1, $2)',
                [result.household_id, username]
            );
            return result;
        });
        return res.status(201).json({message: 'Household created', household});
    } catch (err) {
        console.error(err);
        if (err.code === '23503') {
            return res.status(400).json({message: 'User does not exist'});
        }
        return res.status(500).json({message: 'Failed to create household'});
    }
});


app.get('/households', async (req, res) => {
    const {username} = req.query;
    if (!username || typeof username !== 'string') {
        return res.status(400).json({message: 'Username is required'});
    }
    try {
        const households = await db.any(
            `SELECT h.household_id, h.household_name, h.created_by
             FROM households h
             JOIN household_members m ON h.household_id = m.household_id
             WHERE m.username = $1
             ORDER BY h.household_id`,
            [username]
        );
        return res.status(200).json({households});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Failed to get households'});
    }
});


app.post('/households/:id/members', async (req, res) => {
    const householdId = Number(req.params.id);
    const {username} = req.body;
    if (!Number.isInteger(householdId) || householdId <= 0) {
        return res.status(400).json({message: 'Invalid household ID'});
    }
    if (!username || typeof username !== 'string' || !username.trim()) {
        return res.status(400).json({message: 'Username is required'});
    }
    try {
        const household = await db.oneOrNone(
            'SELECT household_id FROM households WHERE household_id = $1',
            [householdId]
        );
        if (!household) {
            return res.status(404).json({message: 'Household not found'});
        }
        const user = await db.oneOrNone(
            'SELECT username FROM users WHERE username = $1',
            [username.trim()]
        );
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        const member = await db.oneOrNone(
            'INSERT INTO household_members (household_id, username) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
            [householdId, username.trim()]
        );
        if (!member) {
            return res.status(409).json({message: 'User is already a member'});
        }
        return res.status(201).json({message: 'Member added successfully', member});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Failed to add member'});
    }
});


app.get('/households/:id/members', async (req, res) => {
    const householdId = Number(req.params.id);
    if (!Number.isInteger(householdId) || householdId <= 0) {
        return res.status(400).json({message: 'Invalid household ID'});
    }
    try {
        const household = await db.oneOrNone(
            'SELECT household_id FROM households WHERE household_id = $1',
            [householdId]
        );
        if (!household) {
            return res.status(404).json({message: 'Household not found'});
        }
        const members = await db.any(
            'SELECT username FROM household_members WHERE household_id = $1 ORDER BY username',
            [householdId]
        );
        return res.status(200).json({members});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Failed to get members'});
    }
});

app.delete('/households/:id/members/:username', async (req, res) => {
    const householdId = Number(req.params.id);
    const username = req.params.username;
    if (!Number.isInteger(householdId) || householdId <= 0) {
        return res.status(400).json({message: 'Invalid household ID'});
    }
    try {
        const household = await db.oneOrNone(
            'SELECT * FROM households WHERE household_id = $1',
            [householdId]
        );
        if (!household) {
            return res.status(404).json({message: 'Household not found'});
        }
        if (household.created_by === username) {
            return res.status(400).json({message: 'Cannot remove the household creator'});
        }
        const member = await db.oneOrNone(
            'DELETE FROM household_members WHERE household_id = $1 AND username = $2 RETURNING *',
            [householdId, username]
        );
        if (!member) {
            return res.status(404).json({message: 'Member not found'});
        }
        return res.status(200).json({message: 'Member removed successfully'});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Failed to remove member'});
    }
});

app.delete('/households/:id/leave', async (req, res) => {
    const householdId = Number(req.params.id);
    const {username} = req.body;
    if (!Number.isInteger(householdId) || householdId <= 0) {
        return res.status(400).json({message: 'Invalid household ID'});
    }
    if (!username || typeof username !== 'string') {
        return res.status(400).json({message: 'Username is required'});
    }
    try {
        const household = await db.oneOrNone(
            'SELECT * FROM households WHERE household_id = $1',
            [householdId]
        );
        if (!household) {
            return res.status(404).json({message: 'Household not found'});
        }
        if (household.created_by === username) {
            return res.status(400).json({message: 'Household creator cannot leave'});
        }
        const member = await db.oneOrNone(
            'DELETE FROM household_members WHERE household_id = $1 AND username = $2 RETURNING *',
            [householdId, username]
        );
        if (!member) {
            return res.status(404).json({message: 'User is not a member'});
        }
        return res.status(200).json({message: 'Left household successfully'});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Failed to leave household'});
    }
});

module.exports = app;

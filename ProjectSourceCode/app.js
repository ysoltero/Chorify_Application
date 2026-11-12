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

module.exports = app;

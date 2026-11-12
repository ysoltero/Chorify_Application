// app.js
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./ProjectSourceCode/src/db');
const validateRegistration = require('./validateRegistration');

const app = express();

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET / - Basic landing or health check route
app.get('/', (req, res) => {
  res.status(200).send('Server is running');
});

// POST /register - User registration route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // 1. Input Validation
  const validation = validateRegistration({ username, password });
  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  try {
    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Database Insertion (using pg-promise)
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2);';
    await db.none(query, [username, hashedPassword]);

    // 4. Success Response
    return res.status(200).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Database Error:', err);
    return res.status(400).json({ error: 'Failed to register user. Username may already exist.' });
  }
});

// Export app for Mocha/Chai-HTTP testing (do NOT call app.listen here)
module.exports = app;
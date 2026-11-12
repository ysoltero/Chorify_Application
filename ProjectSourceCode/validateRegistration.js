// tests the user's user/pass combo and returns if it is valid or not

// src/validateRegistration.js
function validateRegistration({ username, password }) {
  if (!username || username.trim() === '') {
    return { valid: false, message: 'Username is required.' };
  }
  if (!password || password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters.' };
  }
  return { valid: true };
}

module.exports = validateRegistration;
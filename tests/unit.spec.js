// Use chai.expect to assert the output of the function for various inputs

// test/unit.spec.js
const { expect } = require('chai');
const validateRegistration = require('../ProjectSourceCode/validateRegistration');

describe('Unit Test: validateRegistration', () => {
  it('should return valid: false if username is missing', () => {
    const result = validateRegistration({ username: '', password: 'Password123!' });
    expect(result.valid).to.be.false;
    expect(result.message).to.equal('Username is required.');
  });

  it('should return valid: false if password is too short', () => {
    const result = validateRegistration({ username: 'testuser', password: '123' });
    expect(result.valid).to.be.false;
    expect(result.message).to.equal('Password must be at least 6 characters.');
  });

  it('should return valid: true for valid username and password', () => {
    const result = validateRegistration({ username: 'validUser', password: 'Password123!' });
    expect(result.valid).to.be.true;
  });
});
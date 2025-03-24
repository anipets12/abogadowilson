const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Ideally, we'd load this from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'abogadowilsonsecretkeyforsecuritytokens2025';
const JWT_EXPIRY = '7d'; // Token expires in 7 days

// Hash password using SHA-256
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Compare a plain text password with the hashed one
function comparePassword(password, hashedPassword) {
  const hashed = hashPassword(password);
  return hashed === hashedPassword;
}

// Generate JWT token
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

// Verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
};

const jwt = require("jsonwebtoken");
const axios = require("axios");
require("dotenv").config();

// Create fake admin token
const token = jwt.sign(
  { id: "60c72b2f9b1d8b3a4c8a4d4b", role: "admin" }, // Mock admin ID
  process.env.JWT_SECRET || 'mysecretkey',
  { expiresIn: "1h" }
);

// We must also mock the user in the database or bypass it?
// Let's see authMiddleware.js...
// If authMiddleware does User.findById(req.user.id), we might need a real user.

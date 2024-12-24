const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) return res.status(401).json({ error: 'Access denied, no token provided' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');
    req.user = verified; // Add the decoded token data (user ID, role, etc.) to the request object
    next(); // Move to the next middleware or route handler
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticateToken;

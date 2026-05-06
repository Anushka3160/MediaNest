const jwt = require('jsonwebtoken');

module.exports = function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;   // { id, email, username }
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
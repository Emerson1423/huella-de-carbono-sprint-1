const jwt = require('jsonwebtoken');
const JWT_SECRET = '8116e6a30e1856625e50ead825375db00b7182bad1cfbc52c9770758d972a1e2';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
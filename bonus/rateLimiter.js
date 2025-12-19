const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const createRateLimiter = () => {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: (req) => {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        try {
          jwt.verify(token, 'secret');
          return 100;
        } catch (err) {
          return 20;
        }
      }
      return 20;
    },
    message: {
      error: 'Too many requests, please try again later'
    }
  });
};

module.exports = createRateLimiter;
const jwt = require('jsonwebtoken'); // get jsonwebtoken for checking tokens

// this is middleware to check if user is logged in
module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');
  const sessionToken = authHeader?.replace('Bearer ', ''); // get token from header
  if (!sessionToken) return res.status(401).json({ message: 'No token, authorization denied' }); // if no token, block access

  try {
    const userPayload = jwt.verify(sessionToken, process.env.JWT_SECRET); // check if token is real
    req.user = userPayload; // save user info from token
    next(); // let request keep going
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' }); // if token is bad, block access
  }
};
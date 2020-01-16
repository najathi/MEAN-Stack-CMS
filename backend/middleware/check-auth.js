const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    // verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    console.log('9 check-auth.js', decodedToken);
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId
    };
    next();
  } catch (error) {
    res.status(401).json({message: "You are not authenticated!"});
  }
}

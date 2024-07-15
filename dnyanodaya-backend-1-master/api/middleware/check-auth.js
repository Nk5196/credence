const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    console.log("token res-->", req);

    const token = req.headers.authorization.split(" ")[1];
    console.log("token-->", token);

    // Check if token is missing
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed: No token provided' });
    }

    // Verify the token with the secret key
    const decodedToken = jwt.verify(token, "this is a dummy text");
    console.log("decodedToken", decodedToken);

    // If verification is successful, add the decoded token to the request for later use
    req.userData = decodedToken;

    // Call next to pass control to the next middleware
    next();
  } catch (error) {
    // Token verification failed
    return res.status(401).json({
      message: "Authentication failed: Invalid token"
    });
  }
};

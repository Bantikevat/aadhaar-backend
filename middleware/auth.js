const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authentication Failed!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Token में userId होनी चाहिए
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token!" });
  }
};

module.exports = authMiddleware;
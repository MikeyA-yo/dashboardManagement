const jwt = require("jsonwebtoken");

const adminAuthMiddleware = (req, res, next) => {
  // Check if there is an access token
  const tokenPresent = req.headers?.authorization?.startsWith("Bearer");

  if (!tokenPresent) {
    return res.status(400).json({ message: "Please login" });
  }

  // Get the token
  const token = req.headers.authorization.split(" ")[1];

  // verify the token
  try {
    const decodedVal = jwt.verify(token, process.env.JWT_SECRET);
    // Let the decoded value be the request.user
    // req.user = { ...decodedVal };

    // check if the role is admin
    if (decodedVal.role !== "Admin") {
      return res
        .status(400)
        .json({ message: "Only admins are allowed access to this route" });
    }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid authorization..." });
  }
};

module.exports = adminAuthMiddleware;

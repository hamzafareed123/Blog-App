const { verifyToken } = require("../services/auth");
const User = require("../models/user");

function authenticateToken(cookieName) {
  return async (req, res, next) => {
    try {
      const cookieValue = req.cookies[cookieName];

      if (!cookieValue) {
        req.user = null;
        return next();
      }

      // ✅ decode token
      const userPayload = verifyToken(cookieValue);

      // ✅ fetch full user from DB
      const user = await User.findById(userPayload._id).lean();

      req.user = user || null;
      return next();
    } catch (error) {
      console.error("Auth error:", error.message);
      req.user = null;
      return next();
    }
  };
}

module.exports = { authenticateToken };

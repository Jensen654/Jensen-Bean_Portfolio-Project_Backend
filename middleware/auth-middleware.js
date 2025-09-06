const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/UnauthorizedError");

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("No authorization found"));
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError("No json web token found"));
  }

  req.user = payload;
  return next();
};

module.exports = {
  authMiddleware,
};

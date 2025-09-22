const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/UnauthorizedError");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("No authorization found"));
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError("No json web token found"));
  }

  req.user = payload;
  return next();
};

module.exports = {
  authMiddleware,
};

const User = require("../models/users.js");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config.js");
const UnauthorizedError = require("../errors/UnauthorizedError.js");

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
      return res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect Email or Password") {
        return next(new UnauthorizedError("Incorrect Email or Password"));
      }
      return next(err);
    });
};

const signUp = (req, res, next) => {
  const { name, email, password } = req.body;

  User.create({ name, email, password })
    .then((user) => {
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
      return res.status(201).send({ token });
    })
    .catch((err) => {
      if (err.code === 11000) {
        err.message = "Email already in use";
        err.statusCode = 409;
        return next(err);
      }
      return next(err);
    });
};

module.exports = {
  login,
  signUp,
};

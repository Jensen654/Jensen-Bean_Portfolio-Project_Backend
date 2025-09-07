const User = require("../models/users.js");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config.js");
const bcrypt = require("bcrypt");
const UnauthorizedError = require("../errors/UnauthorizedError.js");
const NotFoundError = require("../errors/NotFoundError.js");
const ConflictError = require("../errors/ConflictError.js");
const BadRequestError = require("../errors/BadRequestError.js");
const AWS = require("aws-sdk");

const s3 = new AWS.S3();

const generateUploadUrl = (date) => {
  const params = {
    Bucket: "myimagedatabasejensenbean",
    Key: `uploads/${Date.now()}.jpg`,
    Expires: 60,
    ContentType: "image/jpeg",
    ACL: "public-read",
  };

  return s3.getSignedUrlPromise("putObject", params);
};

const sendUploadUrl = async (req, res, next) => {
  try {
    const uploadUrl = await generateUploadUrl();
  } catch (err) {
    next(err);
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
      return res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect Email or Password") {
        return next(new BadRequestError("Incorrect Email or Password"));
      }
      return next(err);
    });
};

const signUp = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 4);
    User.create({ name, avatar, email, password: hashedPassword })
      .then((user) => {
        res.status(201).send({
          _id: user._id,
          name: user.name,
          avatar: user.avatar,
          email: user.email,
        });
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          next(
            new BadRequestError(
              `The provided info does not conform to database standards/requirements.`
            )
          );
        } else if (err.code === 11000) {
          next(new ConflictError("Email has already been used."));
        } else {
          next(err);
        }
      });
  } catch (err) {
    next(err);
  }
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user.id;

  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      } else {
        return next(err);
      }
    });
};

module.exports = {
  login,
  signUp,
  getCurrentUser,
  generateUploadUrl,
};

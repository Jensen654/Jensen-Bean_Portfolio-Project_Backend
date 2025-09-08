const User = require("../models/users.js");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config.js");
const bcrypt = require("bcrypt");
const UnauthorizedError = require("../errors/UnauthorizedError.js");
const NotFoundError = require("../errors/NotFoundError.js");
const ConflictError = require("../errors/ConflictError.js");
const BadRequestError = require("../errors/BadRequestError.js");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  // region: "us-east-2",
  // credentials: {
  //   accessKeyId: "AKIA5TIACKHIJHDDD3PP",
  //   secretAccessKey: "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",
  // },
});

const generateUploadUrl = async (date) => {
  const command = new PutObjectCommand({
    Bucket: "myimagedatabasejensenbean",
    Key: `uploads/${date}.jpg`,
    ContentType: "image/jpeg",
    ACL: "public-read",
  });
  return await getSignedUrl(s3, command, { expiresIn: 60 });
};

const sendUploadUrl = async (req, res, next) => {
  const date = Date.now();
  const key = `uploads/${date}.jpg`;
  try {
    const uploadUrl = await generateUploadUrl(date);
    res.status(200).send({ uploadUrl, key });
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

const updateUserInfo = (req, res, next) => {
  const userId = req.user.id;
  const { name, avatar, profession, resumeUrl, about } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar, profession, resumeUrl, about },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((newDoc) => {
      res.send({ newDoc });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            `The provided info does not conform to database standards/requirements.`
          )
        );
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError(`User does not exist.`));
      } else {
        next(err);
      }
    });
};

module.exports = {
  login,
  signUp,
  getCurrentUser,
  sendUploadUrl,
  updateUserInfo,
};

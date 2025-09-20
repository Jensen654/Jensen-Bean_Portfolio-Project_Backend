const User = require("../models/users.js");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config.js");
const bcrypt = require("bcrypt");
const UnauthorizedError = require("../errors/UnauthorizedError.js");
const NotFoundError = require("../errors/NotFoundError.js");
const ConflictError = require("../errors/ConflictError.js");
const BadRequestError = require("../errors/BadRequestError.js");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  region: "us-east-2",
  credentials: {
    accessKeyId: "AKIA5TIACKHIJHDDD3PP",
    secretAccessKey: "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",
  },
});

const generateUploadUrl = async (date) => {
  const command = new PutObjectCommand({
    Bucket: "myimagedatabasejensenbean",
    Key: `uploads/${date}.jpg`,
    ContentType: "image/jpeg",
  });
  return await getSignedUrl(s3, command, { expiresIn: 60 });
};

const generateDeleteUrl = async (url) => {
  const key = url.replace(
    "https://myimagedatabasejensenbean.s3.us-east-2.amazonaws.com/",
    ""
  );
  const command = new DeleteObjectCommand({
    Bucket: "myimagedatabasejensenbean",
    Key: key,
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

const sendDeleteUrl = async (req, res, next) => {
  const itemUrl = req.params.url;

  try {
    const deleteUrl = await generateDeleteUrl(itemUrl);

    res.status(200).send({ deleteUrl });
  } catch (err) {
    next(err);
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
      return res.send({ token, user });
    })
    .catch((err) => {
      if (err.message === "Incorrect Email or Password") {
        return next(new BadRequestError("Incorrect Email or Password"));
      }
      return next(err);
    });
};

const signUp = async (req, res, next) => {
  const { name, userName, avatar, email, password } = req.body;
  console.log(req.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 4);
    User.create({ name, userName, avatar, email, password: hashedPassword })
      .then((user) => {
        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        const userData = {
          _id: user._id,
          name: user.name,
          avatar: user.avatar,
          email: user.email,
          phoneNumber: user.phoneNumber,
          about: user.about,
          profession: user.profession,
          resumeUrl: user.resumeUrl,
          showContactMe: user.showContactMe,
          userName: user.userName,
        };
        res.status(201).send({ userData, token });
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          console.log(err);

          next(new BadRequestError(err.message));
        } else if (err.code === 11000) {
          // console.log(err);
          next(new ConflictError("Email or Username has already been used."));
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
  const {
    name,
    avatar,
    phoneNumber,
    showContactMe,
    profession,
    resumeUrl,
    about,
  } = req.body;
  console.log(phoneNumber);

  User.findByIdAndUpdate(
    userId,
    { name, avatar, phoneNumber, showContactMe, profession, resumeUrl, about },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((newDoc) => {
      res.send({ newDoc });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError(`User does not exist.`));
      } else {
        next(err);
      }
    });
};

const deleteUserProfile = (req, res, next) => {
  const userId = req.user.id;
  console.log(userId);

  User.findByIdAndDelete(userId)
    .orFail()
    .then((deletedUser) => {
      res.send({ deletedUser: deletedUser.name });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("No user found"));
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
  sendDeleteUrl,
  deleteUserProfile,
};

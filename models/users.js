const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "You must provide a valid email address",
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 2,
    select: false,
  },
  profession: {
    type: String,
    default: "A Silly Billy",
    minLength: 2,
    maxLength: 100,
  },
  resumeUrl: {
    type: String,
    default: "",
    validate: {
      validator: (value) => !value || validator.isURL(value),
      message: "You must provide a valid URL",
    },
  },
  about: {
    type: String,
    // required: true,
    maxLength: 3000,
    default: "This user prefers to keep an air of mystery about them.",
  },
  avatar: {
    type: String,
    default:
      "https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-profile-picture-business-profile-woman-suitable-social-media-profiles-icons-screensavers-as-templatex9_719432-1351.jpg?semt=ais_hybrid&w=740&q=80",
    validate: {
      validator: (value) => validator.isURL(value),
      message: "You must provide a valid URL",
    },
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      // console.log(`User: ${user}`);

      if (!user) {
        return Promise.reject(new Error("Incorrect Email or Password"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect Email or Password"));
        }

        return user;
      });
    });
};

module.exports = mongoose.model("User", userSchema);

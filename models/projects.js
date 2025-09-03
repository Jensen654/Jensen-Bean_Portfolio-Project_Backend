const validator = require("validator");
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 10,
  },
  title: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 10,
  },
  title: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  description: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 1000,
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
      message: "You must provide a valid URL",
    },
  },
  videoUrl: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
      message: "You must provide a valid video URL",
    },
  },
  image: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

module.exports = mongoose.model("Project", projectSchema);

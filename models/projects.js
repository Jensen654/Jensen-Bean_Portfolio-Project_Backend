const validator = require("validator");
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
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
    validate: {
      validator: (value) => {
        if (value) {
          validator.isURL(value);
        }
        return;
      },
      message: "You must provide a valid URL",
    },
  },
  videoUrl: {
    type: String,
    validate: {
      validator: (value) => {
        if (value) {
          validator.isURL(value);
        }
        return;
      },
      message: "You must provide a valid video URL",
    },
  },
  image: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

projectSchema.statics.findOwnersProjects = function findOwnersProjects({
  ownerId,
}) {
  return this.find({ owner: ownerId }).then((projects) => {
    if (!projects) {
      return Promise.reject(new Error("No Projects"));
    }
    return projects;
  });
};

projectSchema.statics.findPublicProjects = function findPubliccProjects({
  userName,
}) {
  return this.find({ owner: userName }).then((projects) => {
    if (!projects) {
      return Promise.reject(new Error("No Projects"));
    }
    return projects;
  });
};

module.exports = mongoose.model("Project", projectSchema);

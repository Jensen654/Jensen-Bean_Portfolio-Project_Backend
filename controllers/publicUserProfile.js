const User = require("../models/users");
const Project = require("../models/projects");
const NotFoundError = require("../errors/NotFoundError");

function GetPublicUser(req, res, next) {
  const { userName } = req.params;

  User.findOne({ userName })
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
}

async function GetPublicProjects(req, res, next) {
  const { userName } = req.params;

  const user = await User.findOne({ userName })
    .orFail()
    .then((user) => {
      return user;
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      } else {
        return next(err);
      }
    });

  Project.findPublicProjects({ userName: user.id })
    .then((projects) => {
      //   console.log(projects);

      res.status(200).send(projects);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Nothing found"));
      } else {
        return next(err);
      }
    });
}

module.exports = { GetPublicUser, GetPublicProjects };

const Project = require("../models/projects.js");

const limitMiddleware = (req, res, next) => {
  const user = req.user.id;
  Project.countDocuments({ owner: user })
    .then((count) => {
      if (count >= 30) {
        return res.status(403).send({
          message:
            "Project limit reached. Delete existing projects to add new ones.",
        });
      }
      next();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = limitMiddleware;

const Project = require("../models/projects");
const NotFoundError = require("../errors/NotFoundError");

const getProjects = (req, res, next) => {
  const ownerId = req.user.id;
  // console.log(ownerId);

  Project.findOwnersProjects({ ownerId: ownerId })
    .then((projects) => {
      // console.log(projects);

      res.status(200).send(projects);
    })
    .catch((err) => {
      // console.log(err);

      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Nothing found"));
      } else {
        return next(err);
      }
    });
};

const addNewProject = (req, res, next) => {
  const ownerId = req.user.id;
  const { type, title, description, url, videoUrl, image } = req.body;
  Project.create({
    type,
    title,
    description,
    url,
    videoUrl,
    image,
    owner: ownerId,
  })
    .then((project) => {
      res.status(201).send({ project });
    })

    .catch(next);
};

const deleteProject = (req, res, next) => {
  const { projectId } = req.body;
  Project.findByIdAndDelete(projectId)
    .orFail()
    .then(() =>
      res.status(200).send({ message: "Project Successfully Deleted" })
    );
};

module.exports = {
  getProjects,
  addNewProject,
  deleteProject,
};

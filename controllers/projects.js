const Project = require("../models/projects");

const getProjects = (req, res, next) => {
  Project.find()
    .then((projects) => res.json(projects))
    .catch((err) => res.status(500).json({ error: err.message }));
};

const addNewProject = (req, res, next) => {
  const { type, title, description, url, videoUrl, image, owner } = req.body;
  Project.create({ type, title, description, url, videoUrl, image, owner })
    .then((project) => {
      console.log(project);

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

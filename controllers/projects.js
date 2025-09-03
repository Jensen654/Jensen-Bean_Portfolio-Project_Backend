const Project = require("../models/projects");

const getProjects = (req, res, next) => {
  Project.find()
    .then((projects) => res.json(projects))
    .catch((err) => res.status(500).json({ error: err.message }));
};

const addNewProject = (req, res, next) => {
  Project.create(req.body)
    .then((project) => res.status(201).send(project))
    .catch(next);
};

module.exports = {
  getProjects,
  addNewProject,
};

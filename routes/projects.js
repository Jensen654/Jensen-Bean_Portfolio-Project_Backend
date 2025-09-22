const router = require("express").Router();
const {
  getProjects,
  addNewProject,
  deleteProject,
  updateProject,
} = require("../controllers/projects");

router.get("/", getProjects);
router.post("/", addNewProject);
router.delete("/", deleteProject);
router.patch("/", updateProject);

module.exports = router;

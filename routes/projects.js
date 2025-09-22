const router = require("express").Router();
const {
  getProjects,
  addNewProject,
  deleteProject,
  updateProject,
} = require("../controllers/projects");
const limitMiddleware = require("../middleware/limit-middleware");

router.get("/", getProjects);
router.post("/", limitMiddleware, addNewProject);
router.delete("/", deleteProject);
router.patch("/", updateProject);

module.exports = router;

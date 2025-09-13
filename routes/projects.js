const router = require("express").Router();
const {
  getProjects,
  addNewProject,
  deleteProject,
} = require("../controllers/projects");
const { authMiddleware } = require("../middleware/auth-middleware");

router.get("/", getProjects);
router.post("/", authMiddleware, addNewProject);
router.delete("/", authMiddleware, deleteProject);

module.exports = router;

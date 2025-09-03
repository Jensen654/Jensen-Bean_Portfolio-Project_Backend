const router = require("express").Router();
const { getProjects, addNewProject } = require("../controllers/projects");

router.get("/", getProjects);
router.post("/", addNewProject);

module.exports = router;

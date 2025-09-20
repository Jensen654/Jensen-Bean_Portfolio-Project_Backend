const router = require("express").Router({ mergeParams: true });
const {
  GetPublicUser,
  GetPublicProjects,
} = require("../controllers/publicUserProfile");

router.get("/", GetPublicUser);
router.get("/projects", GetPublicProjects);

module.exports = router;

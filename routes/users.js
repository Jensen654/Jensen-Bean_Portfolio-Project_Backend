const router = require("express").Router();
const {
  getCurrentUser,
  generateUploadUrl,
} = require("../controllers/users.js");

router.get("/confirm", getCurrentUser);
router.get("/upload-url", generateUploadUrl);

module.exports = router;

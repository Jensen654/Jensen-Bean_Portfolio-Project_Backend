const router = require("express").Router();
const { getCurrentUser, sendUploadUrl } = require("../controllers/users.js");

router.get("/confirm", getCurrentUser);
router.get("/upload-url", sendUploadUrl);

module.exports = router;

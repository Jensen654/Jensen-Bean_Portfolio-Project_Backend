const router = require("express").Router();
const {
  getCurrentUser,
  sendUploadUrl,
  updateUserInfo,
} = require("../controllers/users.js");

router.get("/confirm", getCurrentUser);
router.get("/upload-url", sendUploadUrl);
router.patch("/me", updateUserInfo);

module.exports = router;

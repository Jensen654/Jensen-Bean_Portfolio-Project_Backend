const router = require("express").Router();
const {
  getCurrentUser,
  sendUploadUrl,
  updateUserInfo,
  sendDeleteUrl,
  deleteUserProfile,
} = require("../controllers/users.js");

router.get("/confirm", getCurrentUser);
router.get("/upload-url", sendUploadUrl);
router.patch("/me", updateUserInfo);
router.get("/delete-url/:url", sendDeleteUrl);
router.delete("/me", deleteUserProfile);

module.exports = router;

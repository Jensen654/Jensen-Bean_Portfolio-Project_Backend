const router = require("express").Router();
const { getCurrentUser } = require("../controllers/users.js");

router.get("/confirm", getCurrentUser);

module.exports = router;

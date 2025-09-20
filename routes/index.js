const express = require("express");
const router = express.Router();
const ProjectRouter = require("./projects");
const UserRouter = require("./users");
const PublicUserRouter = require("./publicUserProfile");
const { login, signUp } = require("../controllers/users");
const { authMiddleware } = require("../middleware/auth-middleware");
const { userCreatorValidator } = require("../middleware/validation");

// Define routes
router.use("/projects", ProjectRouter);
router.use("/users", authMiddleware, UserRouter);
router.post("/login", login);
router.post("/signup", userCreatorValidator, signUp);
router.use("/:userName", PublicUserRouter);

// Export the router
module.exports = router;

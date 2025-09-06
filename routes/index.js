const express = require("express");
const router = express.Router();
const ProjectRouter = require("./projects");
const UserRouter = require("./users");
const { login, signUp } = require("../controllers/users");
const { authMiddleware } = require("../middleware/auth-middleware");

// Define routes
router.use("/projects", ProjectRouter);
router.use("/users", authMiddleware, UserRouter);
router.post("/login", login);
router.post("/signup", signUp);

// Export the router
module.exports = router;

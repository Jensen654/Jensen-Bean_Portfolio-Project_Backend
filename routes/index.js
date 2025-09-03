const express = require("express");
const router = express.Router();
const ProjectRouter = require("./projects");
const UserRouter = require("./users");
const { login, signUp } = require("../controllers/users");

// Define routes
router.use("/projects", ProjectRouter);
router.use("/users", UserRouter);
router.post("/login", login);
router.post("/signup", signUp);

// Export the router
module.exports = router;

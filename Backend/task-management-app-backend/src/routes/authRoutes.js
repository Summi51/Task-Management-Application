const express = require("express");

const controller = require('../controllers/authController')
const router = express.Router();

// Register a new user
router.post("/register", controller.Signup);

// Login a user
router.post("/login", controller.userSignin);

// Get all users with role 'user'
router.get("/users", controller.getUsersByRole);


module.exports = router;

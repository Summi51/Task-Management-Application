const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const rbacMiddleware = require("../middlewares/rbacMiddleware");
const controller = require("../controllers/taskController");

const router = express.Router();

// Admin routes
router.get("/", authMiddleware, rbacMiddleware(["admin"]), controller.getAllTasks);
router.post("/create", authMiddleware, rbacMiddleware(["admin"]), controller.createTask);
router.delete("/:id", authMiddleware, rbacMiddleware(["admin"]), controller.deleteTask);

// User routes
router.get("/user", authMiddleware, rbacMiddleware(["user"]), controller.getUserTasks);
router.put("/:id", authMiddleware, rbacMiddleware(["user"]), controller.updateTaskStatus);

module.exports = router;

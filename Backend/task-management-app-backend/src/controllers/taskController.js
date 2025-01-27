const Task = require("../models/taskModel");

// Get all tasks (Admin only)
exports.getAllTasks = async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const tasks = await Task.find()
      .populate({
        path: "assignedTo.userId", 
        select: "username email"    
      });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new task (Admin only)
exports.createTask = async (req, res) => {
  const { title, description, dueDate, status, assignedTo } = req.body;

  // Role-based access control
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  if (!title || !description || !dueDate || !assignedTo || assignedTo.length === 0) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Create a task for each user in assignedTo
  const tasks = assignedTo.map((user) => ({
    title, 
    description, 
    dueDate, 
    status, 
    assignedTo: [{ userId: user.userId, status: user.status }]
  }));

  try {
    await Task.insertMany(tasks);
    res.status(201).json({ message: "Tasks assigned successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to assign tasks.", error });
  }
};


// Delete a task (Admin only)
exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  // Role-based access control
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get task (User only) 
exports.getUserTasks = async (req, res) => {
  if (req.userRole !== "user") {
    return res.status(403).json({ message: "Access denied. Users only." });
  }

  try {
    const tasks = await Task.find({
      assignedTo: { $elemMatch: { userId: req.userId } } 
    });
    const userTasks = tasks.map(task => {
      const assignedToUser = task.assignedTo.find(user => user.userId.toString() === req.userId);
      return {
        ...task.toObject(),
        assignedTo: [assignedToUser] 
      };
    });

    res.status(200).json(userTasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update task status (User only)
exports.updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (req.userRole !== "user") {
    return res.status(403).json({ message: "Access denied. Users only." });
  }

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const task = await Task.findOne({ 
      _id: id, 
      "assignedTo.userId": req.userId 
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }
    const userIndex = task.assignedTo.findIndex((user) => user.userId.toString() === req.userId);
    
    if (userIndex !== -1) {
      task.assignedTo[userIndex].status = status;
    } else {
      return res.status(404).json({ message: "User is not assigned to this task" });
    }
    await task.save();

    res.status(200).json({ message: "Task status updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


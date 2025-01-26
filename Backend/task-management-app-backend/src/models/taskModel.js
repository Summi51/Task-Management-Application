const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "in progress"],
      default: "pending",
    },
    assignedTo: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: {
          type: String,
          enum: ["pending", "in progress", "completed"],
          default: "pending",
        },
      },
    ],
  },
  { versionKey: false }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;

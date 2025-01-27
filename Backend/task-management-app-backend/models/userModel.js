const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], required: true },
  },
  { versionKey: false } 
);

const User = mongoose.model("User", userSchema);
module.exports = User;

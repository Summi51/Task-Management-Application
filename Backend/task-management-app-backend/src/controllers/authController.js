const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

//Register
exports.Signup = async (req, res) => {
  const { username, email, password, role } = req.body;
  
  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hash = await bcrypt.hash(password, 5);

    // Create new user
    const user = new User({
      username,
      email,
      password: hash,
      role,
    });

    await user.save();

    res.status(200).json({
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


// Login a user
exports.userSignin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign({ authorID: user._id,role: user.role  }, "taskmanage");
          res.status(200).send({ msg: "login sucessfull", token: token, role: user.role});
        } else {
          res.status(400).send({ msg: "wrong credentials" });
        }
      });
    }
else {
      res.status(400).send({ msg: "wrong credentials" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Iinternal server Error",
    });
  }
};

// Get all users with role 'user'
exports.getUsersByRole = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });

    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "No users found with the 'user' role",
      });
    }

    res.status(200).json({
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

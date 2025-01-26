const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

// Register a new user
exports.Signup = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      const user = new User({
        username,
        email,
        password: hash,
        role,
      });
      await user.save();

      res.status(200).json({
        message: "Register user sucessfully",
        data: user,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
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
          res.status(200).send({ msg: "login sucessfull", token: token });
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

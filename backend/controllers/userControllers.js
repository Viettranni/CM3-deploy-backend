const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT
const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, {
    expiresIn: "3d",
  });
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Register new user
// @route   POST /api/users/signup
// @access  Public
const signupUser = async (req, res) => {
  const {
    name,
    username,
    password,
    phone_number,
    gender,
    date_of_birth,
    membership_status,
    address,
    profile_picture
  } = req.body;
  try {
    if (
      !name ||
      !username ||
      !password ||
      !phone_number ||
      !gender ||
      !date_of_birth ||
      !membership_status ||
      !address ||
      !profile_picture
    ) {
      res.status(400);
      throw new Error("Please add all fields");
    }
    // Check if user exists
    const userExists = await User.findOne({ username });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
    name,
    username,
    password: hashedPassword,
    phone_number,
    gender,
    date_of_birth,
    membership_status,
    address,
    profile_picture
    });

    console.log(user)


    if (user) {
      console.log(user._id);
     const token = generateToken(user._id);
     console.log("this should be the token", token);
      res.status(201).json({ username, token });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password)
  try {
    // Check for user username
    const user = await User.findOne({ username });
    console.log("User found", user)

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log(user._id);
      const token = generateToken(user._id);
      res.status(200).json({ username, token });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
      console.log("user id", user._id)
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  getMe,
  getAllUsers
};

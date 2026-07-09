const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  asyncHandler
} = require("../middleware/errorHandler");
function generateToken(user) {
  return jwt.sign({
    id: user._id,
    role: user.role,
    name: user.name
  }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
}
const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role
  } = req.body;
  const existingUser = await User.findOne({
    email
  });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "Email already registered"
    });
  }
  const user = await User.create({
    name,
    email,
    password,
    role
  });
  res.status(201).json({
    success: true,
    token: generateToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});
const loginUser = asyncHandler(async (req, res) => {
  const {
    email,
    password
  } = req.body;
  const user = await User.findOne({
    email
  });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  }
  res.status(200).json({
    success: true,
    token: generateToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});
module.exports = {
  registerUser,
  loginUser
};

const express = require("express");
const router = express.Router();
const {
  body
} = require("express-validator");
const {
  registerUser,
  loginUser
} = require("../controllers/authController");
const validateRequest = require("../middleware/validateRequest");
const registerValidation = [body("name").notEmpty().withMessage("Name is required"), body("email").isEmail().withMessage("Valid email required"), body("password").isLength({
  min: 6
}).withMessage("Password must be at least 6 characters")];
const loginValidation = [body("email").isEmail().withMessage("Valid email required"), body("password").notEmpty().withMessage("Password is required")];
router.post("/register", registerValidation, validateRequest, registerUser);
router.post("/login", loginValidation, validateRequest, loginUser);
module.exports = router;

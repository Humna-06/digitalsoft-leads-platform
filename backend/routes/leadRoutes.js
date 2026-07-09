const express = require("express");
const router = express.Router();
const {
  body
} = require("express-validator");
const {
  createLead,
  getLeads,
  getLeadById,
  updateLeadStatus,
  deleteLead
} = require("../controllers/leadController");
const validateRequest = require("../middleware/validateRequest");
const {
  protect
} = require("../middleware/auth");
const leadValidationRules = [body("fullName").trim().notEmpty().withMessage("Full name is required"), body("email").isEmail().withMessage("A valid email is required"), body("phone").notEmpty().withMessage("Phone number is required"), body("service").isIn(["Web Development", "Mobile Application", "AI Solution", "ERP/CRM", "Consultation"]).withMessage("Please select a valid service"), body("budget").isNumeric().withMessage("Budget must be a number"), body("timeline").isIn(["Urgent", "Flexible"]).withMessage("Timeline must be Urgent or Flexible"), body("description").trim().notEmpty().withMessage("Project description is required")];
router.post("/", leadValidationRules, validateRequest, createLead);
router.get("/", protect, getLeads);
router.get("/:id", protect, getLeadById);
router.put("/:id/status", protect, updateLeadStatus);
router.delete("/:id", protect, deleteLead);
module.exports = router;

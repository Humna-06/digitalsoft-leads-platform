const express = require("express");
const router = express.Router();
const {
  body
} = require("express-validator");
const {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment
} = require("../controllers/appointmentController");
const validateRequest = require("../middleware/validateRequest");
const {
  protect
} = require("../middleware/auth");
const appointmentValidationRules = [body("startTime").isISO8601().withMessage("startTime must be a valid date"), body("endTime").isISO8601().withMessage("endTime must be a valid date"), body().custom(value => {
  if (!value.leadId && !value.leadEmail) {
    throw new Error("Either leadId or leadEmail is required");
  }
  return true;
})];
router.post("/", appointmentValidationRules, validateRequest, createAppointment);
router.get("/", protect, getAppointments);
router.put("/:id", protect, updateAppointment);
router.delete("/:id", protect, deleteAppointment);
module.exports = router;

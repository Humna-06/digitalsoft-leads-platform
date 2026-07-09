const express = require("express");
const router = express.Router();
const {
  getAvailability,
  exportCalendarEvent
} = require("../controllers/calendarController");
router.get("/availability", getAvailability);
router.get("/export/:id", exportCalendarEvent);
module.exports = router;

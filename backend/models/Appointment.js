const mongoose = require("mongoose");
const appointmentSchema = new mongoose.Schema({
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  meetingTitle: {
    type: String,
    default: "DigitalSoft Consultation Meeting"
  },
  description: {
    type: String,
    default: ""
  },
  calendarProvider: {
    type: String,
    enum: ["Google Calendar", "Outlook", "Apple Calendar", "Generic"],
    default: "Generic"
  },
  icsFileContent: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ["Scheduled", "Cancelled", "Rescheduled", "Completed"],
    default: "Scheduled"
  }
}, {
  timestamps: true
});
module.exports = mongoose.model("Appointment", appointmentSchema);

const Appointment = require("../models/Appointment");
const Lead = require("../models/Lead");
const {
  generateICS
} = require("../services/icsService");
const {
  asyncHandler
} = require("../middleware/errorHandler");
const createAppointment = asyncHandler(async (req, res) => {
  const {
    leadId,
    leadEmail,
    startTime,
    endTime,
    meetingTitle,
    description
  } = req.body;
  let lead;
  if (leadId) {
    lead = await Lead.findById(leadId);
  } else if (leadEmail) {
    lead = await Lead.findOne({
      email: leadEmail.toLowerCase()
    }).sort({
      createdAt: -1
    });
  }
  if (!lead) {
    return res.status(404).json({
      success: false,
      message: "No lead found with that email. Please submit an inquiry first."
    });
  }
  const icsContent = await generateICS({
    startTime,
    endTime,
    meetingTitle,
    description
  }, lead);
  const appointment = await Appointment.create({
    leadId: lead._id,
    startTime,
    endTime,
    meetingTitle,
    description,
    icsFileContent: icsContent,
    status: "Scheduled"
  });
  lead.status = "Meeting Scheduled";
  await lead.save();
  res.status(201).json({
    success: true,
    message: "Appointment booked successfully",
    data: appointment
  });
});
const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find().populate("leadId").sort({
    startTime: 1
  });
  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments
  });
});
const updateAppointment = asyncHandler(async (req, res) => {
  const {
    startTime,
    endTime,
    status
  } = req.body;
  const appointment = await Appointment.findById(req.params.id).populate("leadId");
  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: "Appointment not found"
    });
  }
  if (startTime && endTime) {
    appointment.startTime = startTime;
    appointment.endTime = endTime;
    appointment.status = "Rescheduled";
    appointment.icsFileContent = await generateICS({
      startTime,
      endTime,
      meetingTitle: appointment.meetingTitle,
      description: appointment.description
    }, appointment.leadId);
  }
  if (status === "Cancelled") {
    appointment.status = "Cancelled";
  }
  await appointment.save();
  res.status(200).json({
    success: true,
    message: "Appointment updated",
    data: appointment
  });
});
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);
  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: "Appointment not found"
    });
  }
  res.status(200).json({
    success: true,
    message: "Appointment deleted"
  });
});
module.exports = {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment
};

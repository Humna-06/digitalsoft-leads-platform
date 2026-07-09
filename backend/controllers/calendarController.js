const Appointment = require("../models/Appointment");
const { asyncHandler } = require("../middleware/errorHandler");
const getAvailability = asyncHandler(async (req, res) => {
  const { date } = req.query; 
  if (!date) {
    return res.status(400).json({ success: false, message: "Please provide a date (YYYY-MM-DD)" });
  }
  const allSlots = [];
  for (let hour = 9; hour < 17; hour++) {
    const slotStart = new Date(`${date}T${String(hour).padStart(2, "0")}:00:00`);
    const slotEnd = new Date(`${date}T${String(hour + 1).padStart(2, "0")}:00:00`);
    allSlots.push({ startTime: slotStart, endTime: slotEnd });
  }
  const startOfDay = new Date(`${date}T00:00:00`);
  const endOfDay = new Date(`${date}T23:59:59`);
  const bookedAppointments = await Appointment.find({
    startTime: { $gte: startOfDay, $lte: endOfDay },
    status: { $ne: "Cancelled" },
  });
  const bookedStartTimes = bookedAppointments.map((a) => new Date(a.startTime).getTime());
  const slotsWithAvailability = allSlots.map((slot) => ({
    ...slot,
    available: !bookedStartTimes.includes(slot.startTime.getTime()),
  }));

  res.status(200).json({ success: true, date, slots: slotsWithAvailability });
});
const exportCalendarEvent = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment || !appointment.icsFileContent) {
    return res.status(404).json({ success: false, message: "Calendar file not found" });
  }
  res.setHeader("Content-Type", "text/calendar");
  res.setHeader("Content-Disposition", `attachment; filename=meeting-${appointment._id}.ics`);
  res.send(appointment.icsFileContent);
});
module.exports = { getAvailability, exportCalendarEvent };

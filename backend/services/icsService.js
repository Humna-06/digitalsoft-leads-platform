const ics = require("ics");
function generateICS(appointment, lead) {
  return new Promise((resolve, reject) => {
    const start = new Date(appointment.startTime);
    const end = new Date(appointment.endTime);
    const event = {
      title: appointment.meetingTitle || "DigitalSoft Consultation Meeting",
      description: appointment.description || "",
      start: [start.getFullYear(), start.getMonth() + 1, start.getDate(), start.getHours(), start.getMinutes()],
      end: [end.getFullYear(), end.getMonth() + 1, end.getDate(), end.getHours(), end.getMinutes()],
      organizer: {
        name: process.env.ORGANIZER_NAME || "DigitalSoft Team",
        email: process.env.ORGANIZER_EMAIL || "meetings@digitalsoft.com"
      },
      attendees: [{
        name: lead.fullName,
        email: lead.email,
        rsvp: true
      }],
      status: "CONFIRMED"
    };
    ics.createEvent(event, (error, value) => {
      if (error) {
        return reject(error);
      }
      resolve(value);
    });
  });
}
module.exports = {
  generateICS
};

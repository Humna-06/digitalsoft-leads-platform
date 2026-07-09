require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const {
  errorHandler
} = require("./middleware/errorHandler");
const leadRoutes = require("./routes/leadRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const authRoutes = require("./routes/authRoutes");
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/leads", leadRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "DigitalSoft Lead Management API is running"
  });
});
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

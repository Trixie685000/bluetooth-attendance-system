const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

// Register routes
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);

// Homepage
app.get("/", (req, res) => {
    res.send("Bluetooth Attendance Management System API is running!");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
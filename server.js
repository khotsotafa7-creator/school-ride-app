// server.js — SchoolRide V1 Backend

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

//////////////////////////////////////////////////////
// Middleware
//////////////////////////////////////////////////////

app.use(cors());
app.use(express.json());

//////////////////////////////////////////////////////
// Routes
//////////////////////////////////////////////////////

const authRoutes = require("./routes/auth");
const childrenRoutes = require("./routes/children");
const schoolsRoutes = require("./routes/schools");

app.use("/api/auth", authRoutes);
app.use("/api/children", childrenRoutes);
app.use("/api/schools", schoolsRoutes);

//////////////////////////////////////////////////////
// Health Check
//////////////////////////////////////////////////////

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SchoolRide API is running",
    version: "1.0",
  });
});

//////////////////////////////////////////////////////
// 404 Handler
//////////////////////////////////////////////////////

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found.",
  });
});

//////////////////////////////////////////////////////
// Start Server
//////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
// server.js — SchoolRide V1 Backend
require('dotenv').config();

const express  = require('express');
const cors     = require('cors');

const app      = express();
const PORT     = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// ── Health Check ──────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'SchoolRide API running', version: '1.0' });
});

// ── Start Server ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
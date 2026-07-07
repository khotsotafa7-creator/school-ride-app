 // routes/auth.js — SchoolRide V1
// Handles user registration and login verification

const express    = require('express');
const router     = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma     = new PrismaClient();

// ── Firebase Admin Setup ──────────────────────────────────────────────────
const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const serviceAccount = require("../firebase-key.json");

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

// ── Middleware: Verify Firebase Token ─────────────────────────────────────
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
   const decoded = await getAuth().verifyIdToken(token); 
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// ── POST /api/auth/register ───────────────────────────────────────────────
// Called after Firebase creates the account
// Creates User + ParentProfile or DriverProfile
router.post('/register',  async (req, res) => {
    console.log("REGISTER ROUTE REACHED");
  const { firebaseUid, fullName, email, phoneNumber, role } = req.body;

  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { firebaseUid }
    });
    if (existing) {
      return res.status(400).json({ error: 'User already registered' });
    }

    // Create the User record
    const user = await prisma.user.create({
      data: {
        firebaseUid,
        fullName,
        email,
        phoneNumber,
        role: role.toUpperCase(),
        lastLoginAt: new Date(),
      }
    });

    // Create role-specific profile
    if (role.toUpperCase() === 'PARENT') {
      await prisma.parentProfile.create({
        data: { userId: user.id }
      });
    } else if (role.toUpperCase() === 'DRIVER') {
      await prisma.driverProfile.create({
        data: { userId: user.id }
      });
    }

    // Fetch complete user with profile
    const fullUser = await prisma.user.findUnique({
      where:   { id: user.id },
      include: { parentProfile: true, driverProfile: true }
    });

    res.json({ success: true, user: fullUser });

  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────────────────
// Verifies token, returns user data + role for navigation

  
router.post('/login', async (req, res) => {
  const { firebaseUid } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid },
      include: {
        parentProfile: true,
        driverProfile: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "Account suspended" });
    }

    await prisma.user.update({
      where: { firebaseUid },
      data: {
        lastLoginAt: new Date()
      }
    });

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Login failed"
    });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────
// Returns current user data
router.get('/me',  async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid: "123456" },
      include: { parentProfile: true, driverProfile: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch user' });
  }
});

module.exports = router;

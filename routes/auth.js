// routes/auth.js — SchoolRide V1
// Handles user registration and login verification

const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ── Firebase Admin Setup ────────────────────────────────────────────────
const { initializeApp, cert, getApps } = require("firebase-admin/app");

const serviceAccount = require("../firebase-key.json");

const verifyToken = require("../middleware/verifyToken");

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

/////////////////////////////////////////////////////////
// POST /api/auth/register
/////////////////////////////////////////////////////////

router.post('/register', async (req, res) => {

  console.log("REGISTER ROUTE REACHED");

  const {
    firebaseUid,
    fullName,
    email,
    phoneNumber,
    role
  } = req.body;

  try {

    const existing = await prisma.user.findUnique({
      where: {
        firebaseUid
      }
    });

    if (existing) {
      return res.status(400).json({
        error: "User already registered"
      });
    }

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

    if (role.toUpperCase() === "PARENT") {

      await prisma.parentProfile.create({
        data: {
          userId: user.id
        }
      });

    } else if (role.toUpperCase() === "DRIVER") {

      await prisma.driverProfile.create({
        data: {
          userId: user.id
        }
      });

    }

    const fullUser = await prisma.user.findUnique({
      where: {
        id: user.id
      },
      include: {
        parentProfile: true,
        driverProfile: true
      }
    });

    res.json({
      success: true,
      user: fullUser
    });

  } catch (error) {

    console.error(error);

    if (error.code === "P2002") {
      return res.status(400).json({
        error: "Email already registered"
      });
    }

    res.status(500).json({
      error: "Registration failed"
    });

  }

});

/////////////////////////////////////////////////////////
// POST /api/auth/login
/////////////////////////////////////////////////////////

router.post('/login', async (req, res) => {

  const { firebaseUid } = req.body;

  try {

    const user = await prisma.user.findUnique({
      where: {
        firebaseUid
      },
      include: {
        parentProfile: true,
        driverProfile: true
      }
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        error: "Account suspended"
      });
    }

    await prisma.user.update({
      where: {
        firebaseUid
      },
      data: {
        lastLoginAt: new Date()
      }
    });

    res.json({
      success: true,
      user
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Login failed"
    });

  }

});

/////////////////////////////////////////////////////////
// GET /api/auth/me
/////////////////////////////////////////////////////////

router.get('/me', verifyToken, async (req, res) => {

  try {

    const user = await prisma.user.findUnique({
      where: {
        firebaseUid: req.user.uid
      },
      include: {
        parentProfile: true,
        driverProfile: true
      }
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    res.json(user);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Could not fetch user"
    });

  }

});

module.exports = router;
// routes/children.js

const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const verifyToken = require("../middleware/verifyToken");

//////////////////////////////////////////////////////////
// POST /api/children
//////////////////////////////////////////////////////////

router.post("/", verifyToken, async (req, res) => {
  console.log("POST /api/children called");
console.log(req.body);
  try {
    const user = await prisma.user.findUnique({
      where: {
        firebaseUid: req.user.uid,
      },
      include: {
        parentProfile: true,
      },
    });

    if (!user || !user.parentProfile) {
      return res.status(404).json({
        success: false,
        error: "Parent profile not found.",
      });
    }

    const {
      fullName,
      grade,
      dateOfBirth,
      gender,

      schoolName,
      schoolAddress,
      schoolSuburb,
      schoolCity,
      schoolProvince,
      postalCode,

      pickupAddress,
      dropoffAddress,

      allergies,
      medicalConditions,
      emergencyNotes,

      profilePhoto,
    } = req.body;

    if (
      !fullName ||
      !grade ||
      !schoolName ||
      !schoolCity ||
      !schoolProvince
    ) {
      return res.status(400).json({
        success: false,
        error: "Please complete all required fields.",
      });
    }

    const child = await prisma.child.create({
      data: {
        parentProfileId: user.parentProfile.id,

        fullName,
        grade,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,

        schoolName,
        schoolAddress,
        schoolSuburb,
        schoolCity,
        schoolProvince,
        postalCode,

        pickupAddress,
        dropoffAddress,

        allergies,
        medicalConditions,
        emergencyNotes,

        profilePhoto,
      },
    });
console.log("Child created:", child);
    res.status(201).json({
      success: true,
      message: "Child registered successfully.",
      child,
    });
  } catch (error) {
    console.error("Create Child Error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to register child.",
    });
  }
});

//////////////////////////////////////////////////////////
// GET ALL CHILDREN
//////////////////////////////////////////////////////////

router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        firebaseUid: req.user.uid,
      },
      include: {
        parentProfile: true,
      },
    });

    if (!user || !user.parentProfile) {
      return res.status(404).json({
        success: false,
        error: "Parent profile not found.",
      });
    }

    const children = await prisma.child.findMany({
      where: {
        parentProfileId: user.parentProfile.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
console.log("Parent ID:", user.parentProfile.id);
console.log("Children:", children);
    res.json({
      success: true,
      children,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch children.",
    });
  }
});

//////////////////////////////////////////////////////////
// GET CHILD BY ID
//////////////////////////////////////////////////////////

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const child = await prisma.child.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!child) {
      return res.status(404).json({
        success: false,
        error: "Child not found.",
      });
    }

    res.json({
      success: true,
      child,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch child.",
    });
  }
});

//////////////////////////////////////////////////////////
// UPDATE CHILD
//////////////////////////////////////////////////////////

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const child = await prisma.child.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    res.json({
      success: true,
      message: "Child updated successfully.",
      child,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to update child.",
    });
  }
});

//////////////////////////////////////////////////////////
// DELETE CHILD
//////////////////////////////////////////////////////////

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await prisma.child.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      success: true,
      message: "Child deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to delete child.",
    });
  }
});

module.exports = router;
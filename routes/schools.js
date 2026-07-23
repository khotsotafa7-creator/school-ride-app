const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//////////////////////////////////////////////////////////
// GET ALL SCHOOLS
//////////////////////////////////////////////////////////

router.get("/", async (req, res) => {
  try {

    const schools = await prisma.school.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        name: "asc"
      }
    });

    res.json({
      success: true,
      schools
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch schools."
    });

  }
});

module.exports = router;
require('dotenv').config();

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { messaging } = require("./firebase");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("School Ride API running");
});

app.get("/drivers", async (req, res) => {
  const drivers = await prisma.driver.findMany();
  res.json(drivers);
});

app.post("/notify", async (req, res) => {
  const message = {
    notification: {
      title: "School Ride Update",
      body: "Your driver has accepted the ride"
    },
    topic: "parents"
  };
  await messaging.send(message);
  res.json({ message: "Notification sent" });
});
app.post("/drivers", async (req, res) => {
  const driver = await prisma.driver.create({
    data: req.body
  });
  res.json(driver);
});
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
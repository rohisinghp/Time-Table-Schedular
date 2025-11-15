import express from "express";
import Leave from "../models/Leave.js";

const router = express.Router();

router.post("/apply", async (req, res) => {
  const { teacherName, startDate, endDate } = req.body;

  if (!teacherName || !startDate || !endDate) {
    return res.status(400).json({ message: "Invalid data" });
  }

  await Leave.create({ teacherName, startDate, endDate });

  res.json({
    message: `Leave applied for ${teacherName} from ${startDate} to ${endDate}`
  });
});

export default router;

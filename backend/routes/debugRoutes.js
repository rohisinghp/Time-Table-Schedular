import express from "express";
import Leave from "../models/Leave.js";
import Subject from "../models/Subject.js";

const router = express.Router();

function todayIST() {
  const now = new Date();
  now.setHours(now.getHours() + 5.5);
  return now.toISOString().split("T")[0];
}

// Show all leaves in DB
router.get("/all", async (req, res) => {
  const all = await Leave.find();
  res.json(all);
});

// Show active leaves TODAY
router.get("/active", async (req, res) => {
  const now = todayIST();
  const active = await Leave.find({
    startDate: { $lte: now },
    endDate: { $gte: now }
  });
  res.json({ today: now, active });
});

// Test faculty → lowercase normalization
router.get("/matchTest", async (req, res) => {
  const subjects = await Subject.find();
  const mapping = subjects.map(s => ({
    subjectCode: s._id,
    facultyOriginal: s.faculty,
    facultyNormalized: s.faculty
      .split(/[,/]/)
      .map(x => x.trim().toLowerCase())
  }));
  res.json(mapping);
});

export default router;

import express from "express";
import Subject from "../models/Subject.js";
import Leave from "../models/Leave.js";

const router = express.Router();

// Priority values (you can extend)
const subjectPriority = {
  "DSA": 5,
  "Aptitude": 4,
  "OS": 4,
  "DBMS": 3,
  "CN": 3,
  "TMC301": 3,
  "TMC302": 3,
  "TMC303": 3,
  "TMC311": 3,
  "TMC312": 3,
  "TMC304": 2,
  "DAA Lab": 3,
  "Android Lab": 3,
  "SE Lab": 3
};

// Normalize names (split by comma or slash) and lowercase
function normalizeNames(str) {
  if (!str) return [];
  return String(str)
    .split(/[,/]/)
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
}

// Check if teacher on leave (using activeLeaves array)
function isTeacherOnLeave(faculty, activeLeaves) {
  const facultyNames = normalizeNames(faculty);
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  for (const leave of activeLeaves) {
    const leaveNames = normalizeNames(leave.teacherName);
    const match = leaveNames.some(n => facultyNames.includes(n));
    if (match && todayStr >= leave.startDate && todayStr <= leave.endDate) {
      return true;
    }
  }
  return false;
}

router.get("/:section", async (req, res) => {
  try {
    const section = req.params.section;

    // Fetch all subjects
    const subjects = await Subject.find();

    // Compute today's date (UTC iso date) — matches how dates are stored as yyyy-mm-dd
    const today = new Date().toISOString().split("T")[0];

    // Find active leaves for today
    const activeLeaves = await Leave.find({
      startDate: { $lte: today },
      endDate: { $gte: today }
    });

    // If no active leaves — just return original timetable but include originalSubjectCode = _id
    if (!activeLeaves || activeLeaves.length === 0) {
      const result = subjects.map(sub => {
        const timingsForSection = (sub.timings && sub.timings[section]) ? sub.timings[section] : [];
        return {
          subjectCode: sub._id,
          subjectName: sub.subjectName,
          faculty: sub.faculty,
          timings: timingsForSection,
          originalSubjectCode: sub._id
        };
      });
      return res.json(result);
    }

    // If there are active leaves — build replacement-aware output
    const finalOutput = [];

    for (const sub of subjects) {
      // Safe access to timings (timings is plain object)
      const timingsForSection = (sub.timings && sub.timings[section]) ? sub.timings[section] : [];

      // If teacher for this subject is not on leave, keep as-is
      const onLeave = isTeacherOnLeave(sub.faculty, activeLeaves);

      if (!onLeave) {
        finalOutput.push({
          subjectCode: sub._id,
          subjectName: sub.subjectName,
          faculty: sub.faculty,
          timings: timingsForSection,
          originalSubjectCode: sub._id
        });
        continue;
      }

      // Subject is on leave — choose replacement subject (simple policy)
      // Candidate selection: choose subject with highest priority among other subjects
      const candidates = subjects
        .filter(s => s._id !== sub._id)
        .sort((a, b) => {
          const pa = subjectPriority[a._id] || 0;
          const pb = subjectPriority[b._id] || 0;
          return pb - pa; // descending: higher priority first
        });

      const replacement = (candidates.length > 0) ? candidates[0] : sub;

      // We insert replacement's code & name but keep the original timings (so UI shows replaced cell)
      finalOutput.push({
        subjectCode: replacement._id,
        subjectName: replacement.subjectName,
        faculty: replacement.faculty,
        timings: timingsForSection,
        originalSubjectCode: sub._id
      });
    }

    return res.json(finalOutput);

  } catch (err) {
    console.error("Error in /api/section/:section ->", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

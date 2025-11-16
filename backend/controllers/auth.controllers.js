import Student from "../models/student.model.js";
import Teacher from "../models/teacher.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper function for sending token
const sendToken = (user, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.SECRET_KEY,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  });

  return res.json({ success: true, token });
};

// ---------------- STUDENT REGISTER ----------------
export const registerStudent = async (req, res) => {
  try {
    const { studentId, password, course, section, emailId } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      studentId,
      password: hashedPassword,
      course,
      section,
      emailId,
      role: "student"
    });

    sendToken(student, res);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- STUDENT LOGIN ----------------
export const loginStudent = async (req, res) => {
  try {
    const { studentId, password } = req.body;

    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    sendToken(student, res);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- TEACHER REGISTER ----------------
export const registerTeacher = async (req, res) => {
  try {
    const { adminId, password, emailId } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await Teacher.create({
      adminId,
      password: hashedPassword,
      emailId,
      role: "teacher"
    });

    sendToken(teacher, res);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- TEACHER LOGIN ----------------
export const loginTeacher = async (req, res) => {
  try {
    const { adminId, password } = req.body;

    const teacher = await Teacher.findOne({ adminId });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    sendToken(teacher, res);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

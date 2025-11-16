import express from "express";
import {
  registerStudent,
  loginStudent,
  registerTeacher,
  loginTeacher
} from "../controllers/auth.controllers.js";
import { logoutUser } from "../controllers/logout.js";

const router = express.Router();

// Student Routes
router.post("/student/register", registerStudent);
router.post("/student/login", loginStudent);

// Teacher Routes
router.post("/teacher/register", registerTeacher);
router.post("/teacher/login", loginTeacher);


router.post("/logout", logoutUser);


export default router;

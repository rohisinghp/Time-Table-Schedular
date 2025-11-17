import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  emailId: {
    type: String,
    required: true,
    unique: true
  },
  role: {
  type: String,
  enum: ["student"],
  default: "student"
}
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);
export default Student;

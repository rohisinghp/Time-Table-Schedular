import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  adminId: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  emailId: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;

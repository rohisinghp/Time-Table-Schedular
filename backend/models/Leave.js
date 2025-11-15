import mongoose from "mongoose";

const LeaveSchema = new mongoose.Schema({
  teacherName: String,
  startDate: String, // format yyyy-mm-dd
  endDate: String    // format yyyy-mm-dd
});

export default mongoose.model("Leave", LeaveSchema);

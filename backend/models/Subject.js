import mongoose from "mongoose";

const TimingSchema = new mongoose.Schema({
  day: String,
  time: String
});

const SubjectSchema = new mongoose.Schema({
  _id: String,
  subjectName: String,
  faculty: String,
  course: Object,
  timings: {
    type: Object,   // IMPORTANT (Map breaks JSON)
    default: {}
  }
});

export default mongoose.model("Subject", SubjectSchema);

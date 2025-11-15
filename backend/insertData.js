import mongoose from "mongoose";
import Subject from "./models/Subject.js";
import fs from "fs";

const data = JSON.parse(fs.readFileSync("./data/timetable.json", "utf-8"));

async function connectDB() {
  await mongoose.connect("mongodb+srv://timetableschedular:timetable@cluster0.esrmk.mongodb.net/timetableschedular");
  console.log("MongoDB Connected");
}

async function insert() {
  await connectDB();

  for (const [id, subject] of Object.entries(data)) {
    await Subject.findByIdAndUpdate(id, { _id: id, ...subject }, { upsert: true });
  }

  console.log("Data inserted successfully!");
  process.exit();
}

insert();

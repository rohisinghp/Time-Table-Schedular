import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import sectionRoutes from "./routes/sectionRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import debugRoutes from './routes/debugRoutes.js'

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb+srv://timetableschedular:timetable@cluster0.esrmk.mongodb.net/timetableschedular")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

app.use("/api/section", sectionRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/leave", debugRoutes);


app.get("/", (req, res) => res.send("Timetable API Running"));

app.listen(5000, () => console.log("Server running on port 5000"));

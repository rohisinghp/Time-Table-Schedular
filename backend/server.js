import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv'


import sectionRoutes from "./routes/sectionRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import debugRoutes from './routes/debugRoutes.js'
import auth from './routes/auth.routes.js'

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config({
    path: "./.env"
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

app.use("/api/section", sectionRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/leave", debugRoutes);
app.use("/api/auth", auth)


app.get("/", (req, res) => res.send("Timetable API Running"));

app.listen(process.env.port, () => console.log("Server running on port 5000"));

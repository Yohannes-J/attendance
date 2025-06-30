import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import attendanceRouter from "./routes/attendanceRoute.js";
import studentRouter from "./routes/studentRoute.js";
import connectDB from "./config/db.js";
import schoolRouter from "./routes/schoolRoute.js";
import deptRouter from "./routes/deptRoute.js";
import adminRouter from "./routes/adminRoute.js";
import userRouter from "./routes/userRoute.js";
import courseRouter from "./routes/courseRoute.js";
import TAttendanceRouter from "./routes/tAttendanceRoute.js";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
  })
);

app.use(express.json());

// Routes
app.use("/api/admin", adminRouter);
app.use("/api/users", userRouter);
app.use("/api/students", studentRouter);
app.use("/api/attendances", attendanceRouter);

app.use("/api/Tattendances", TAttendanceRouter);
app.use("/api/school", schoolRouter);
app.use("/api/department", deptRouter);
app.use("/api/course", courseRouter);

const PORT = process.env.PORT || 2017;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

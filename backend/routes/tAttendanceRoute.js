import express from "express";
import { saveAttendance } from "../controllers/TAttendanceController.js";


const TAttendanceRouter = express.Router();

// POST /api/attendances/save-attendance
TAttendanceRouter.post("/save-attendance", saveAttendance);

export default TAttendanceRouter;

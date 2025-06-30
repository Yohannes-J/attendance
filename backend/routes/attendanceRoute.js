import express from "express";
import {
  deleteAttendance,
  getAttendance,
  saveAttendance,
} from "../controllers/attendanceController.js";

const attendanceRouter = express.Router();
attendanceRouter.post("/save-attendance", saveAttendance);
attendanceRouter.get("/get-attendance", getAttendance);
attendanceRouter.delete("/delete", deleteAttendance);

export default attendanceRouter;

// models/teAttenModel.js
import mongoose from "mongoose";

const TAttendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
    },
    attendance: {
      // Format: { Monday: { "8:00-10:00": "Present" }, ... }
      type: Map,
      of: Map,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate entries for same student on same date
TAttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

const TAttendance =
  mongoose.models.TAttendance || mongoose.model("TAttendance", TAttendanceSchema);

export default TAttendance;
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  present: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.model("Attendance", attendanceSchema);

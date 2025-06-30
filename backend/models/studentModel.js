import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  year: {
    type: String,
    enum: ["1st", "2nd", "3rd", "4th", "5th", "6th"],
    required: true,
  },
  block: { type: String, required: true },
  dorm: { type: String, required: true },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    default: null,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    default: null,
  },
});

const studentModel =
  mongoose.models.student || mongoose.model("Student", studentSchema);

export default studentModel;

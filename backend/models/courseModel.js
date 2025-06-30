import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    course: { type: String, required: true },
  },
  { timestamps: true }
);

const courseModel =
  mongoose.models.course || mongoose.model("Course", courseSchema);

export default courseModel;

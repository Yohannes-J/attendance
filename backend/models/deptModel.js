import mongoose from "mongoose";

const deptSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    department: { type: String, required: true },
  },
  { timestamps: true }
);

const deptModel =
  mongoose.models.department || mongoose.model("Department", deptSchema);

export default deptModel;

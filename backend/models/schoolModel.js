import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema(
  {
    school: { type: String, required: true },
  },
  { timestamps: true }
);

const schoolModel =
  mongoose.models.department || mongoose.model("School", schoolSchema);

export default schoolModel;

import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Invalid email format"],
    },
    password: { type: String, required: true },
    salt: { type: String, required: true }, // NEW: for crypto-based hashing
    role: {
      type: String,
      enum: ["dep-head", "teacher", "procter"],
      required: true,
    },
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School", default: null },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", default: null },
    image: {
      type: String,
  
    },
  },
  { timestamps: true }
);



export default mongoose.model("User", userSchema);

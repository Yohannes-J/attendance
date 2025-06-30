import TAttendance from "../models/teAttenModel.js";

export const saveAttendance = async (req, res) => {
  try {
    const { attendance, date } = req.body;

    if (!attendance || !Array.isArray(attendance) || !date) {
      return res
        .status(400)
        .json({ message: "Invalid attendance data or missing date" });
    }

    for (const record of attendance) {
      const { studentId, attendance: studentAttendance } = record;

      if (!studentId || !studentAttendance) continue;

      await TAttendance.findOneAndUpdate(
        { studentId, date },
        { studentId, date, attendance: studentAttendance },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    res.status(200).json({ message: "Attendance saved successfully" });
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).json({ message: "Server error saving attendance" });
  }
};

import attendanceModel from "../models/attendanceModel.js";

// Save or update attendance records (upsert)
export const saveAttendance = async (req, res) => {
  try {
    let records = req.body;

    // Validate input is an array
    if (!Array.isArray(records)) {
      return res.status(400).json({ error: "Data must be an array" });
    }

    // Prepare bulk operations for upsert
    const bulkOps = records.map((r, i) => {
      if (!r.studentId || !r.date || typeof r.present === "undefined") {
        throw new Error(`Record at index ${i} is missing required fields.`);
      }

      const parsedDate = new Date(r.date);
      if (isNaN(parsedDate)) {
        throw new Error(`Invalid date format at index ${i}: ${r.date}`);
      }

      return {
        updateOne: {
          filter: { studentId: r.studentId, date: parsedDate },
          update: {
            $set: {
              present: r.present === true || r.present === "true",
              date: parsedDate, // ensure date stored correctly
              studentId: r.studentId, // ensure studentId stored
            },
          },
          upsert: true,
        },
      };
    });

    // Perform bulkWrite operation
    await attendanceModel.bulkWrite(bulkOps);

    res.status(201).json({ message: "Attendance records saved successfully" });
  } catch (err) {
    console.error("Save Attendance Error:", err);
    res
      .status(500)
      .json({ error: "Failed to save attendance", message: err.message });
  }
};

// Get attendance records by month/year (optionally by studentId)
export const getAttendance = async (req, res) => {
  try {
    const { studentId, month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: "Month and year are required" });
    }

    const fromDate = new Date(year, month - 1, 1);
    const toDate = new Date(year, month, 0, 23, 59, 59, 999);

    const query = {
      date: { $gte: fromDate, $lte: toDate },
    };

    if (studentId && studentId !== "all") {
      query.studentId = studentId;
    }

    // Find and select only requested fields, exclude _id
    const records = await attendanceModel
      .find(query)
      .select("studentId present date -_id")
      .lean();

    res.json(records);
  } catch (err) {
    console.error("Get Attendance Error:", err);
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
};


// DELETE attendance by studentId and date
export const deleteAttendance = async (req, res) => {
  try {
    const { studentId, date } = req.query;

    if (!studentId || !date) {
      return res.status(400).json({ error: "studentId and date are required" });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const result = await attendanceModel.findOneAndDelete({
      studentId,
      date: parsedDate,
    });

    if (!result) {
      return res.status(404).json({ error: "Attendance not found" });
    }

    res.json({ message: "Attendance deleted successfully" });
  } catch (err) {
    console.error("Delete Attendance Error:", err);
    res.status(500).json({ error: "Failed to delete attendance" });
  }
};

import studentModel from "../models/studentModel.js";

// @desc    Get all students with populated school and department
export const getStudents = async (req, res) => {
  try {
    const students = await studentModel
      .find()
      .populate("school")
      .populate("department");

    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

// @desc    Add a new student
export const addStudent = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email already exists
    const existingStudent = await studentModel.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const student = new studentModel(req.body);
    await student.save();

    // Correct populate usage (no execPopulate)
    await student.populate("school");
    await student.populate("department");

    res.status(201).json(student);
  } catch (err) {
    console.error("Error adding student:", err);
    res.status(500).json({ error: "Failed to add student" });
  }
};

// @desc    Delete a student by ID
export const deleteStudent = async (req, res) => {
  try {
    const deleted = await studentModel.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Student deleted" });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ error: "Failed to delete student" });
  }
};

// @desc    Update a student by ID
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Optional: Email uniqueness check on update
    if (updates.email) {
      const existing = await studentModel.findOne({
        email: updates.email,
        _id: { $ne: id },
      });
      if (existing) {
        return res
          .status(400)
          .json({ error: "Email already used by another student" });
      }
    }

    const updatedStudent = await studentModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Correct populate usage
    await updatedStudent.populate("school");
    await updatedStudent.populate("department");

    res.json({ message: "Student updated", student: updatedStudent });
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).json({ error: "Failed to update student" });
  }
};

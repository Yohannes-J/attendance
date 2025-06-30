
import schoolModel from "../models/schoolModel.js";
import Department from "../models/deptModel.js"

export const addDepartment = async (req, res) => {
  try {
    const { department, schoolId } = req.body;

    // Debug logs
    console.log("Incoming request to add Department:");
    console.log("department:", department);
    console.log("schoolId:", schoolId);

    if (!department || !schoolId) {
      return res
        .status(400)
        .json({ error: "department and schoolId  are required" });
    }

    const existingSchool = await schoolModel.findById(schoolId);

    if (!existingSchool) {
      return res
        .status(404)
        .json({ error: "School not found with the provided sectorId." });
    }

    const newDepartment = new Department({
      schoolId,
      department,
    });
    await newDepartment.save();

    // Debug log for created subsector
    console.log("Department created:", newDepartment);

    res.status(201).json({
      message: "Department added successfully",
      data: newDepartment,
    });
  } catch (err) {
    console.error("Error creating Department:", err);
    res.status(500).json({ error: err.message });
  }
};
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate("schoolId");
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

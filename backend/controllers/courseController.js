import Course from "../models/courseModel.js";
import deptModel from "../models/deptModel.js";

// Add Course
export const addCourse = async (req, res) => {
  try {
    const { course, departmentId } = req.body;

    if (!course || !departmentId) {
      return res
        .status(400)
        .json({ error: "course and departmentId are required" });
    }

    const existingDepartment = await deptModel.findById(departmentId);
    if (!existingDepartment) {
      return res.status(404).json({
        error: "Department not found with the provided departmentId.",
      });
    }

    const newCourse = new Course({
      course,
      departmentId,
    });

    await newCourse.save();

    res.status(201).json({
      message: "Course added successfully",
      data: newCourse,
    });
  } catch (err) {
    console.error("Error adding course:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get All Courses with department populated
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("departmentId");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

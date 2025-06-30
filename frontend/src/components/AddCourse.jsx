import React, { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = "http://localhost:2017";

function AddCourse() {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);

  const fetchAllData = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/department/get-department`
      );

      const data = res.data?.data ?? res.data ?? [];

      setDepartments(Array.isArray(data) ? data : []);

      const courseRes = await axios.get(`${backendUrl}/api/course/get-course`);

      setCourses(courseRes.data?.data || courseRes.data || []);
    } catch (err) {
      console.error("Error fetching department or course data", err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const courseName = e.target.courseName.value;
    const departmentId = e.target.department.value;

    if (!departmentId) {
      return alert("Please select a department");
    }

    if (!courseName.trim()) {
      return alert("Enter course name");
    }

    try {
      await axios.post(`${backendUrl}/api/course/add-course`, {
        course: courseName,
        departmentId,
      });
      alert("✅ Course created!");
      e.target.reset();
      fetchAllData();
    } catch (err) {
      alert("❌ Failed to create course");
      console.error("Add course error:", err);
    }
  };

  return (
    <div className="flex bg-white rounded flex-col p-4 w-[500px] shadow-2xl">
      <h1 className="text-2xl mb-6 font-semibold">Add Course</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="department" className="block mb-2 font-semibold">
            Department Name:
          </label>
          <select
            id="department"
            name="department"
            className="bg-gray-100 border-2 border-black p-1 text-sm font-semibold outline-none mb-2 w-full"
          >
            <option value="">Select a department</option>
            {departments.map((department) => (
              <option key={department._id} value={department._id}>
                {department.department}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="courseName" className="mb-2 font-semibold">
            Course Name:
          </label>
          <input
            type="text"
            id="courseName"
            name="courseName"
            className="bg-gray-100 border-2 border-black p-1 text-sm font-semibold outline-none mb-2"
            placeholder="Enter course name"
          />
        </div>

        <input
          type="submit"
          value="Add Course"
          className="cursor-pointer bg-blue-500 text-white font-semibold p-2 rounded"
        />
      </form>

      {/* Show existing course */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Existing Course:</h2>
        {courses.length === 0 ? (
          <p className="text-gray-600">No courses found.</p>
        ) : (
          <ul className="list-disc list-inside">
            {courses.map((course) => (
              <li key={course._id}>
                {course.course}{" "}
                <span className="text-gray-500 text-sm">
                  (
                  {typeof course.departmentId === "object"
                    ? course.departmentId.department
                    : "Unknown department"}
                  )
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AddCourse;

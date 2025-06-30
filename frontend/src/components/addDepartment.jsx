import React, { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = "http://localhost:2017";

function AddDepartment() {
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Fetch all schools and departments
  const fetchAllData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/school/get-school`);

      // Handle variable response structure
      const data = res.data?.data ?? res.data ?? [];

      // Ensure it's an array before setting
      setSchools(Array.isArray(data) ? data : []);

      const deptRes = await axios.get(
        `${backendUrl}/api/department/get-department`
      );
      // If backend returns [{...}, {...}] directly
      setDepartments(deptRes.data?.data || deptRes.data || []);
    } catch (err) {
      console.error("Error fetching school or department data", err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const departmentName = e.target.departmentName.value;
    const schoolId = e.target.school.value;

    if (!schoolId) {
      return alert("Please select a school");
    }

    if (!departmentName.trim()) {
      return alert("Enter department name");
    }

    try {
      await axios.post(`${backendUrl}/api/department/add-department`, {
        department: departmentName,
        schoolId,
      });
      alert("✅ Department created!");
      e.target.reset();
      fetchAllData();
    } catch (err) {
      alert("❌ Failed to create department");
      console.error("Add department error:", err);
    }
  };

  return (
    <div className="flex bg-white rounded flex-col p-4 w-[500px] shadow-2xl">
      <h1 className="text-2xl mb-6 font-semibold">Add Department</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="school" className="block mb-2 font-semibold">
            School Name:
          </label>
          <select
            id="school"
            name="school"
            className="bg-gray-100 border-2 border-black p-1 text-sm font-semibold outline-none mb-2 w-full"
          >
            <option value="">Select a school</option>
            {schools.map((school) => (
              <option key={school._id} value={school._id}>
                {school.school}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="departmentName" className="mb-2 font-semibold">
            Department Name:
          </label>
          <input
            type="text"
            id="departmentName"
            name="departmentName"
            className="bg-gray-100 border-2 border-black p-1 text-sm font-semibold outline-none mb-2"
            placeholder="Enter department name"
          />
        </div>

        <input
          type="submit"
          value="Add Department"
          className="cursor-pointer bg-blue-500 text-white font-semibold p-2 rounded"
        />
      </form>

      {/* Show existing departments */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Existing Departments:</h2>
        {departments.length === 0 ? (
          <p className="text-gray-600">No departments found.</p>
        ) : (
          <ul className="list-disc list-inside">
            {departments.map((dept) => (
              <li key={dept._id}>
                {dept.department}{" "}
                <span className="text-gray-500 text-sm">
                  (
                  {typeof dept.schoolId === "object"
                    ? dept.schoolId.school
                    : "Unknown School"}
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

export default AddDepartment;

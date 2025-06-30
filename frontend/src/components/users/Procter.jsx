import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TopNavBar from "../TopNavBar";
import { Link } from "react-router-dom";


const API_URL = "http://localhost:2017";

export default function Procter() {
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [filters, setFilters] = useState({
    name: "",
    school: "",
    department: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  // Fetch schools and departments
  const fetchDropdownData = async () => {
    try {
      const [schoolRes, deptRes] = await Promise.all([
        fetch(`${API_URL}/api/school/get-school`),
        fetch(`${API_URL}/api/department/get-department`),
      ]);

      if (!schoolRes.ok || !deptRes.ok) throw new Error();

      const schoolsData = await schoolRes.json();
      const departmentsData = await deptRes.json();

      setSchools(schoolsData.data || schoolsData || []);
      setDepartments(departmentsData.data || departmentsData || []);
    } catch (error) {
      toast.error("Failed to fetch schools or departments.");
    }
  };

  // Fetch students
  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/students/get-student`);
      const data = await res.json();
      setStudents(data);
    } catch {
      toast.error("Failed to fetch students.");
    }
  };

  useEffect(() => {
    fetchDropdownData();
    fetchStudents();
  }, []);

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  // Filter students
  const filtered = students.filter((s) => {
    const nameMatch = s.fullName
      ? s.fullName.toLowerCase().includes(filters.name.toLowerCase())
      : false;

    const schoolId = s.school?._id || s.school || "";
    const schoolMatch = filters.school ? schoolId === filters.school : true;

    const departmentId = s.department?._id || s.department || "";
    const departmentMatch = filters.department
      ? departmentId === filters.department
      : true;

    return nameMatch && schoolMatch && departmentMatch;
  });

  // Sort by fullName
  const sorted = [...filtered].sort((a, b) => {
    const nameA = a.fullName || "";
    const nameB = b.fullName || "";
    return nameA.localeCompare(nameB, undefined, { sensitivity: "base" });
  });

  // Pagination logic
  const idxLast = currentPage * studentsPerPage;
  const idxFirst = idxLast - studentsPerPage;
  const currentStudents = sorted.slice(idxFirst, idxLast);
  const totalPages = Math.ceil(sorted.length / studentsPerPage);

  return (
    <div className="p-4">
      <TopNavBar />
      <h1 className="text-2xl font-bold mb-4">Student List</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          type="text"
          name="name"
          placeholder="Filter by Name"
          value={filters.name}
          onChange={handleFilterChange}
          className="border p-2 rounded flex-grow min-w-[150px]"
        />

        <select
          name="school"
          value={filters.school}
          onChange={handleFilterChange}
          className="border p-2 rounded flex-grow min-w-[150px]"
        >
          <option value="">All Schools</option>
          {schools.map((s) => (
            <option key={s._id} value={s._id}>
              {s.school}
            </option>
          ))}
        </select>

        <select
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
          className="border p-2 rounded flex-grow min-w-[150px]"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>
              {d.department}
            </option>
          ))}
        </select>
      </div>

      {/* Students Table */}
      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            {[
              "ID",
              "Full Name",
              "Email",
              "Phone",
              "Year",
              "School",
              "Department",
              "Block",
              "Dorm",
            ].map((h) => (
              <th key={h} className="p-2 border text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentStudents.length === 0 ? (
            <tr>
              <td colSpan="9" className="p-4 text-center">
                No students found.
              </td>
            </tr>
          ) : (
            currentStudents.map((s) => (
              <tr key={s._id} className="border border-gray-200">
                <td className="p-2 border">{s.studentId || "--"}</td>
                <td className="p-2 border">{s.fullName || "--"}</td>
                <td className="p-2 border">{s.email || "--"}</td>
                <td className="p-2 border">{s.phone || "--"}</td>
                <td className="p-2 border">{s.year || "--"}</td>
                <td className="p-2 border">{s.school?.school || "--"}</td>
                <td className="p-2 border">
                  {s.department?.department || "--"}
                </td>
                <td className="p-2 border">{s.block || "--"}</td>
                <td className="p-2 border">{s.dorm || "--"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <Link
  to="/attendance"
  className="inline-block mt-6 text-blue-600 underline hover:text-blue-800"
>
  View Attendance
</Link>

    </div>
  );
}

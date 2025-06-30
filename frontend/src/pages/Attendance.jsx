import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = "http://localhost:2017";

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [date, setDate] = useState("");
  const [year, setYear] = useState("");
  const [school, setSchool] = useState("");
  const [department, setDepartment] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);

  // Fetch schools and departments once on mount
  const fetchDropdownData = async () => {
    try {
      const [schoolRes, deptRes] = await Promise.all([
        axios.get(`${backendUrl}/api/school/get-school`),
        axios.get(`${backendUrl}/api/department/get-department`),
      ]);

      const schoolData = schoolRes.data?.data || schoolRes.data || [];
      const departmentData = deptRes.data?.data || deptRes.data || [];

      setSchools(Array.isArray(schoolData) ? schoolData : []);
      setDepartments(Array.isArray(departmentData) ? departmentData : []);
    } catch (error) {
      console.error("❌ Failed to fetch school/departments:", error);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  // Filter departments when school changes
  useEffect(() => {
    const filtered = departments.filter((d) => {
      const sid = typeof d.schoolId === "object" ? d.schoolId._id : d.schoolId;
      return sid === school;
    });
    setFilteredDepartments(filtered);
  }, [school, departments]);

  // Fetch all students on mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/students/get-student`);
        setStudents(res.data);
      } catch {
        toast.error("Failed to fetch students.");
      }
    };
    fetchStudents();
  }, []);

  // Generate attendance sheet based on selected filters
  const generateAttendanceSheet = async () => {
    if (!school || !department || !year || !date) {
      toast.warning("Please fill school, department, year, and date.");
      return;
    }

    setAttendanceMap({});
    setFilteredStudents([]);

    const selectedDate = new Date(date);
    const month = selectedDate.getMonth() + 1;
    const y = selectedDate.getFullYear();

    let records = [];
    try {
      const res = await axios.get(
        `${backendUrl}/api/attendances/get-attendance?year=${y}&month=${month}`
      );
      records = res.data;
    } catch {
      toast.error("Failed to fetch attendance.");
      return;
    }

    // Filter students by school, department, and year (case-insensitive for year)
    const filtered = students.filter((s) => {
      const schoolId = typeof s.school === "object" ? s.school._id : s.school;
      const deptId =
        typeof s.department === "object" ? s.department._id : s.department;
      const yearStr = (s.year || "").toLowerCase();

      return (
        schoolId === school &&
        deptId === department &&
        yearStr === year.toLowerCase()
      );
    });

    setFilteredStudents(filtered);

    const daysInMonth = new Date(y, month, 0).getDate();
    const map = {};

    // Initialize attendance false for each student for every day in the month
    filtered.forEach((s) => {
      for (let d = 1; d <= daysInMonth; d++) {
        const iso = new Date(y, month - 1, d).toISOString().split("T")[0];
        map[`${s._id}_${iso}`] = false;
      }
    });

    // Mark attendance true for existing records
    records.forEach((r) => {
      const iso = new Date(r.date).toISOString().split("T")[0];
      map[`${r.studentId}_${iso}`] = true;
    });

    setAttendanceMap(map);
  };

  // Toggle attendance checkbox
  const toggleCheckbox = (studentId, isoDate) => {
    const key = `${studentId}_${isoDate}`;
    setAttendanceMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Submit attendance records to backend
  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();

    const saveRecords = [];
    const deleteRecords = [];

    Object.entries(attendanceMap).forEach(([key, present]) => {
      const [studentId, date] = key.split("_");
      if (present) saveRecords.push({ studentId, date, present: true });
      else deleteRecords.push({ studentId, date });
    });

    try {
      if (saveRecords.length) {
        await fetch(`${backendUrl}/api/attendances/save-attendance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(saveRecords),
        });
      }
      for (const rec of deleteRecords) {
        await fetch(
          `${backendUrl}/api/attendances/delete?studentId=${rec.studentId}&date=${rec.date}`,
          { method: "DELETE" }
        );
      }
      toast.success("Attendance saved.");
      generateAttendanceSheet();
    } catch {
      toast.error("Failed to save attendance.");
    }
  };

  // Render attendance table
  const renderTable = () => {
    if (!filteredStudents.length) return null;

    const d = new Date(date);
    const daysInMonth = new Date(
      d.getFullYear(),
      d.getMonth() + 1,
      0
    ).getDate();

    return (
      <form onSubmit={handleAttendanceSubmit}>
        <table className="w-full mt-6 border text-sm text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              {[...Array(daysInMonth)].map((_, i) => (
                <th key={i} className="p-1 border text-center">
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => {
              const sid = s._id;
              return (
                <tr key={sid}>
                  <td className="border p-1">{sid.slice(-4)}</td>
                  <td className="border p-1">{s.studentId}</td>
                  <td className="border p-1">{s.fullName || s.name}</td>
                  {[...Array(daysInMonth)].map((_, i) => {
                    const iso = new Date(d.getFullYear(), d.getMonth(), i + 1)
                      .toISOString()
                      .split("T")[0];
                    const key = `${sid}_${iso}`;
                    return (
                      <td key={i} className="border p-1 text-center">
                        <input
                          type="checkbox"
                          checked={attendanceMap[key] || false}
                          onChange={() => toggleCheckbox(sid, iso)}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <button
          type="submit"
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Submit Attendance
        </button>
      </form>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Attendance</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <select
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          className="border rounded py-2 px-3"
        >
          <option value="">Select School</option>
          {schools.map((s) => (
            <option key={s._id} value={s._id}>
              {s.school}
            </option>
          ))}
        </select>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="border rounded py-2 px-3"
        >
          <option value="">Select Department</option>
          {filteredDepartments.map((d) => (
            <option key={d._id} value={d._id}>
              {d.department}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border rounded py-2 px-3"
        >
          <option value="">Select Year</option>
          <option value="1st">1st Year</option>
          <option value="2nd">2nd Year</option>
          <option value="3rd">3rd Year</option>
          <option value="4th">4th Year</option>
          <option value="5th">5th Year</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <button
        onClick={generateAttendanceSheet}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generate Attendance
      </button>

      {renderTable()}
    </div>
  );
}

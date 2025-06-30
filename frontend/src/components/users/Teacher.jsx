import React, { useEffect, useState } from "react";
import axios from "axios";
import TopNavBar from "../TopNavBar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const backendUrl = "http://localhost:2017";

export default function TeacherDashboard() {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [course, setCourse] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState(new Date());
  const [year, setYear] = useState("");

  const [schedule, setSchedule] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState(new Set());
  const [summaryMap, setSummaryMap] = useState({});
  const [existingSchedules, setExistingSchedules] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/department/get-department`
        );
        setDepartments(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching departments:", err);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/course/get-course`);
        setCourses(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/students/get-student`);
        setStudents(res.data || []);
      } catch (error) {
        console.error("❌ Failed to fetch students", error);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/schedule/get-schedules`);
        setExistingSchedules(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching existing schedules", err);
      }
    };
    fetchSchedules();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      const filtered = courses.filter(
        (c) => c.departmentId?._id === selectedDepartment
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses([]);
    }
    setCourse("");
    setSchedule([]);
    setDay("");
    setTime("");
    setDate(new Date());
    setYear(""); // reset year when department changes
  }, [selectedDepartment, courses]);

  // Filter students by selected department and year
  const filteredStudents = selectedDepartment
    ? students.filter((student) => {
        const deptId = student.department?._id || student.departmentId;
        const studentYear = (student.year || "").toLowerCase();
        return (
          deptId === selectedDepartment &&
          (year ? studentYear === year.toLowerCase() : true)
        );
      })
    : students;

  const addSchedule = () => {
    if (!day || !time || !course || !date || !selectedDepartment) {
      alert("Please select all fields");
      return;
    }

    const formattedDate = date.toISOString().split("T")[0];

    const existsInDB = existingSchedules.some(
      (s) => s.date === formattedDate && s.day === day && s.time === time
    );

    const existsInState = schedule.some(
      (s) => s.date === formattedDate && s.day === day && s.time === time
    );

    if (existsInDB || existsInState) {
      alert("Schedule already exists for this date, day, and time");
      return;
    }

    setSchedule((prev) => [
      ...prev,
      {
        date: formattedDate,
        day,
        time,
        course,
        department: selectedDepartment,
      },
    ]);
  };

  const toggleAttendance = (studentId, scheduleIndex) => {
    const key = `${studentId}_${scheduleIndex}`;
    setAttendanceRecords((prev) => {
      const updated = new Set(prev);
      if (updated.has(key)) updated.delete(key);
      else updated.add(key);
      return updated;
    });
  };

  const submitAttendance = async () => {
    const attendancePayload = filteredStudents.map((student) => {
      const records = {};
      schedule.forEach((sched, i) => {
        const key = `${student.studentId}_${i}`;
        if (attendanceRecords.has(key)) {
          records[`${sched.day} ${sched.time}`] = "Present";
        }
      });
      return {
        studentId: student.studentId,
        attendance: records,
      };
    });

    try {
      await axios.post(`${backendUrl}/api/Tattendances/save-attendance`, {
        attendance: attendancePayload,
        date: schedule[0]?.date || "",
        schedule: schedule,
      });

      alert("✅ Attendance submitted!");

      const summary = {};
      schedule.forEach((sched, i) => {
        let count = 0;
        filteredStudents.forEach((s) => {
          const key = `${s.studentId}_${i}`;
          if (attendanceRecords.has(key)) count++;
        });
        summary[`${sched.day}-${sched.time}-${sched.course}`] = count;
      });

      setSummaryMap(summary);
    } catch (err) {
      console.error("❌ Failed to submit", err);
      alert("❌ Failed to submit attendance");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <TopNavBar />
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        📋 Teacher Attendance Dashboard
      </h2>

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap gap-6 justify-center mb-6">
          {/* Department */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-gray-700">
              Department
            </label>
            <select
              className="px-4 py-2 rounded border border-gray-300 min-w-[200px]"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">-- Select Department --</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.department}
                </option>
              ))}
            </select>
          </div>

          {/* Course */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-gray-700">Course</label>
            <select
              className="px-4 py-2 rounded border border-gray-300 min-w-[200px]"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              disabled={!selectedDepartment}
            >
              <option value="">-- Select Course --</option>
              {filteredCourses.map((c) => (
                <option key={c._id} value={c.course}>
                  {c.course}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-gray-700">Year</label>
            <select
              className="px-4 py-2 rounded border border-gray-300 min-w-[140px]"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              disabled={!selectedDepartment}
            >
              <option value="">-- Select Year --</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
              <option value="5th">5th Year</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 justify-center items-end">
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-gray-700">Day</label>
            <select
              className="px-4 py-2 rounded border border-gray-300 min-w-[140px]"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            >
              <option value="">-- Select Day --</option>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
                (d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-gray-700">Time</label>
            <select
              className="px-4 py-2 rounded border border-gray-300 min-w-[140px]"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              <option value="">-- Select Time --</option>
              <option value="8:00-10:00">8:00-10:00</option>
              <option value="10:00-12:00">10:00-12:00</option>
              <option value="13:30-15:00">13:30-15:00</option>
              <option value="15:00-17:30">15:00-17:30</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-gray-700">Date</label>
            <div className="px-2 py-2 border border-gray-300 rounded min-w-[160px]">
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                dateFormat="yyyy-MM-dd"
                className="w-full"
              />
            </div>
          </div>

          <div className="mb-1">
            <button
              onClick={addSchedule}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              ➕ Add Schedule
            </button>
          </div>
        </div>
      </div>

      {schedule.length > 0 && filteredStudents.length > 0 && (
        <div className="overflow-x-auto mt-8 max-w-7xl mx-auto bg-white rounded shadow">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-blue-200">
                <th className="border border-gray-300 px-3 py-2">Student ID</th>
                <th className="border border-gray-300 px-3 py-2">Full Name</th>
                {schedule.map((s, i) => (
                  <th
                    key={i}
                    className="border border-gray-300 px-3 py-2 text-center"
                  >
                    {s.day} <br />
                    {s.time} <br />
                    <small>{s.course}</small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.studentId} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-3 py-1">
                    {student.studentId}
                  </td>
                  <td className="border border-gray-300 px-3 py-1">
                    {student.fullName}
                  </td>
                  {schedule.map((_, i) => {
                    const key = `${student.studentId}_${i}`;
                    return (
                      <td
                        key={key}
                        className="border border-gray-300 text-center"
                      >
                        <input
                          type="checkbox"
                          checked={attendanceRecords.has(key)}
                          onChange={() =>
                            toggleAttendance(student.studentId, i)
                          }
                          className="w-5 h-5 cursor-pointer"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={submitAttendance}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            ✅ Submit Attendance
          </button>
        </div>
      )}

      {Object.keys(summaryMap).length > 0 && (
        <div className="mt-8 max-w-md mx-auto bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-3 text-center">
            📊 Attendance Summary (Present Count):
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(summaryMap).map(([key, count]) => (
              <li key={key}>
                <span className="font-medium">{key}</span>: {count} students
                present
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

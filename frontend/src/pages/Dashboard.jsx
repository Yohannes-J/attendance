import React from "react";
import { useNavigate } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";

const Dashboard = () => {
  const [totalStudents, setTotalStudents] = React.useState(0);
  const [todayPresent, setTodayPresent] = React.useState(0);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Fetch total students
    fetch("http://localhost:2017/api/students/get-student")
      .then((res) => res.json())
      .then((data) => setTotalStudents(data.length))
      .catch(() => setTotalStudents(0));

    // Fetch today's attendance
    const today = new Date().toISOString().split("T")[0];
    fetch(`http://localhost:2017/api/attendances/today?date=${today}`)
      .then((res) => res.json())
      .then((records) => setTodayPresent(records.length))
      .catch(() => setTodayPresent(0));
  }, []);

  return (
    <div className="p-6">
      <TopNavBar />
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-600">
            Total Students
          </h2>
          <p className="text-3xl font-bold text-blue-600">{totalStudents}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-600">Present Today</h2>
          <p className="text-3xl font-bold text-green-600">{todayPresent}</p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/dashboard/school")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add School
        </button>
        <button
          onClick={() => navigate("/dashboard/department")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Department
        </button>
        <button
          onClick={() => navigate("/dashboard/add-course")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Course
        </button>
        <button
          onClick={() => navigate("/dashboard/add-student")}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Add Student
        </button>
        <button
          onClick={() => navigate("/dashboard/add-user")}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Add user
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

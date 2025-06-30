import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  Link,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Attendance from "./pages/Attendance";
import Setting from "./pages/Setting";

import AddSchool from "./components/addSchool";
import AddDepartment from "./components/addDepartment";
import AddStudent from "./components/addStudent";

import useAuthStore from "./store/auth.store";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/login";
import AddUser from "./components/addUserForm";
import Head from "./components/users/Head";
import Teacher from "./components/users/teacher";
import Procter from "./components/users/Procter";
import UserProfile from "./components/UserProfile";
import AddCourse from "./components/AddCourse";

// Layout for authenticated pages with sidebar (conditionally shown)
const Layout = () => {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/" replace />;

  const hideSidebar = user.role?.toLowerCase() === "procter";

  return (
    <div className="flex h-screen gap-6">
      {/* Sidebar (hide for procter) */}
      {!hideSidebar && (
        <aside className="w-64 bg-gray-800 text-white p-4">
          <ul className="p-5 space-y-4">
            <li className="hover:underline">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="hover:underline">
              <Link to="/students">Students</Link>
            </li>
            <li className="hover:underline">
              <Link to="/attendance">Attendance</Link>
            </li>
            <li className="hover:underline">
              <Link to="/setting">Setting</Link>
            </li>
          </ul>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

// Protect routes and wait for auth check to finish
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role?.toLowerCase())) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

// Unauthorized page
const Unauthorized = () => (
  <div className="flex items-center justify-center h-screen text-2xl text-red-600">
    Access Denied: Unauthorized Role
  </div>
);

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <Routes>
        {/* Public login page */}
        <Route path="/" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Routes for System Admin */}
        <Route element={<ProtectedRoute allowedRoles={["system admin"]} />}>
          <Route element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="dashboard/school" element={<AddSchool />} />
            <Route path="dashboard/department" element={<AddDepartment />} />
            <Route path="dashboard/add-course" element={<AddCourse />} />
            <Route path="dashboard/add-student" element={<AddStudent />} />
            <Route path="dashboard/add-user" element={<AddUser />} />
            <Route path="dashboard/students" element={<Students />} />
            <Route path="dashboard/attendance" element={<Attendance />} />
            <Route path="dashboard/setting" element={<Setting />} />
            <Route path="user-profile" element={<UserProfile />} />
          </Route>
        </Route>

        {/* Routes for Dept Head */}
        <Route element={<ProtectedRoute allowedRoles={["dep-head"]} />}>
          <Route path="dep-head" element={<Head />} />
          <Route path="school/:schoolId" element={<AddSchool />} />
          <Route path="department/:departmentId" element={<AddDepartment />} />
        </Route>

        {/* Routes for Teacher */}
        <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
          <Route path="teacher" element={<Teacher />} />
          <Route path="school/:schoolId" element={<AddSchool />} />
          <Route path="department/:departmentId" element={<AddDepartment />} />
        </Route>

        {/* Routes for Procter */}
        <Route element={<ProtectedRoute allowedRoles={["procter"]} />}>
          <Route path="procter" element={<Procter />} />
        </Route>

        {/* Shared routes */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["system admin", "dep-head", "teacher", "procter"]}
            />
          }
        >
          <Route element={<Layout />}>
            <Route path="students" element={<Students />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="setting" element={<Setting />} />
          </Route>
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="add-course" element={<AddCourse />} />
      </Routes>
    </Router>
  );
}

export default App;

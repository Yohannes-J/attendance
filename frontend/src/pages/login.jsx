import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from "../store/auth.store";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // 'user' or 'admin'
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { userLogin, adminLogin } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const normalizedEmail = email.trim().toLowerCase();

    try {
      let userData;

      if (role === "admin") {
        userData = await adminLogin(normalizedEmail, password);
      } else {
        userData = await userLogin(normalizedEmail, password);
      }

      toast.success(`${role === "admin" ? "Admin" : "User"} login successful!`);

      // Example role-based routing
      if (role === "admin") {
        navigate("/dashboard");
      } else {
        const userRole = (userData?.role || "").toLowerCase();
        switch (userRole) {
          case "system admin":
            navigate("/dashboard");
            break;
          case "dep-head":
            navigate("/dep-head");
            break;
          case "teacher":
            navigate("/teacher");
            break;
          case "procter":
            navigate("/procter");
            break;
          default:
            toast.error("Unknown role");
            navigate("/unauthorized");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      toast.error("Login failed. Check credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md max-w-md w-full"
      >
        <h2 className="text-2xl mb-6 text-center font-semibold">Login</h2>

        {/* Role selector */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Login as</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            autoComplete="username"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            autoComplete="current-password"
          />
        </div>

        {error && <p className="mb-4 text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

export default Login;

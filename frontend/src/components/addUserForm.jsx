import { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = "http://localhost:2017";

const AddUser = () => {
  // Form data state with fullName added
  const [formData, setFormData] = useState({
    fullName: "",
    role: "",
    school: "",
    department: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Checkboxes state to enable sector/subsector selection
  const [useSchool, setUseSchool] = useState(false);
  const [useDepartment, setUseDepartment] = useState(false);

  // Dropdown options
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  // Error message
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch sectors and subsectors
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

  // Filter departments when school changes or useScho;l toggled off
  useEffect(() => {
    if (!useSchool || !formData.school) {
      setFilteredDepartments([]);
      setFormData((prev) => ({ ...prev, department: "" }));
      setUseDepartment(false);
      return;
    }
    // Filter subsectors by selected sector
    const filtered = departments.filter((sub) => {
      if (!sub.schoolId) return false;
      const schoolIdFromSub =
        typeof sub.schoolId === "object"
          ? sub.schoolId._id || sub.schoolId
          : sub.schoolId;
      return schoolIdFromSub === formData.school;
    });
    setFilteredDepartments(filtered);
    // Reset dep selection if out of filtered list
    if (!filtered.find((sub) => sub._id === formData.department)) {
      setFormData((prev) => ({ ...prev, department: "" }));
      setUseDepartment(false);
    }
  }, [formData.school, departments, useSchool]);

  // Handle input/select changes
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (id === "useSchool") {
        setUseSchool(checked);
        if (!checked) {
          setFormData((prev) => ({ ...prev, school: "", department: "" }));
          setUseDepartment(false);
        }
      } else if (id === "useDepartment") {
        setUseDepartment(checked);
        if (!checked) {
          setFormData((prev) => ({ ...prev, department: "" }));
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }

    setErrorMsg("");
  };

  // Basic email format validation
  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  // Password strength validation (min 6 chars here, can be adjusted)
  const isStrongPassword = (password) => {
    return password.length >= 6;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Basic validations
    if (!formData.fullName.trim()) {
      setErrorMsg("Please enter full name.");
      return;
    }
    if (!formData.role) {
      setErrorMsg("Please select a role.");
      return;
    }
    if (!formData.email) {
      setErrorMsg("Please enter an email.");
      return;
    }
    if (!isValidEmail(formData.email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!formData.password) {
      setErrorMsg("Please enter a password.");
      return;
    }
    if (!isStrongPassword(formData.password)) {
      setErrorMsg("Password should be at least 6 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    // Sector/Subsector validation based on checkboxes
    if (useSchool && !formData.school) {
      setErrorMsg("Please select a school or uncheck the school option.");
      return;
    }
    if (useDepartment && !formData.department) {
      setErrorMsg("Please select a subsector or uncheck the subsector option.");
      return;
    }

    // Prepare payload
    const payload = {
      fullName: formData.fullName,
      role: formData.role,
      email: formData.email,
      password: formData.password,
      school: useSchool ? formData.school || null : null,
      department: useDepartment ? formData.department || null : null,
    };

    try {
      await axios.post(`${backendUrl}/api/users/create`, payload);
      alert("User created successfully!");
      // Reset form
      setFormData({
        fullName: "",
        role: "",
        school: "",
        department: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setUseSchool(false);
      setUseDepartment(false);
    } catch (error) {
      console.error("Failed to create user:", error);
      if (error.response?.data?.error) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg("Failed to create user due to server error.");
      }
    }
  };

  return (
    <div className="w-lg mx-auto p-4 bg-white rounded text-xs shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Add User</h2>

      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="mb-4">
          <label htmlFor="fullName" className="block mb-1 font-medium">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-4 py-1 w-full"
            placeholder="Full Name"
          />
        </div>

        {/* Role */}
        <div className="mb-4">
          <label htmlFor="role" className="block mb-1 font-medium">
            Role
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-4 py-1 w-full"
          >
            <option value="">Select Role</option>
            <option value="dep-head">Dept Head</option>
            <option value="teacher">Teacher</option>
            <option value="procter">Procter</option>
          </select>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-4 py-1 w-full"
            placeholder="user@example.com"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-4 py-1 w-full"
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block mb-1 font-medium">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-4 py-1 w-full"
          />
        </div>

        {/* Use School Checkbox */}
        <div className="mb-4 flex items-center space-x-2">
          <input
            type="checkbox"
            id="useSchool"
            checked={useSchool}
            onChange={handleChange}
            className="form-checkbox"
          />
          <label htmlFor="useSchool" className="font-medium">
            Assign School
          </label>
        </div>

        {/* School select */}
        <div className="mb-4">
          <label
            htmlFor="school"
            className={`block mb-1 font-medium ${
              !useSchool ? "text-gray-400" : ""
            }`}
          >
            School
          </label>
          <select
            id="school"
            value={formData.school}
            onChange={handleChange}
            disabled={!useSchool}
            className={`border border-gray-300 rounded-md px-4 py-1 w-full ${
              !useSchool ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="">Select School</option>
            {schools.map((sec) => (
              <option key={sec._id} value={sec._id}>
                {sec.school}
              </option>
            ))}
          </select>
        </div>

        {/* Use Department Checkbox */}
        <div className="mb-4 flex items-center space-x-2">
          <input
            type="checkbox"
            id="useDepartment"
            checked={useDepartment}
            onChange={handleChange}
            disabled={!useSchool}
            className="form-checkbox"
          />
          <label
            htmlFor="useDepartment"
            className={`font-medium ${!useSchool ? "text-gray-400" : ""}`}
          >
            Assign Department
          </label>
        </div>

        {/* department select */}
        <div className="mb-4">
          <label
            htmlFor="department"
            className={`block mb-1 font-medium ${
              !useDepartment || !useSchool ? "text-gray-400" : ""
            }`}
          >
            Department
          </label>
          <select
            id="department"
            value={formData.department}
            onChange={handleChange}
            disabled={!useDepartment || !useSchool}
            className={`border border-gray-300 rounded-md px-4 py-1 w-full ${
              !useDepartment || !useSchool
                ? "bg-gray-100 cursor-not-allowed"
                : ""
            }`}
          >
            <option value="">Select Department</option>
            {filteredDepartments.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.department}
              </option>
            ))}
          </select>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 text-red-600 font-medium">{errorMsg}</div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-1 rounded hover:bg-blue-700 transition"
        >
          Create User
        </button>
      </form>
    </div>
  );
};

export default AddUser;

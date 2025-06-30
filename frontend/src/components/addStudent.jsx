import { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = "http://localhost:2017";

const AddStudent = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    fullName: "",
    phone: "",
    year: "",
    school: "",
    department: "",
    email: "",
    block: "",
    dorm: "",
  });

  const [useSchool, setUseSchool] = useState(false);
  const [useDepartment, setUseDepartment] = useState(false);

  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  const [errorMsg, setErrorMsg] = useState("");

  // ✅ Fetch schools and departments with safe response parsing
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

  // Filter departments based on selected school
  useEffect(() => {
    if (!useSchool || !formData.school) {
      setFilteredDepartments([]);
      setFormData((prev) => ({ ...prev, department: "" }));
      setUseDepartment(false);
      return;
    }

    const filtered = departments.filter((dept) => {
      const schoolIdFromDept =
        typeof dept.schoolId === "object" ? dept.schoolId._id : dept.schoolId;
      return schoolIdFromDept === formData.school;
    });

    setFilteredDepartments(filtered);

    if (!filtered.find((d) => d._id === formData.department)) {
      setFormData((prev) => ({ ...prev, department: "" }));
      setUseDepartment(false);
    }
  }, [formData.school, departments, useSchool]);

  // Input change handler
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

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validation
    if (!formData.studentId.trim())
      return setErrorMsg("Please enter student ID.");
    if (!formData.fullName.trim())
      return setErrorMsg("Please enter full name.");
    if (!formData.year) return setErrorMsg("Please select a year.");
    if (!formData.email || !isValidEmail(formData.email))
      return setErrorMsg("Enter a valid email.");
    if (!formData.phone.trim())
      return setErrorMsg("Please enter phone number.");
    if (useSchool && !formData.school)
      return setErrorMsg("Select a school or uncheck it.");
    if (useDepartment && !formData.department)
      return setErrorMsg("Select a department or uncheck it.");
    if (!formData.block) return setErrorMsg("Enter block.");
    if (!formData.dorm) return setErrorMsg("Enter dorm.");

    const payload = {
      studentId: formData.studentId,
      fullName: formData.fullName,
      year: formData.year,
      email: formData.email,
      phone: formData.phone,
      school: useSchool ? formData.school : null,
      department: useDepartment ? formData.department : null,
      block: formData.block,
      dorm: formData.dorm,
    };

    try {
      await axios.post(`${backendUrl}/api/students/add-student`, payload);
      alert("✅ Student added successfully!");

      setFormData({
        studentId: "",
        fullName: "",
        email: "",
        phone: "",
        year: "",
        school: "",
        department: "",
        block: "",
        dorm: "",
      });
      setUseSchool(false);
      setUseDepartment(false);
    } catch (error) {
      console.error("❌ Failed to add student:", error);
      if (error.response?.data?.error) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg("Server error: failed to add student.");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md text-sm">
      <h2 className="text-2xl font-bold mb-8 text-center">Add Student</h2>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Personal Information */}
        <div className="border p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Student ID</label>
              <input
                id="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="Enter student ID"
                className="w-full border rounded py-2 px-3"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Full Name</label>
              <input
                id="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full border rounded py-2 px-3"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full border rounded py-2 px-3"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Phone Number</label>
              <input
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full border rounded py-2 px-3"
              />
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="border p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Academic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Year</label>
              <select
                id="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full border rounded py-2 px-3"
              >
                <option value="">Select year</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
                <option value="5th">5th Year</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 mt-6">
              <input
                type="checkbox"
                id="useSchool"
                checked={useSchool}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <label htmlFor="useSchool" className="font-medium">
                Assign School
              </label>
            </div>

            <div>
              <label className="block font-medium mb-1">School</label>
              <select
                id="school"
                value={formData.school}
                onChange={handleChange}
                disabled={!useSchool}
                className="w-full border rounded py-2 px-3"
              >
                <option value="">Select school</option>
                {schools.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.school}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2 mt-6">
              <input
                type="checkbox"
                id="useDepartment"
                checked={useDepartment}
                onChange={handleChange}
                disabled={!useSchool}
                className="h-4 w-4"
              />
              <label htmlFor="useDepartment" className="font-medium">
                Assign Department
              </label>
            </div>

            <div>
              <label className="block font-medium mb-1">Department</label>
              <select
                id="department"
                value={formData.department}
                onChange={handleChange}
                disabled={!useDepartment}
                className="w-full border rounded py-2 px-3"
              >
                <option value="">Select department</option>
                {filteredDepartments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.department}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Housing Information */}
        <div className="border p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Housing Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Block</label>
              <input
                id="block"
                value={formData.block}
                onChange={handleChange}
                placeholder="Enter block"
                className="w-full border rounded py-2 px-3"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Dorm</label>
              <input
                id="dorm"
                value={formData.dorm}
                onChange={handleChange}
                placeholder="Enter dorm"
                className="w-full border rounded py-2 px-3"
              />
            </div>
          </div>
        </div>

        {/* Error and Submit */}
        {errorMsg && (
          <div className="text-red-600 font-semibold">{errorMsg}</div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Add Student
        </button>
      </form>
    </div>
  );
};

export default AddStudent;

import React, { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = "http://localhost:2017";

function AddSchool() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/school/get-school`);

      // Handle variable response structure
      const data = res.data?.data ?? res.data ?? [];

      // Ensure it's an array before setting
      setSchools(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching school data", err);
      setSchools([]); // fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const schoolName = e.target.schoolName.value;

    if (!schoolName.trim()) {
      return alert("Enter school name");
    }

    setSubmitting(true);
    try {
      await axios.post(`${backendUrl}/api/school/add-school`, {
        school: schoolName,
      });
      alert("✅ School created!");
      e.target.reset();
      fetchAllData();
    } catch (err) {
      alert("❌ Failed to create school");
      console.error("Add school error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex bg-white rounded flex-col p-4 w-[450px] shadow-2xl">
      <h1 className="text-2xl mb-6 font-semibold">Add School</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="schoolName" className="mb-2 font-semibold">
            School Name:
          </label>
          <input
            type="text"
            id="schoolName"
            name="schoolName"
            className="bg-gray-100 border-2 border-black p-1 text-lg outline-none"
          />
        </div>
        <input
          type="submit"
          value={submitting ? "Adding..." : "Add School"}
          disabled={submitting}
          className={`cursor-pointer ${
            submitting ? "bg-gray-400" : "bg-blue-500"
          } text-white font-semibold p-2 rounded`}
        />
      </form>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Existing Schools:</h2>
        {loading ? (
          <p>Loading schools...</p>
        ) : Array.isArray(schools) && schools.length === 0 ? (
          <p>No schools found.</p>
        ) : (
          <ul className="list-disc list-inside">
            {schools.map((school) => (
              <li key={school._id}>{school.school}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AddSchool;

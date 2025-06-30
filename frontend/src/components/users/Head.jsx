import React from "react";
import StudentsList from "../../pages/Students";
import AddStudent from "../addStudent";
import TopNavBar from "../TopNavBar";

const Head = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-8">
      <TopNavBar />
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple-800 mb-2">
            Department Head Dashboard
          </h2>
          <p className="text-gray-600">
            View and manage students in your department.
          </p>
        </div>

        {/* Students List Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">
            Students List
          </h3>
          <StudentsList />
        </div>

        {/* Add Student Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-green-700 mb-4">
            Add New Student
          </h3>
          <AddStudent />
        </div>
      </div>
    </div>
  );
};

export default Head;

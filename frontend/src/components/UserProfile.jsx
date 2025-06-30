import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../store/auth.store";

const UserProfile = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [sector, setSector] = useState("");
  const [subsector, setSubsector] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const { user, updateProfile, logout, isLoading } = useAuthStore();

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setSector(user.sector?.sector_name || "");
      setSubsector(user.subsector?.subsector_name || "");
      if (user.image) setProfileImage(user.image);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "fullName":
        setFullName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "sector":
        setSector(value);
        break;
      case "subsector":
        setSubsector(value);
        break;
      default:
        break;
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImage(file);
  };

  const saveChanges = async () => {
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("sector", sector);
    formData.append("subsector", subsector);

    formData.append("image", profileImage);

    await updateProfile(formData);
    setEditMode(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 border rounded shadow-md bg-white">
      <h2 className="text-2xl font-semibold mb-6">User Profile</h2>

      <div className="flex items-center gap-4 mb-6">
        {profileImage ? (
          <img
            src={
              profileImage instanceof File
                ? URL.createObjectURL(profileImage)
                : profileImage
            }
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
        ) : user?.image ? (
          <img
            src={user.image}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}

        {editMode && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="ml-4"
          />
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          {editMode ? (
            <input
              type="text"
              name="fullName"
              value={fullName}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          ) : (
            <p className="text-gray-700">{fullName || "N/A"}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          {editMode ? (
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          ) : (
            <p className="text-gray-700">{email || "N/A"}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Sector</label>
          {editMode ? (
            <input
              type="text"
              name="sector"
              value={sector}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          ) : (
            <p className="text-gray-700">{sector || "N/A"}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Subsector</label>
          {editMode ? (
            <input
              type="text"
              name="subsector"
              value={subsector}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          ) : (
            <p className="text-gray-700">{subsector || "N/A"}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        {editMode ? (
          <>
            <button
              onClick={saveChanges}
              className="px-4 py-2 bg-green-600 text-white rounded"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Save Changes"}
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

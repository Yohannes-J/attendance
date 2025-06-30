import { create } from "zustand";
import axios from "axios";

const backendUrl = "http://localhost:2017";

axios.defaults.withCredentials = true;

const useAuthStore = create((set) => ({
  user: null,
  error: null,
  isAuthenticated: false,
  isCheckingAuth: true, // initially true to indicate checking status on app start
  isLoading: false,

  adminLogin: async (normalizedEmail, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${backendUrl}/api/admin/login`, {
        email: normalizedEmail,
        password,
      });
      set({
        user: response.data.user,
        error: null,
        isAuthenticated: true,
        isLoading: false,
        isCheckingAuth: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Admin login failed",
        isLoading: false,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
      throw err;
    }
  },

  userLogin: async (normalizedEmail, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${backendUrl}/api/users/login`, {
        email: normalizedEmail,
        password,
      });
      set({
        user: response.data.user,
        error: null,
        isAuthenticated: true,
        isLoading: false,
        isCheckingAuth: false,
      });
      return response.data.user;
    } catch (err) {
      set({
        error: err.response?.data?.message || "User login failed",
        isLoading: false,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${backendUrl}/api/users/logout`);
      set({
        user: null,
        error: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (err) {
      set({ error: err.response?.data?.message || "Logout failed", isLoading: false });
      throw err;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${backendUrl}/api/users/checkAuth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
        error: null,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
        error: null,
      });
      // optionally console.log(error.message);
    }
  },

  updateProfile: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${backendUrl}/api/users/update-profile`,
        formData
      );
      set({
        user: response.data.user,
        error: null,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Profile update failed",
        isLoading: false,
      });
      throw err;
    }
  },

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${backendUrl}/api/users/profile`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        error: null,
        isLoading: false,
      });
    } catch (err) {
      set({
        user: null,
        isAuthenticated: false,
        error: err.response?.data?.message || "Failed to fetch profile",
        isLoading: false,
      });
      console.error("❌ fetchProfile error:", err.message);
    }
  },
}));

export default useAuthStore;

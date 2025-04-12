import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

// Define interfaces for better type safety
// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role?: string;
//   isVerified?: boolean;
// }

interface AuthState {
  // User data
  user: any;
  isAuthenticated: boolean;

  // Loading states
  isLoading: boolean;
  isCheckingAuth: boolean;

  // Error and message states
  error: string | null;
  message: string | null;

  // Auth methods
  signup: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  verifyEmail: (code: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  refreshToken: () => Promise<any>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingAuth: true,
  error: null,
  message: null,

  // Auth methods
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`auth/signup`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isLoading: false,
      });
      toast.success("Account created successfully");
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error signing up");
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`auth/login`, {
        email,
        password,
      });
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
      toast.success("Logged in successfully");
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error Logging In",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Invalid email or password");
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`auth/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
      toast.success("Logged out successfully");
    } catch (error: any) {
      set({ error: "Error logging out", isLoading: false });
      toast.error(
        error.response?.data?.message || "An error occurred during logout"
      );
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`auth/verify-email`, { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      toast.success("Email verified successfully");
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error verifying email",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error verifying email");
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`auth/check-auth`);
      set({
        user: response.data.user,
        isCheckingAuth: false,
      });
    } catch (error: unknown) {
      console.log(error instanceof Error ? error.message : "Unknown error");
      set({
        error: null,
        isCheckingAuth: false,
        user: null,
      });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`auth/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
      toast.success("Password reset instructions sent to your email");
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message || "Error sending reset password email",
      });
      toast.error(
        error.response?.data?.message || "Error sending reset password email"
      );
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`auth/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
      toast.success("Password reset successfully");
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error resetting password",
      });
      toast.error(error.response?.data?.message || "Error resetting password");
      throw error;
    }
  },

  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().isCheckingAuth) return;

    set({ isCheckingAuth: true });
    try {
      const response = await axios.post(`auth/refresh-token`);
      set({ isCheckingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, isCheckingAuth: false, isAuthenticated: false });
      throw error;
    }
  },
}));

// Axios interceptor for token refresh
// let refreshPromise: Promise<any> | null = null;

// axios.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // If a refresh is already in progress, wait for it to complete
//         if (refreshPromise) {
//           await refreshPromise;
//           return axios(originalRequest);
//         }

//         // Start a new refresh process
//         refreshPromise = useAuthStore.getState().refreshToken();
//         await refreshPromise;
//         refreshPromise = null;

//         return axios(originalRequest);
//       } catch (refreshError) {
//         // If refresh fails, redirect to login or handle as needed
//         useAuthStore.getState().logout();
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

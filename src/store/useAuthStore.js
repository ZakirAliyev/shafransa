import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const data = await api.post("/auth/login", credentials);
          // data should contain: { user: {...}, token: "jwt_token" }
          set({ 
            user: data.user, 
            token: data.token, 
            isAuthenticated: true, 
            isLoading: false 
          });
          return data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (credentials) => {
        set({ isLoading: true });
        try {
          // Register sends OTP first
          const data = await api.post("/auth/register", credentials);
          set({ isLoading: false });
          return data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      verifyOTP: async (email, otp) => {
        set({ isLoading: true });
        try {
          const data = await api.post("/auth/verify-otp", { email, otp });
          // After OTP verification, set user and token
          set({ 
            user: data.user, 
            token: data.token, 
            isAuthenticated: true, 
            isLoading: false 
          });
          return data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // ✅ Fixed endpoint path from /users/me to /user/me (singular)
      fetchMe: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const user = await api.get("/user/me");
          set({ user, isAuthenticated: true });
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

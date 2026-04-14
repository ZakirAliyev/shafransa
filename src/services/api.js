import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.shafransa.com/api",

  // ❌ SİLİNDİ — CORS problem yaradırdı
  // withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const lang = localStorage.getItem("lang") || "az";
    config.headers["Accept-Language"] = lang;

    return config;
  },
  (error) => Promise.reject(error)
);

// 📥 RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response.data, // artıq data qaytarır
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default api;
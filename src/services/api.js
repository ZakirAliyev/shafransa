import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const api = axios.create({
  baseURL: "https://api.shafransa.com/api",  // ✅ ALWAYS production API
  timeout: 30000,

  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    try {
      const token = useAuthStore.getState().token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const lang = localStorage.getItem("lang") || "az";
      config.headers["Accept-Language"] = lang;

      return config;
    } catch (error) {
      console.error("❌ Request interceptor error:", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// 📥 RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    // ✅ Backend wraps response in { statusCode, message, data }
    // Extract the actual data from the nested structure
    if (response.data?.data !== undefined) {
      return response.data.data; // Return the actual data object
    }
    return response.data || response;
  },
  (error) => {
    // 🚨 Handle different types of errors
    const status = error.response?.status;
    const errorData = error.response?.data;
    const message = errorData?.message || error.message;

    console.error(`❌ API Error [${status}]:`, message);

    // 🔐 Handle 401 Unauthorized
    if (status === 401) {
      console.warn("🔐 Unauthorized - Logging out user");
      useAuthStore.getState().logout();
      window.location.href = "/auth/login";
      return Promise.reject({
        status: 401,
        message: "Your session has expired. Please log in again.",
      });
    }

    // 🚫 Handle 403 Forbidden
    if (status === 403) {
      console.warn("🚫 Forbidden - Access denied");
      return Promise.reject({
        status: 403,
        message: "You don't have permission to perform this action.",
      });
    }

    // 404 Not Found
    if (status === 404) {
      return Promise.reject({
        status: 404,
        message: errorData?.message || "Resource not found.",
      });
    }

    // 400 Bad Request / Validation Error
    if (status === 400 || status === 422) {
      return Promise.reject({
        status: status,
        message: errorData?.message || "Invalid request data.",
        errors: errorData?.errors || null,
      });
    }

    // 429 Too Many Requests
    if (status === 429) {
      return Promise.reject({
        status: 429,
        message: "Too many requests. Please wait a moment and try again.",
      });
    }

    // 500+ Server Errors
    if (status && status >= 500) {
      console.error("🔴 Server error:", error.response);
      return Promise.reject({
        status: status,
        message: "Server error. Our team has been notified.",
      });
    }

    // Network Error
    if (!error.response) {
      console.error("🌐 Network error:", error.message);
      if (error.code === "ECONNABORTED") {
        return Promise.reject({
          status: 0,
          message: "Request timeout. Please check your connection and try again.",
        });
      }
      return Promise.reject({
        status: 0,
        message: "Network error. Please check your internet connection.",
      });
    }

    // Fallback error
    return Promise.reject({
      status: status || 0,
      message: message || "An unexpected error occurred.",
    });
  }
);

export default api;
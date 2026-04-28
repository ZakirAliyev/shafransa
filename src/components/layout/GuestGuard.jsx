import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { getRoleName } from "../../constants/roles";

export default function GuestGuard({ children }) {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    const role = getRoleName(user.role);
    if (role === "SUPERADMIN" || role === "ADMIN") return <Navigate to="/admin" replace />;
    if (role === "THERAPIST") return <Navigate to="/expert" replace />;
    return <Navigate to="/user" replace />;
  }

  return children;
}

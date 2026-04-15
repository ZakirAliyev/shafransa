import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { getRoleName } from "../../constants/roles";

export default function GuestGuard({ children }) {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    const role = getRoleName(user.role);
    if (role === "ADMIN" || role === "EDITOR") return <Navigate to="/admin" replace />;
    if (role === "SELLER") return <Navigate to="/seller" replace />;
    return <Navigate to="/user" replace />;
  }

  return children;
}

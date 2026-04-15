import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { getRoleName } from "../../constants/roles";

export default function AuthGuard({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const userRole = getRoleName(user.role);
    if (!allowedRoles.includes(userRole)) {
      if (userRole === "ADMIN" || userRole === "EDITOR") return <Navigate to="/admin" replace />;
      if (userRole === "SELLER") return <Navigate to="/seller" replace />;
      return <Navigate to="/user" replace />;
    }
  }

  return children;
}

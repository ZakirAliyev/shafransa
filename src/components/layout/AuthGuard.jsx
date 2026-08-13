import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { getRoleName } from "../../constants/roles";

export default function AuthGuard({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles) {
    const userRole = getRoleName(user.role);
    if (!allowedRoles.includes(userRole)) {
      if (userRole === "SUPERADMIN" || userRole === "ADMIN") return <Navigate to="/admin" replace />;
      if (userRole === "THERAPIST") return <Navigate to="/expert" replace />;
      return <Navigate to="/user" replace />;
    }
  }

  return children;
}

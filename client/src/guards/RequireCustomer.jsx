import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

const RequireCustomer = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Not logged in -> login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Logged in but not CUSTOMER -> go to the correct dashboard
  if (user?.role === "DRIVER") {
    return <Navigate to="/driver-dashboard" replace />;
  }

  if (user?.role === "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  // CUSTOMER -> allow
  if (user?.role !== "CUSTOMER") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireCustomer;
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext";

const RequireDriver = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "DRIVER") return <Navigate to="/" replace />;

  return <Outlet />;
};

export default RequireDriver;
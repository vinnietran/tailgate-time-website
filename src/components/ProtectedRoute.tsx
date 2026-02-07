import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { debugAuthLog } from "../utils/debug";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="page-loading">Loading...</div>;
  }

  if (!user) {
    debugAuthLog("redirect:login", { path: location.pathname });
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

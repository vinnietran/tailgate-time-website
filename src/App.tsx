import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import HostDashboard from "./pages/HostDashboard";
import CreateTailgateWizard from "./pages/CreateTailgateWizard";
import AccountPayouts from "./pages/AccountPayouts";
import Login from "./pages/Login";
import TailgateDetails from "./pages/TailgateDetails";
import TailgateEdit from "./pages/TailgateEdit";
import TailgateCheckin from "./pages/TailgateCheckin";
import CheckinHub from "./pages/CheckinHub";
import Messages from "./pages/Messages";
import { useAuth } from "./hooks/useAuth";
import { debugAuthLog } from "./utils/debug";

function IndexRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="page-loading">Loading...</div>;
  }

  debugAuthLog("index-redirect", { authed: Boolean(user) });
  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<IndexRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <HostDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tailgates/new"
          element={
            <ProtectedRoute>
              <CreateTailgateWizard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPayouts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tailgates/:id"
          element={
            <ProtectedRoute>
              <TailgateDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tailgates/:id/edit"
          element={
            <ProtectedRoute>
              <TailgateEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tailgates/:id/checkin"
          element={
            <ProtectedRoute>
              <TailgateCheckin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkin"
          element={
            <ProtectedRoute>
              <CheckinHub />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

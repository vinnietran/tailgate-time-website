import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import HostDashboard from "./pages/HostDashboard";
import CreateTailgateWizard from "./pages/CreateTailgateWizard";
import AccountPayouts from "./pages/AccountPayouts";
import AccountPayoutHistory from "./pages/AccountPayoutHistory";
import AccountRefundRequests from "./pages/AccountRefundRequests";
import ChangePassword from "./pages/ChangePassword";
import Login from "./pages/Login";
import TailgateDetails from "./pages/TailgateDetails";
import TailgateEdit from "./pages/TailgateEdit";
import TailgateCheckin from "./pages/TailgateCheckin";
import CheckinHub from "./pages/CheckinHub";
import Messages from "./pages/Messages";
import NotificationPreferences from "./pages/NotificationPreferences";
import DiscoverTailgates from "./pages/DiscoverTailgates";
import Home from "./pages/Home";
import EventFeed from "./pages/EventFeed";
import UserGuide from "./pages/UserGuide";
import { DialogProvider } from "./hooks/useDialog";

export default function App() {
  return (
    <AuthProvider>
      <DialogProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Navigate to="/login?mode=signup" replace />} />
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
            path="/account/payout-history"
            element={
              <ProtectedRoute>
                <AccountPayoutHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/refund-requests"
            element={
              <ProtectedRoute>
                <AccountRefundRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/notifications"
            element={
              <ProtectedRoute>
                <NotificationPreferences />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tailgates/:id"
            element={<TailgateDetails />}
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
            path="/tailgates/:id/feed"
            element={<EventFeed />}
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
          <Route
            path="/discover"
            element={<DiscoverTailgates />}
          />
          <Route path="/user-guide" element={<UserGuide />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DialogProvider>
    </AuthProvider>
  );
}

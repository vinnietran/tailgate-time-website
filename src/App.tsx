import { Suspense, lazy, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import AnalyticsTracker from "./components/AnalyticsTracker";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { DialogProvider } from "./hooks/useDialog";

const HostDashboard = lazy(() => import("./pages/HostDashboard"));
const CreateTailgateWizard = lazy(() => import("./pages/CreateTailgateWizard"));
const AccountPayouts = lazy(() => import("./pages/AccountPayouts"));
const AccountPayoutHistory = lazy(() => import("./pages/AccountPayoutHistory"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const TailgateDetails = lazy(() => import("./pages/TailgateDetails"));
const TailgateEdit = lazy(() => import("./pages/TailgateEdit"));
const TailgateCheckin = lazy(() => import("./pages/TailgateCheckin"));
const CheckinHub = lazy(() => import("./pages/CheckinHub"));
const Messages = lazy(() => import("./pages/Messages"));
const NotificationPreferences = lazy(() => import("./pages/NotificationPreferences"));
const DiscoverTailgates = lazy(() => import("./pages/DiscoverTailgates"));
const EventFeed = lazy(() => import("./pages/EventFeed"));
const UserGuide = lazy(() => import("./pages/UserGuide"));
const Release20 = lazy(() => import("./pages/Release20"));
const AdminSpotlight = lazy(() => import("./pages/AdminSpotlight"));
const AdminMetrics = lazy(() => import("./pages/AdminMetrics"));
const AdminOps = lazy(() => import("./pages/AdminOps"));

function RouteFallback() {
  return <div className="page-shell" aria-busy="true" />;
}

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>;
}

export default function App() {
  return (
    <AuthProvider>
      <DialogProvider>
        <AnalyticsTracker />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Navigate to="/login?mode=signup" replace />} />
          <Route
            path="/dashboard"
            element={withSuspense(
              <ProtectedRoute>
                <HostDashboard />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/tailgates/new"
            element={withSuspense(
              <ProtectedRoute>
                <CreateTailgateWizard />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/account"
            element={withSuspense(
              <ProtectedRoute>
                <AccountPayouts />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/account/payout-history"
            element={withSuspense(
              <ProtectedRoute>
                <AccountPayoutHistory />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/account/notifications"
            element={withSuspense(
              <ProtectedRoute>
                <NotificationPreferences />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/account/change-password"
            element={withSuspense(
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/tailgates/:id"
            element={withSuspense(<TailgateDetails />)}
          />
          <Route
            path="/tailgates/:id/edit"
            element={withSuspense(
              <ProtectedRoute>
                <TailgateEdit />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/tailgates/:id/checkin"
            element={withSuspense(
              <ProtectedRoute>
                <TailgateCheckin />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/tailgates/:id/feed"
            element={withSuspense(<EventFeed />)}
          />
          <Route
            path="/checkin"
            element={withSuspense(
              <ProtectedRoute>
                <CheckinHub />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/messages"
            element={withSuspense(
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/discover"
            element={withSuspense(<DiscoverTailgates />)}
          />
          <Route path="/release-2-0" element={withSuspense(<Release20 />)} />
          <Route path="/user-guide" element={withSuspense(<UserGuide />)} />
          <Route
            path="/admin/spotlight"
            element={withSuspense(
              <AdminRoute>
                <AdminSpotlight />
              </AdminRoute>
            )}
          />
          <Route
            path="/admin/metrics"
            element={withSuspense(
              <AdminRoute>
                <AdminMetrics />
              </AdminRoute>
            )}
          />
          <Route
            path="/admin/ops"
            element={withSuspense(
              <AdminRoute>
                <AdminOps />
              </AdminRoute>
            )}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DialogProvider>
    </AuthProvider>
  );
}

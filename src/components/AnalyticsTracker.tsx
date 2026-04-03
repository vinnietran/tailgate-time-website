import { useEffect } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { trackPageView } from "../lib/firebase";

function getAnalyticsPageTitle(pathname: string) {
  const routes: Array<{ path: string; title: string }> = [
    { path: "/", title: "TailgateTime Home" },
    { path: "/login", title: "TailgateTime Login" },
    { path: "/dashboard", title: "TailgateTime Host Dashboard" },
    { path: "/tailgates/new", title: "Create Tailgate" },
    { path: "/account", title: "Account & Payouts" },
    { path: "/account/payout-history", title: "Payout History" },
    { path: "/account/notifications", title: "Notification Preferences" },
    { path: "/account/change-password", title: "Change Password" },
    { path: "/tailgates/:id/edit", title: "Edit Tailgate" },
    { path: "/tailgates/:id/checkin", title: "Tailgate Check-in" },
    { path: "/tailgates/:id/feed", title: "Tailgate Feed" },
    { path: "/tailgates/:id", title: "Tailgate Details" },
    { path: "/checkin", title: "Check-in Hub" },
    { path: "/messages", title: "Messages" },
    { path: "/discover", title: "Discover Tailgates" },
    { path: "/release-2-0", title: "Release 2.0" },
    { path: "/user-guide", title: "User Guide" },
    { path: "/admin/spotlight", title: "Admin Spotlight" },
    { path: "/admin/metrics", title: "Admin Metrics" },
    { path: "/admin/ops", title: "Admin Ops" }
  ];

  const match = routes.find((route) =>
    matchPath({ path: route.path, end: true }, pathname)
  );

  return match?.title ?? "TailgateTime";
}

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const pagePath = `${location.pathname}${location.search}`;
    const pageTitle = getAnalyticsPageTitle(location.pathname);

    document.title = pageTitle;
    trackPageView(pagePath);
  }, [location.hash, location.pathname, location.search]);

  return null;
}

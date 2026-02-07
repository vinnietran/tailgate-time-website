import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import TopBar from "../components/TopBar";
import TailgateCard from "../components/TailgateCard";
import QuickActionsBar from "../components/QuickActionsBar";
import { useAuth } from "../hooks/useAuth";
import { useHostTailgates } from "../hooks/useHostTailgates";
import { useUserProfile } from "../hooks/useUserProfile";
import { getFirstName } from "../utils/format";

export default function HostDashboard() {
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.uid);
  const displayName = profile?.displayName ?? user?.displayName;
  const email = profile?.email ?? user?.email;
  const firstName = getFirstName(displayName ?? email);
  const { upcomingTailgates, pastTailgates, totalTicketsSold, counts, loading, error } =
    useHostTailgates(user?.uid, email, displayName);

  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");

  const activeTailgates = useMemo(() => {
    return filter === "upcoming" ? upcomingTailgates : pastTailgates;
  }, [filter, upcomingTailgates, pastTailgates]);

  const emptyState = filter === "upcoming"
    ? {
        title: "You don't have any upcoming tailgates yet.",
        action: "/tailgates/new",
        actionLabel: "Create your first tailgate"
      }
    : {
        title: "No past tailgates yet.",
        action: "/tailgates/new",
        actionLabel: "Plan a new tailgate"
      };

  return (
    <AppShell header={<TopBar firstName={firstName} />}>
      <section className="tailgates-section">
        <div className="section-header">
          <div>
            <h2>My Tailgates</h2>
            <p className="section-subtitle">Manage upcoming and past tailgates.</p>
          </div>
          <div className="section-controls">
            <select
              className="filter-select"
              value={filter}
              onChange={(event) => setFilter(event.target.value as "upcoming" | "past")}
            >
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
            <div className="section-stats">
              <span>{counts.upcoming} Upcoming</span>
              <span>{counts.past} Past</span>
              <span>{totalTicketsSold} Total Tickets Sold</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="tailgate-grid">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="tailgate-card skeleton" />
            ))}
          </div>
        ) : error ? (
          <div className="error-banner">
            {error}
          </div>
        ) : activeTailgates.length > 0 ? (
          <div className="tailgate-grid">
            {activeTailgates.map((tailgate) => (
              <TailgateCard key={tailgate.id} event={tailgate} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>{emptyState.title}</p>
            <Link className="primary-button" to={emptyState.action}>
              {emptyState.actionLabel}
            </Link>
          </div>
        )}
      </section>

      <QuickActionsBar />
    </AppShell>
  );
}

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import TopBar from "../components/TopBar";
import TailgateCard from "../components/TailgateCard";
import QuickActionsBar from "../components/QuickActionsBar";
import { useAuth } from "../hooks/useAuth";
import { useDashboardTailgates } from "../hooks/useDashboardTailgates";
import { useUserProfile } from "../hooks/useUserProfile";
import { getFirstName } from "../utils/format";

export default function HostDashboard() {
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.uid);
  const displayName = profile?.displayName ?? user?.displayName;
  const email = profile?.email ?? user?.email;
  const firstName = getFirstName(displayName ?? email);
  const { upcomingTailgates, pastTailgates, counts, loading, error } =
    useDashboardTailgates(user?.uid);

  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");

  const activeTailgates = useMemo(() => {
    return filter === "upcoming" ? upcomingTailgates : pastTailgates;
  }, [filter, upcomingTailgates, pastTailgates]);

  const emptyState = filter === "upcoming"
    ? {
        title: "You are not hosting or attending any upcoming tailgates yet.",
        action: "/tailgates/new",
        actionLabel: "Create your first tailgate"
      }
    : {
        title: "You are not hosting or attending any past tailgates yet.",
        action: "/tailgates/new",
        actionLabel: "Plan a new tailgate"
      };

  return (
    <AppShell header={<TopBar firstName={firstName} />} showHeaderActions={false}>
      <QuickActionsBar />

      <section className="tailgates-section">
        <div className="section-header">
          <div>
            <h2>My Tailgates</h2>
            <p className="section-subtitle">
              Manage upcoming and past tailgates. Host-owned events are marked.
            </p>
          </div>
          <div className="section-controls">
            <div className="filter-tabs" role="tablist" aria-label="Tailgate timeframe">
              <button
                type="button"
                role="tab"
                aria-selected={filter === "upcoming"}
                className={`filter-tab ${filter === "upcoming" ? "active" : ""}`}
                onClick={() => setFilter("upcoming")}
              >
                Upcoming
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === "past"}
                className={`filter-tab ${filter === "past" ? "active" : ""}`}
                onClick={() => setFilter("past")}
              >
                Past
              </button>
            </div>
            <div className="section-stats">
              <span className="stat-pill">{counts.upcoming} Upcoming</span>
              <span className="stat-pill">{counts.past} Past</span>
              <span className="stat-pill">{counts.hosting} Hosting</span>
              <span className="stat-pill">{counts.paidOut} Paid Out</span>
              <span className="stat-pill">{counts.attending} Attending</span>
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
              <TailgateCard
                key={tailgate.id}
                event={tailgate}
                isHost={tailgate.relationship === "hosting"}
              />
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
    </AppShell>
  );
}

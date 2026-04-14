import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import TopBar from "../components/TopBar";
import TailgateCard from "../components/TailgateCard";
import { useAuth } from "../hooks/useAuth";
import { useDashboardTailgates } from "../hooks/useDashboardTailgates";
import { useDashboardSpotlight } from "../hooks/useDashboardSpotlight";
import { useUserProfile } from "../hooks/useUserProfile";
import { formatCurrencyFromCents, formatDateTimeRange, getFirstName } from "../utils/format";
import { getVisibilityLabel } from "../utils/tailgate";

type TimeframeFilter = "upcoming" | "past";
type QuickFilter = "all" | "hosting" | "paidOut" | "attending";

function isCancelledStatus(status?: string) {
  const raw = (status ?? "").toLowerCase();
  return raw === "cancelled" || raw === "canceled" || raw.startsWith("cancel");
}

function isHostLikeRelationship(relationship: string) {
  return relationship === "hosting" || relationship === "co_hosting";
}

export default function HostDashboard() {
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.uid);
  const { cards: spotlightCards, error: spotlightError } = useDashboardSpotlight();
  const displayName = profile?.displayName ?? user?.displayName;
  const email = profile?.email ?? user?.email;
  const firstName = getFirstName(displayName ?? email);
  const { upcomingTailgates, pastTailgates, loading, error } = useDashboardTailgates(user?.uid);

  const [timeframeFilter, setTimeframeFilter] = useState<TimeframeFilter>("upcoming");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const timeframeTailgates = useMemo(
    () => (timeframeFilter === "upcoming" ? upcomingTailgates : pastTailgates),
    [pastTailgates, timeframeFilter, upcomingTailgates]
  );

  const quickFilterCounts = useMemo(
    () => ({
      hosting: timeframeTailgates.filter((tailgate) => isHostLikeRelationship(tailgate.relationship)).length,
      attending: timeframeTailgates.filter((tailgate) => tailgate.relationship === "attending")
        .length,
      paidOut: timeframeTailgates.filter(
        (tailgate) =>
          isHostLikeRelationship(tailgate.relationship) &&
          tailgate.visibilityType === "open_paid" &&
          tailgate.payoutStatus === "sent"
      ).length
    }),
    [timeframeTailgates]
  );

  const activeTailgates = useMemo(() => {
    const base = timeframeTailgates;

    if (quickFilter === "hosting") {
      return base.filter((tailgate) => isHostLikeRelationship(tailgate.relationship));
    }
    if (quickFilter === "attending") {
      return base.filter((tailgate) => tailgate.relationship === "attending");
    }
    if (quickFilter === "paidOut") {
      return base.filter(
        (tailgate) =>
          isHostLikeRelationship(tailgate.relationship) &&
          tailgate.visibilityType === "open_paid" &&
          tailgate.payoutStatus === "sent"
      );
    }
    return base;
  }, [quickFilter, timeframeTailgates]);

  const toggleQuickFilter = (nextFilter: Exclude<QuickFilter, "all">) => {
    setQuickFilter((current) => (current === nextFilter ? "all" : nextFilter));
  };
  const goToPreviousSpotlight = () => {
    setSpotlightIndex((current) => Math.max(0, current - 1));
  };
  const goToNextSpotlight = () => {
    setSpotlightIndex((current) => Math.min(spotlightCards.length - 1, current + 1));
  };
  const nextTailgate = useMemo(
    () =>
      upcomingTailgates.find((tailgate) => !isCancelledStatus(tailgate.status)) ??
      upcomingTailgates[0] ??
      null,
    [upcomingTailgates]
  );
  const nextTailgateMetric = useMemo(() => {
    if (!nextTailgate) return "";
    if (nextTailgate.visibilityType === "open_paid") {
      const sold = nextTailgate.ticketsSold ?? 0;
      const priceLabel = nextTailgate.ticketPriceCents
        ? ` · ${formatCurrencyFromCents(nextTailgate.ticketPriceCents)} each`
        : "";
      return `${sold} tickets sold${priceLabel}`;
    }
    return `${nextTailgate.rsvpsConfirmed ?? 0} confirmed · ${
      nextTailgate.rsvpsPending ?? 0
    } pending`;
  }, [nextTailgate]);

  const timeframeLabel = timeframeFilter === "upcoming" ? "upcoming" : "past";
  const emptyState =
    quickFilter === "hosting"
      ? {
          title: `You are not hosting any ${timeframeLabel} tailgates yet.`,
          action: "/tailgates/new",
          actionLabel: "Create a tailgate"
        }
      : quickFilter === "attending"
      ? {
          title: `You are not attending any ${timeframeLabel} tailgates yet.`,
          action: "/discover",
          actionLabel: "Discover tailgates"
        }
      : quickFilter === "paidOut"
      ? {
          title: `You have no ${timeframeLabel} paid-out tailgates.`,
          action: "/account",
          actionLabel: "View payouts"
        }
      : timeframeFilter === "upcoming"
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
      <section className="dashboard-top-panels">
        <article className="dashboard-next-card">
          <div className="dashboard-next-header">
            <h2>Your Next Tailgate</h2>
            {nextTailgate ? (
              <span className={`chip ${isHostLikeRelationship(nextTailgate.relationship) ? "chip-live" : "chip-upcoming"}`}>
                {nextTailgate.relationship === "co_hosting"
                  ? "Co-hosting"
                  : nextTailgate.relationship === "hosting"
                  ? "Hosting"
                  : "Attending"}
              </span>
            ) : null}
          </div>
          {loading ? (
            <p className="meta-muted">Loading your next tailgate...</p>
          ) : nextTailgate ? (
            <>
              <h3>{nextTailgate.name}</h3>
              <p className="dashboard-next-meta">
                {formatDateTimeRange(nextTailgate.startDateTime, nextTailgate.endDateTime)}
              </p>
              <p className="dashboard-next-meta">
                {nextTailgate.locationSummary ?? "Location TBD"}
              </p>
              <div className="dashboard-next-chip-row">
                <span className="chip chip-outline">
                  {getVisibilityLabel(nextTailgate.visibilityType)}
                </span>
                <span
                  className={`chip ${
                    isCancelledStatus(nextTailgate.status) ? "chip-cancelled" : "chip-upcoming"
                  }`}
                >
                  {isCancelledStatus(nextTailgate.status) ? "Cancelled" : "Upcoming"}
                </span>
              </div>
              <p className="dashboard-next-highlight">{nextTailgateMetric}</p>
              <div className="dashboard-next-actions">
                <Link className="primary-button" to={`/tailgates/${nextTailgate.id}`}>
                  {isHostLikeRelationship(nextTailgate.relationship)
                    ? "Manage tailgate"
                    : "View tailgate"}
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="dashboard-next-empty">No upcoming tailgates yet.</p>
              <div className="dashboard-next-actions">
                <Link className="primary-button" to="/tailgates/new">
                  Create Tailgate
                </Link>
              </div>
            </>
          )}
        </article>

        <section className="dashboard-spotlight">
          <div className="dashboard-spotlight-header">
            <h2>TailgateTime Spotlight</h2>
            <p>Features, game day tools, and partner highlights.</p>
          </div>
          {spotlightError ? <p className="tailgate-details-ticket-error">{spotlightError}</p> : null}
          <div className="dashboard-spotlight-carousel">
            <button
              type="button"
              className="dashboard-spotlight-arrow"
              disabled={spotlightIndex === 0}
              onClick={goToPreviousSpotlight}
              aria-label="Previous spotlight slide"
            >
              ‹
            </button>
            <div className="dashboard-spotlight-viewport" aria-label="TailgateTime spotlight">
              <div
                className="dashboard-spotlight-track"
                style={{ transform: `translateX(-${spotlightIndex * 100}%)` }}
              >
                {spotlightCards.map((card) => (
                  <article className="dashboard-spotlight-card" key={card.id}>
                    <div className="dashboard-spotlight-media">
                      {card.badge ? (
                        <span className="dashboard-spotlight-badge">{card.badge}</span>
                      ) : null}
                      {card.imageSrc ? (
                        <img
                          className="dashboard-spotlight-image"
                          src={card.imageSrc}
                          alt={`${card.title} preview`}
                        />
                      ) : (
                        <div className={`dashboard-spotlight-art ${card.art}`} aria-hidden="true">
                          <span />
                          <span />
                          <span />
                        </div>
                      )}
                    </div>
                    <div className="dashboard-spotlight-content">
                      <div className="dashboard-spotlight-copy">
                        <h3>{card.title}</h3>
                        <p>{card.description}</p>
                      </div>
                      {card.ctaLabel && card.ctaTarget ? (
                        card.ctaType === "external_url" ? (
                          <a
                            href={card.ctaTarget}
                            className="dashboard-spotlight-cta"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {card.ctaLabel}
                          </a>
                        ) : card.ctaType === "route" ? (
                          <Link to={card.ctaTarget} className="dashboard-spotlight-cta">
                            {card.ctaLabel}
                          </Link>
                        ) : null
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="dashboard-spotlight-arrow"
              disabled={spotlightIndex === spotlightCards.length - 1}
              onClick={goToNextSpotlight}
              aria-label="Next spotlight slide"
            >
              ›
            </button>
          </div>
          <div className="dashboard-spotlight-dots" role="tablist" aria-label="Spotlight slides">
            {spotlightCards.map((card, index) => (
              <button
                key={card.id}
                type="button"
                className={`dashboard-spotlight-dot ${
                  index === spotlightIndex ? "active" : ""
                }`}
                aria-label={`Go to spotlight ${index + 1}`}
                aria-selected={index === spotlightIndex}
                onClick={() => setSpotlightIndex(index)}
              />
            ))}
          </div>
        </section>
      </section>

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
                aria-selected={timeframeFilter === "upcoming"}
                className={`filter-tab ${timeframeFilter === "upcoming" ? "active" : ""}`}
                onClick={() => setTimeframeFilter("upcoming")}
              >
                Upcoming
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={timeframeFilter === "past"}
                className={`filter-tab ${timeframeFilter === "past" ? "active" : ""}`}
                onClick={() => setTimeframeFilter("past")}
              >
                Past
              </button>
            </div>
            <div className="section-stats">
              <button
                type="button"
                className={`stat-pill ${quickFilter === "hosting" ? "active" : ""}`}
                aria-pressed={quickFilter === "hosting"}
                onClick={() => toggleQuickFilter("hosting")}
              >
                {quickFilterCounts.hosting} Hosting
              </button>
              <button
                type="button"
                className={`stat-pill ${quickFilter === "paidOut" ? "active" : ""}`}
                aria-pressed={quickFilter === "paidOut"}
                onClick={() => toggleQuickFilter("paidOut")}
              >
                {quickFilterCounts.paidOut} Paid Out
              </button>
              <button
                type="button"
                className={`stat-pill ${quickFilter === "attending" ? "active" : ""}`}
                aria-pressed={quickFilter === "attending"}
                onClick={() => toggleQuickFilter("attending")}
              >
                {quickFilterCounts.attending} Attending
              </button>
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
                isHost={isHostLikeRelationship(tailgate.relationship)}
                hostLabel={tailgate.relationship === "co_hosting" ? "Co-hosting" : "Hosting"}
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

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import {
  type HostPayoutHistoryItem,
  useHostPayoutHistory
} from "../hooks/useHostPayoutHistory";
import { useAuth } from "../hooks/useAuth";
import { formatCurrencyFromCents } from "../utils/format";

type CanonicalStatus = "succeeded" | "pending" | "failed" | "other";
type StatusFilter = "all" | "succeeded" | "pending" | "failed";

type PayoutSection = {
  key: string;
  label: string;
  items: HostPayoutHistoryItem[];
};

function normalizeStatus(status: string): CanonicalStatus {
  if (status === "succeeded") return "succeeded";
  if (status === "pending" || status === "processing") return "pending";
  if (status === "failed") return "failed";
  return "other";
}

function resolveHistoryDate(item: HostPayoutHistoryItem): Date | null {
  const raw = item.processedAtIso ?? item.createdAtIso;
  if (!raw) return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function formatHistoryDate(date: Date | null): string {
  if (!date) return "Date unavailable";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatTicketCount(ticketCount: number): string {
  if (ticketCount === 1) {
    return "1 ticket";
  }
  return `${ticketCount} tickets`;
}

function getStatusLabel(status: CanonicalStatus): string {
  if (status === "succeeded") return "Sent";
  if (status === "pending") return "Pending";
  if (status === "failed") return "Failed";
  return "Unknown";
}

function getStatusChipClass(status: CanonicalStatus): string {
  if (status === "succeeded") return "chip-live";
  if (status === "pending") return "chip-upcoming";
  if (status === "failed") return "chip-cancelled";
  return "chip-upcoming";
}

function buildSections(items: HostPayoutHistoryItem[]): PayoutSection[] {
  const sectionsMap = new Map<string, PayoutSection>();

  items.forEach((item) => {
    const date = resolveHistoryDate(item);
    const key = date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      : "unknown";
    const label = date
      ? date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
      : "Unknown Date";

    const existing = sectionsMap.get(key);
    if (existing) {
      existing.items.push(item);
      return;
    }

    sectionsMap.set(key, {
      key,
      label,
      items: [item]
    });
  });

  return Array.from(sectionsMap.values());
}

function formatPayoutAmount(valueCents: number, currency: string): string {
  if (!Number.isFinite(valueCents)) return "$0";
  const amount = valueCents / 100;
  const hasCents = valueCents % 100 !== 0;
  const formatted = hasCents ? amount.toFixed(2) : amount.toFixed(0);
  return currency === "USD" ? `$${formatted}` : `${currency} ${formatted}`;
}

export default function AccountPayoutHistory() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");

  const {
    items: payoutHistory,
    loading: payoutHistoryLoading,
    error: payoutHistoryError,
    refetch: refetchPayoutHistory
  } = useHostPayoutHistory(user?.uid);

  const counts = useMemo(() => {
    const base = { succeeded: 0, pending: 0, failed: 0, other: 0 };
    payoutHistory.forEach((item) => {
      base[normalizeStatus(item.status)] += 1;
    });
    return base;
  }, [payoutHistory]);

  const filteredHistory = useMemo(() => {
    if (activeFilter === "all") {
      return payoutHistory;
    }
    return payoutHistory.filter((item) => normalizeStatus(item.status) === activeFilter);
  }, [activeFilter, payoutHistory]);

  const sections = useMemo(() => buildSections(filteredHistory), [filteredHistory]);

  const filteredTotalCents = useMemo(
    () =>
      filteredHistory.reduce((sum, item) => {
        if (normalizeStatus(item.status) === "failed") {
          return sum;
        }
        return sum + Math.max(0, item.amountCents);
      }, 0),
    [filteredHistory]
  );

  const filterOptions: Array<{
    key: StatusFilter;
    label: string;
    count: number;
  }> = [
    { key: "all", label: "All", count: payoutHistory.length },
    { key: "succeeded", label: "Sent", count: counts.succeeded },
    { key: "pending", label: "Pending", count: counts.pending },
    { key: "failed", label: "Failed", count: counts.failed }
  ];

  return (
    <AppShell header={<div className="simple-header"><h1>Payout History</h1></div>}>
      <section className="payouts-page">
        <article className="payouts-card">
          <div className="section-header">
            <div>
              <h2>Payout history</h2>
              <p className="section-subtitle">
                Every payout transfer tied to your hosted events.
              </p>
            </div>
            <Link className="secondary-button" to="/account">
              Back to account
            </Link>
          </div>

          <div className="payout-history-summary">
            <div className="tailgate-details-metric-card">
              <p>Payouts</p>
              <strong>{filteredHistory.length}</strong>
            </div>
            <div className="tailgate-details-metric-card">
              <p>Total Amount</p>
              <strong>{formatCurrencyFromCents(filteredTotalCents)}</strong>
              <span className="tailgate-details-metric-meta">Excludes failed</span>
            </div>
          </div>

          <div
            className="filter-tabs payouts-history-filter-tabs"
            role="tablist"
            aria-label="Payout history status"
          >
            {filterOptions.map((option) => {
              const selected = activeFilter === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className={`filter-tab ${selected ? "active" : ""}`}
                  onClick={() => setActiveFilter(option.key)}
                >
                  {option.label} ({option.count})
                </button>
              );
            })}
          </div>

          {payoutHistoryError ? (
            <div className="payout-history-error-wrap">
              <p className="error-banner">Unable to load payout history right now.</p>
              <button
                type="button"
                className="secondary-button"
                onClick={refetchPayoutHistory}
              >
                Try again
              </button>
            </div>
          ) : null}

          {payoutHistoryLoading ? (
            <p className="meta-muted">Loading payout history...</p>
          ) : sections.length === 0 ? (
            <p className="meta-muted">No payouts found for this filter.</p>
          ) : (
            sections.map((section) => (
              <div key={section.key} className="payout-history-section">
                <p className="payout-history-section-title">{section.label}</p>
                <div className="payout-history-list">
                  {section.items.map((item) => {
                    const eventLabel =
                      item.eventName === "Unknown tailgate" ? "Deleted event" : item.eventName;
                    const date = resolveHistoryDate(item);
                    const status = normalizeStatus(item.status);

                    return (
                      <div className="payout-history-row" key={item.payoutId}>
                        <div>
                          <p className="payouts-tailgate-name">{eventLabel}</p>
                          <p className="payouts-tailgate-meta">
                            {formatHistoryDate(date)} · {formatTicketCount(item.ticketCount)}
                          </p>
                        </div>
                        <div className="payout-history-right">
                          <p className="payouts-tailgate-amount">
                            {formatPayoutAmount(item.amountCents, item.currency || "USD")}
                          </p>
                          <span className={`chip ${getStatusChipClass(status)}`}>
                            {getStatusLabel(status)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </article>
      </section>
    </AppShell>
  );
}

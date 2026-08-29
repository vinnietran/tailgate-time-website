import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import AdminConsoleNav from "../components/AdminConsoleNav";
import TopBar from "../components/TopBar";
import { useAuth } from "../hooks/useAuth";
import {
  type AdminMetricsActivity,
  type AdminMetricsDailyBucket,
  type AdminMetricsTailgate,
  useAdminMetricsDashboard
} from "../hooks/useAdminMetricsDashboard";
import {
  formatCurrencyFromCents,
  formatCurrencyFromCentsExact,
  formatDateTime,
  getFirstName
} from "../utils/format";

type TrendMetricKey =
  | "usersCreated"
  | "tailgatesCreated"
  | "ticketsSold"
  | "grossRevenueCents";

type FilledDailyBucket = AdminMetricsDailyBucket & {
  label: string;
};

type TrendCardDefinition = {
  key: TrendMetricKey;
  label: string;
  helper: string;
  valueFormatter: (value: number) => string;
};

type MetricCardTone = "success" | "warning" | "danger";

const TREND_CARD_DEFINITIONS: TrendCardDefinition[] = [
  {
    key: "usersCreated",
    label: "New users",
    helper: "Daily signups",
    valueFormatter: formatCompactNumber
  },
  {
    key: "tailgatesCreated",
    label: "Tailgates created",
    helper: "New event supply",
    valueFormatter: formatCompactNumber
  },
  {
    key: "ticketsSold",
    label: "Tickets sold",
    helper: "Confirmed paid tickets only",
    valueFormatter: formatCompactNumber
  },
  {
    key: "grossRevenueCents",
    label: "Gross revenue",
    helper: "Stripe-confirmed volume",
    valueFormatter: formatCurrencyFromCents
  }
];

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: value >= 1000 ? 1 : 0
  }).format(value);
}

function formatPercent(part: number, total: number) {
  if (total <= 0) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}

function formatVisibilityLabel(value: string) {
  return value.replace(/_/g, " ");
}

function formatActivityType(value: string) {
  return value.replace(/_/g, " ");
}

function formatRelativeDate(date: Date | null) {
  if (!date) return "No timestamp";
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / (60 * 1000));
  if (Math.abs(diffMinutes) < 60) {
    return `${Math.abs(diffMinutes)}m ${diffMinutes >= 0 ? "ago" : "ahead"}`;
  }
  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    return `${Math.abs(diffHours)}h ${diffHours >= 0 ? "ago" : "ahead"}`;
  }
  const diffDays = Math.round(diffHours / 24);
  return `${Math.abs(diffDays)}d ${diffDays >= 0 ? "ago" : "ahead"}`;
}

function formatSizeSource(value: string) {
  if (value === "confirmed_paid") return "Confirmed tickets";
  if (value === "rsvp") return "RSVP count";
  if (value === "explicit") return "Size estimate";
  return "Unknown";
}

function buildFilledDailySeries(
  dailyBuckets: AdminMetricsDailyBucket[],
  days: number
): FilledDailyBucket[] {
  const bucketsByDate = new Map(dailyBuckets.map((bucket) => [bucket.dateKey, bucket]));
  const series: FilledDailyBucket[] = [];
  const formatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - offset);
    const dateKey = date.toISOString().slice(0, 10);
    const bucket = bucketsByDate.get(dateKey);
    series.push({
      id: dateKey,
      dateKey,
      usersCreated: bucket?.usersCreated ?? 0,
      tailgatesCreated: bucket?.tailgatesCreated ?? 0,
      privateTailgatesCreated: bucket?.privateTailgatesCreated ?? 0,
      openFreeTailgatesCreated: bucket?.openFreeTailgatesCreated ?? 0,
      openPaidTailgatesCreated: bucket?.openPaidTailgatesCreated ?? 0,
      ticketsSold: bucket?.ticketsSold ?? 0,
      grossRevenueCents: bucket?.grossRevenueCents ?? 0,
      platformFeeRevenueCents: bucket?.platformFeeRevenueCents ?? 0,
      refundCount: bucket?.refundCount ?? 0,
      refundedRevenueCents: bucket?.refundedRevenueCents ?? 0,
      feedPostsCreated: bucket?.feedPostsCreated ?? 0,
      updatedAt: bucket?.updatedAt ?? null,
      label: formatter.format(date)
    });
  }

  return series;
}

function sumSeries(series: FilledDailyBucket[], key: TrendMetricKey | "platformFeeRevenueCents") {
  return series.reduce((sum, bucket) => sum + bucket[key], 0);
}

function TrendBars({
  series,
  metricKey,
  valueFormatter
}: {
  series: FilledDailyBucket[];
  metricKey: TrendMetricKey;
  valueFormatter: (value: number) => string;
}) {
  const maxValue = Math.max(...series.map((item) => item[metricKey]), 0);

  return (
    <div className="admin-metrics-trend-bars" aria-hidden>
      {series.map((item) => {
        const value = item[metricKey];
        const height = maxValue > 0 ? Math.max(10, (value / maxValue) * 100) : 10;
        return (
          <span
            key={`${metricKey}-${item.dateKey}`}
            className="admin-metrics-trend-bar"
            title={`${item.label}: ${valueFormatter(value)}`}
            style={{ height: `${height}%` }}
          />
        );
      })}
    </div>
  );
}

function MetricCard({
  label,
  value,
  helper,
  tone
}: {
  label: string;
  value: string;
  helper: string;
  tone?: MetricCardTone;
}) {
  return (
    <section className={`admin-ops-metric-card ${tone ? `is-${tone}` : ""}`}>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{helper}</span>
    </section>
  );
}

function DetailMetricRow({
  label,
  value,
  helper
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="admin-metrics-detail-row">
      <div className="admin-metrics-detail-copy">
        <span>{label}</span>
        <small>{helper}</small>
      </div>
      <strong>{value}</strong>
    </div>
  );
}

function TrendCard({
  definition,
  series
}: {
  definition: TrendCardDefinition;
  series: FilledDailyBucket[];
}) {
  const total = sumSeries(series, definition.key);
  const average = total > 0 ? total / Math.max(1, series.length) : 0;

  return (
    <article className="admin-metrics-trend-card">
      <div className="admin-metrics-trend-card-header">
        <div>
          <p>{definition.label}</p>
          <strong>{definition.valueFormatter(total)}</strong>
        </div>
        <span>{definition.helper}</span>
      </div>
      <TrendBars
        series={series}
        metricKey={definition.key}
        valueFormatter={definition.valueFormatter}
      />
      <div className="admin-metrics-trend-footer">
        <span>{series.length} day window</span>
        <span>{definition.valueFormatter(Math.round(average))} avg / day</span>
      </div>
    </article>
  );
}

function ActivityRow({ item }: { item: AdminMetricsActivity }) {
  return (
    <article className="admin-ops-list-item compact">
      <div className="admin-ops-list-top">
        <div>
          <h3>{item.summary}</h3>
          <p>{item.titleSnapshot ?? formatActivityType(item.type)}</p>
        </div>
        <span className="chip chip-upcoming">{formatActivityType(item.type)}</span>
      </div>
      <div className="admin-ops-list-meta">
        <span>{formatRelativeDate(item.createdAt)}</span>
        {item.createdAt ? <span>{formatDateTime(item.createdAt)}</span> : null}
        {typeof item.quantity === "number" ? <span>{formatCompactNumber(item.quantity)} qty</span> : null}
        {typeof item.amountCents === "number" ? <span>{formatCurrencyFromCents(item.amountCents)}</span> : null}
      </div>
      {item.relatedTailgateId ? (
        <Link className="admin-ops-inline-link" to={`/tailgates/${item.relatedTailgateId}`}>
          Open tailgate
        </Link>
      ) : null}
    </article>
  );
}

function TailgateRow({ item }: { item: AdminMetricsTailgate }) {
  const sizeLabel = item.estimatedSize == null ? "Unknown" : formatCompactNumber(item.estimatedSize);

  return (
    <article className="admin-ops-list-item">
      <div className="admin-ops-list-top">
        <div>
          <h3>{item.titleSnapshot}</h3>
          <p>{item.hostDisplayNameSnapshot}</p>
        </div>
        <strong>{sizeLabel}</strong>
      </div>
      <p className="admin-ops-list-note">
        {formatSizeSource(item.estimatedSizeSource)} · {formatVisibilityLabel(item.visibilityType)}
      </p>
      <div className="admin-ops-list-meta">
        <span>{item.startTime ? formatDateTime(item.startTime) : "No start time"}</span>
        <span>{formatCurrencyFromCents(item.grossRevenueCents)} gross</span>
        <span>{formatCompactNumber(item.feedPostsCount)} posts</span>
      </div>
      <Link className="admin-ops-inline-link" to={`/tailgates/${item.tailgateEventId}`}>
        Open tailgate
      </Link>
    </article>
  );
}

export default function AdminMetrics() {
  const { user } = useAuth();
  const firstName = getFirstName(user?.displayName ?? user?.email ?? "Admin");
  const [rangeDays, setRangeDays] = useState<7 | 30>(30);
  const { summary, dailyBuckets, topHosts, largestUpcomingTailgates, recentActivity, loading, error } =
    useAdminMetricsDashboard();

  const filled30DaySeries = useMemo(() => buildFilledDailySeries(dailyBuckets, 30), [dailyBuckets]);
  const selectedSeries = useMemo(
    () => filled30DaySeries.slice(Math.max(0, filled30DaySeries.length - rangeDays)),
    [filled30DaySeries, rangeDays]
  );
  const last7Series = useMemo(
    () => filled30DaySeries.slice(Math.max(0, filled30DaySeries.length - 7)),
    [filled30DaySeries]
  );

  const newUsersLast7Days = sumSeries(last7Series, "usersCreated");
  const tailgatesCreatedLast7Days = sumSeries(last7Series, "tailgatesCreated");
  const platformFeesLast30Days = sumSeries(filled30DaySeries, "platformFeeRevenueCents");
  const grossRevenueLast30Days = sumSeries(filled30DaySeries, "grossRevenueCents");
  const avgTailgateSize =
    summary.estimatedTailgateSizeKnownCount > 0
      ? summary.estimatedTailgateSizeTotal / summary.estimatedTailgateSizeKnownCount
      : null;

  const summaryCards = [
    {
      label: "Total users",
      value: formatCompactNumber(summary.totalUsers),
      helper: `${formatCompactNumber(newUsersLast7Days)} new in the last 7 days`,
      tone: "success" as const
    },
    {
      label: "Total tailgates",
      value: formatCompactNumber(summary.totalTailgates),
      helper: `${formatCompactNumber(tailgatesCreatedLast7Days)} created in the last 7 days`
    },
    {
      label: "Upcoming tailgates",
      value: formatCompactNumber(summary.upcomingTailgates),
      helper: `${formatCompactNumber(summary.upcomingTailgatesWithoutEngagement)} with no engagement yet`,
      tone: summary.upcomingTailgatesWithoutEngagement > 0 ? ("warning" as const) : undefined
    },
    {
      label: "Total tickets sold",
      value: formatCompactNumber(summary.totalTicketsSold),
      helper: "Confirmed ticket purchases only"
    },
    {
      label: "Gross ticket revenue",
      value: formatCurrencyFromCents(summary.grossRevenueCents),
      helper: `${formatCurrencyFromCents(grossRevenueLast30Days)} in the last 30 days`,
      tone: "success" as const
    },
    {
      label: "Platform fee revenue",
      value: formatCurrencyFromCents(summary.platformFeeRevenueCents),
      helper: `${formatCurrencyFromCents(platformFeesLast30Days)} in the last 30 days`
    },
    {
      label: "Stripe-connected hosts",
      value: formatCompactNumber(summary.stripeConnectedHosts),
      helper: `${formatCompactNumber(summary.pendingPayoutTailgates)} pending payout tailgates`
    },
    {
      label: "Refunded revenue",
      value: formatCurrencyFromCents(summary.refundedRevenueCents),
      helper: `${formatCompactNumber(summary.refundedTickets)} refunded tickets`,
      tone: summary.refundedTickets > 0 ? ("warning" as const) : undefined
    }
  ];

  return (
    <AppShell header={<TopBar firstName={firstName} />} showHeaderActions={false}>
      <section className="admin-console-stack">
        <article className="tailgate-card admin-console-card admin-ops-hero">
          <div className="section-header">
            <div>
              <h2>Owner Metrics Dashboard</h2>
              <p className="section-subtitle">
                Firebase aggregate metrics for growth, marketplace activity, and operational health.
              </p>
            </div>
            <AdminConsoleNav />
          </div>
          <div className="admin-console-note">
            Tailgate size is estimated from confirmed paid tickets first, then RSVP counts, then any explicit size
            field. Revenue values are shown in USD from aggregate cents fields.
          </div>
          {loading ? <p className="meta-muted">Loading admin metrics...</p> : null}
          {error ? <p className="error-banner">{error}</p> : null}
          <div className="admin-ops-metric-grid">
            {summaryCards.map((metric) => (
              <MetricCard
                key={metric.label}
                label={metric.label}
                value={metric.value}
                helper={metric.helper}
                tone={metric.tone}
              />
            ))}
          </div>
          <div className="admin-metrics-footer">
            <span>Last updated: {summary.updatedAt ? formatRelativeDate(summary.updatedAt) : "Awaiting data"}</span>
            <span>Schema v{summary.schemaVersion}</span>
          </div>
        </article>

        <article className="tailgate-card admin-console-card">
          <div className="section-header">
            <div>
              <h2>Trend Charts</h2>
              <p className="section-subtitle">
                Aggregate daily buckets for signups, supply, ticket volume, and revenue.
              </p>
            </div>
            <div className="admin-metrics-range-toggle" aria-label="Trend range">
              <button
                type="button"
                className={`secondary-button${rangeDays === 7 ? " active" : ""}`}
                aria-pressed={rangeDays === 7}
                onClick={() => setRangeDays(7)}
              >
                7D
              </button>
              <button
                type="button"
                className={`secondary-button${rangeDays === 30 ? " active" : ""}`}
                aria-pressed={rangeDays === 30}
                onClick={() => setRangeDays(30)}
              >
                30D
              </button>
            </div>
          </div>
          {selectedSeries.length === 0 ? (
            <p className="meta-muted">No daily metric buckets have been written yet.</p>
          ) : (
            <div className="admin-metrics-trend-grid">
              {TREND_CARD_DEFINITIONS.map((definition) => (
                <TrendCard key={definition.key} definition={definition} series={selectedSeries} />
              ))}
            </div>
          )}
        </article>

        <div className="admin-metrics-insight-grid">
          <article className="tailgate-card admin-console-card">
            <div className="section-header">
              <div>
                <h2>Tailgate Breakdown</h2>
                <p className="section-subtitle">Marketplace supply by visibility and monetization type.</p>
              </div>
            </div>
            <div className="admin-metrics-breakdown-list">
              <div className="admin-metrics-breakdown-row">
                <span>Private</span>
                <strong>{formatCompactNumber(summary.totalPrivateTailgates)}</strong>
                <small>{formatPercent(summary.totalPrivateTailgates, summary.totalTailgates)}</small>
              </div>
              <div className="admin-metrics-breakdown-row">
                <span>Open free</span>
                <strong>{formatCompactNumber(summary.totalOpenFreeTailgates)}</strong>
                <small>{formatPercent(summary.totalOpenFreeTailgates, summary.totalTailgates)}</small>
              </div>
              <div className="admin-metrics-breakdown-row">
                <span>Open paid</span>
                <strong>{formatCompactNumber(summary.totalOpenPaidTailgates)}</strong>
                <small>{formatPercent(summary.totalOpenPaidTailgates, summary.totalTailgates)}</small>
              </div>
            </div>
          </article>

          <article className="tailgate-card admin-console-card">
            <div className="section-header">
              <div>
                <h2>Engagement Snapshot</h2>
                <p className="section-subtitle">Clear labels so size metrics do not imply exact attendance.</p>
              </div>
            </div>
            <div className="admin-metrics-detail-list">
              <DetailMetricRow
                label="Avg tailgate size"
                value={avgTailgateSize == null ? "N/A" : avgTailgateSize.toFixed(1)}
                helper="Confirmed tickets / RSVP counts"
              />
              <DetailMetricRow
                label="Total feed posts"
                value={formatCompactNumber(summary.totalFeedPosts)}
                helper="Across all event feeds"
              />
              <DetailMetricRow
                label="No-engagement upcoming"
                value={formatCompactNumber(summary.upcomingTailgatesWithoutEngagement)}
                helper="Zero estimated attendees"
              />
            </div>
          </article>

          <article className="tailgate-card admin-console-card">
            <div className="section-header">
              <div>
                <h2>Operational Health</h2>
                <p className="section-subtitle">Backend-owned metrics that help flag payout and refund pressure.</p>
              </div>
            </div>
            <div className="admin-metrics-detail-list">
              <DetailMetricRow
                label="Stripe-connected hosts"
                value={formatCompactNumber(summary.stripeConnectedHosts)}
                helper="Hosts ready to receive payouts"
              />
              <DetailMetricRow
                label="Pending payout tailgates"
                value={formatCompactNumber(summary.pendingPayoutTailgates)}
                helper="Paid events with pending payout status"
              />
              <DetailMetricRow
                label="Failed payout tailgates"
                value={formatCompactNumber(summary.failedPayoutTailgates)}
                helper="Requires operational follow-up"
              />
            </div>
          </article>
        </div>

        <div className="admin-ops-grid">
          <article className="tailgate-card admin-console-card">
            <div className="section-header">
              <div>
                <h2>Top Hosts</h2>
                <p className="section-subtitle">Backed by host aggregate docs instead of raw client-side scans.</p>
              </div>
            </div>
            {topHosts.length === 0 ? (
              <p className="meta-muted">No host aggregates yet.</p>
            ) : (
              <div className="admin-ops-list">
                {topHosts.map((host) => (
                  <article className="admin-ops-list-item" key={host.id}>
                    <div className="admin-ops-list-top">
                      <div>
                        <h3>{host.displayNameSnapshot}</h3>
                        <p>
                          {host.stripeConnected === null
                            ? "Stripe status unavailable"
                            : host.stripeConnected
                              ? "Stripe connected"
                              : "Stripe not connected"}
                        </p>
                      </div>
                      <strong>{formatCompactNumber(host.tailgatesCreated)}</strong>
                    </div>
                    <p className="admin-ops-list-note">
                      {formatCompactNumber(host.openTailgatesCreated)} open tailgates ·{" "}
                      {formatCompactNumber(host.paidTailgatesCreated)} paid tailgates
                    </p>
                    <div className="admin-ops-list-meta">
                      <span>{formatCompactNumber(host.ticketsSold)} tickets sold</span>
                      <span>{formatCurrencyFromCents(host.grossRevenueCents)} gross</span>
                      <span>{formatCompactNumber(host.upcomingTailgates)} upcoming</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </article>

          <article className="tailgate-card admin-console-card">
            <div className="section-header">
              <div>
                <h2>Largest Upcoming Tailgates</h2>
                <p className="section-subtitle">Estimated size from confirmed tickets, RSVPs, or explicit counts.</p>
              </div>
            </div>
            {largestUpcomingTailgates.length === 0 ? (
              <p className="meta-muted">No upcoming aggregate tailgate sizes yet.</p>
            ) : (
              <div className="admin-ops-list">
                {largestUpcomingTailgates.map((tailgate) => (
                  <TailgateRow item={tailgate} key={tailgate.id} />
                ))}
              </div>
            )}
          </article>

          <article className="tailgate-card admin-console-card admin-metrics-activity-card">
            <div className="section-header">
              <div>
                <h2>Recent Platform Activity</h2>
                <p className="section-subtitle">Latest user, tailgate, ticket, refund, and feed events.</p>
              </div>
            </div>
            {recentActivity.length === 0 ? (
              <p className="meta-muted">No recent activity has been recorded yet.</p>
            ) : (
              <div className="admin-ops-list">
                {recentActivity.map((item) => (
                  <ActivityRow item={item} key={item.id} />
                ))}
              </div>
            )}
          </article>
        </div>

        <article className="tailgate-card admin-console-card">
          <div className="section-header">
            <div>
              <h2>Revenue Notes</h2>
              <p className="section-subtitle">Quick context for interpreting the aggregate dashboard.</p>
            </div>
          </div>
          <div className="admin-metrics-note-grid">
            <DetailMetricRow
              label="Gross revenue"
              value={formatCurrencyFromCentsExact(summary.grossRevenueCents)}
              helper="Before refunds"
            />
            <DetailMetricRow
              label="Platform fees"
              value={formatCurrencyFromCentsExact(summary.platformFeeRevenueCents)}
              helper="Fees collected by the platform"
            />
            <DetailMetricRow
              label="Refunded revenue"
              value={formatCurrencyFromCentsExact(summary.refundedRevenueCents)}
              helper="Tracked separately from sold totals"
            />
          </div>
        </article>
      </section>
    </AppShell>
  );
}

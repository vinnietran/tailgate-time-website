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
    <article className={`paid-analytics-summary-card platform-metrics-summary-card ${tone ? `is-${tone}` : ""}`}>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{helper}</span>
    </article>
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
    <article className="paid-analytics-chart-card platform-metrics-trend-card">
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
      <section className="admin-console-stack paid-analytics-dashboard platform-metrics-dashboard">
        <article className="paid-analytics-hero">
          <div className="paid-analytics-hero-heading">
            <div>
              <p className="paid-analytics-eyebrow">Admin · Platform overview</p>
              <h2>Platform Metrics</h2>
              <p>Track audience growth, event supply, ticket revenue, and operating health.</p>
            </div>
            <AdminConsoleNav />
          </div>
          <div className="paid-analytics-range-bar">
            <div className="paid-analytics-preset-group" aria-label="Metrics trend range">
              <button
                type="button"
                className={rangeDays === 7 ? "active" : ""}
                aria-pressed={rangeDays === 7}
                onClick={() => setRangeDays(7)}
              >
                Last 7 Days
              </button>
              <button
                type="button"
                className={rangeDays === 30 ? "active" : ""}
                aria-pressed={rangeDays === 30}
                onClick={() => setRangeDays(30)}
              >
                Last 30 Days
              </button>
            </div>
            <span>
              Last updated: {summary.updatedAt ? formatRelativeDate(summary.updatedAt) : "Awaiting data"}
            </span>
          </div>
        </article>

        <div className="platform-metrics-context-note">
          Revenue and ticket totals use confirmed purchases. Tailgate size uses confirmed tickets,
          then RSVPs, then the event estimate when needed.
        </div>
        {loading ? <div className="paid-analytics-loading" aria-live="polite">Loading platform metrics…</div> : null}
        {error ? <p className="error-banner">{error}</p> : null}

        <div className="paid-analytics-summary-grid">
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

        <article className="tailgate-card admin-console-card paid-analytics-section">
          <div className="section-header">
            <div>
              <h2>Platform Trends</h2>
              <p className="section-subtitle">Daily movement across growth, event supply, tickets, and revenue.</p>
            </div>
          </div>
          {selectedSeries.length === 0 ? (
            <div className="paid-analytics-empty">
              <strong>No trend data yet.</strong>
              <span>Daily metrics will appear as aggregate buckets are recorded.</span>
            </div>
          ) : (
            <div className="paid-analytics-chart-grid platform-metrics-trend-grid">
              {TREND_CARD_DEFINITIONS.map((definition) => (
                <TrendCard key={definition.key} definition={definition} series={selectedSeries} />
              ))}
            </div>
          )}
        </article>

        <div className="platform-metrics-overview-grid">
          <article className="tailgate-card admin-console-card paid-analytics-section">
            <div className="section-header">
              <div>
                <h2>Event Mix</h2>
                <p className="section-subtitle">How current tailgate supply is distributed.</p>
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

          <article className="tailgate-card admin-console-card paid-analytics-section">
            <div className="section-header">
              <div>
                <h2>Engagement</h2>
                <p className="section-subtitle">Audience size and activity across tailgates.</p>
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

          <article className="tailgate-card admin-console-card paid-analytics-section">
            <div className="section-header">
              <div>
                <h2>Operational Health</h2>
                <p className="section-subtitle">Payout readiness and issues needing attention.</p>
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

        <div className="platform-metrics-leader-grid">
          <article className="tailgate-card admin-console-card paid-analytics-section">
            <div className="section-header">
              <div>
                <h2>Top Hosts</h2>
                <p className="section-subtitle">Hosts leading in event volume and ticket activity.</p>
              </div>
            </div>
            {topHosts.length === 0 ? (
              <div className="paid-analytics-empty"><strong>No host metrics yet.</strong><span>Host rankings will appear as activity is recorded.</span></div>
            ) : (
              <div className="paid-analytics-ranking-list platform-metrics-ranking-list">
                {topHosts.map((host) => (
                  <div className="platform-metrics-ranking-row" key={host.id}>
                    <div>
                        <h3>{host.displayNameSnapshot}</h3>
                        <small>
                          {host.stripeConnected === null
                            ? "Stripe status unavailable"
                            : host.stripeConnected
                              ? "Stripe connected"
                              : "Stripe not connected"}
                        </small>
                    </div>
                    <div>
                      <strong>{formatCompactNumber(host.tailgatesCreated)} events</strong>
                      <small>{formatCompactNumber(host.ticketsSold)} tickets · {formatCurrencyFromCents(host.grossRevenueCents)} gross</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="tailgate-card admin-console-card paid-analytics-section">
            <div className="section-header">
              <div>
                <h2>Largest Upcoming Tailgates</h2>
                <p className="section-subtitle">Upcoming events with the strongest expected attendance.</p>
              </div>
            </div>
            {largestUpcomingTailgates.length === 0 ? (
              <div className="paid-analytics-empty"><strong>No upcoming event metrics yet.</strong><span>Attendance estimates will appear here.</span></div>
            ) : (
              <div className="admin-ops-list">
                {largestUpcomingTailgates.map((tailgate) => (
                  <TailgateRow item={tailgate} key={tailgate.id} />
                ))}
              </div>
            )}
          </article>
        </div>

        <article className="tailgate-card admin-console-card paid-analytics-section platform-metrics-activity-card">
            <div className="section-header">
              <div>
                <h2>Recent Activity</h2>
                <p className="section-subtitle">Latest user, tailgate, ticket, refund, and feed events.</p>
              </div>
            </div>
            {recentActivity.length === 0 ? (
              <div className="paid-analytics-empty"><strong>No recent activity.</strong><span>New platform events will appear here.</span></div>
            ) : (
              <div className="platform-metrics-activity-list">
                {recentActivity.map((item) => (
                  <ActivityRow item={item} key={item.id} />
                ))}
              </div>
            )}
        </article>

        <article className="tailgate-card admin-console-card paid-analytics-section platform-metrics-revenue-card">
          <div className="section-header">
            <div>
              <h2>Revenue Accounting</h2>
              <p className="section-subtitle">Confirmed volume, platform fees, and refunds kept separate.</p>
            </div>
            <span className="platform-metrics-schema">Schema v{summary.schemaVersion}</span>
          </div>
          <div className="admin-metrics-note-grid">
            <DetailMetricRow
              label="Gross revenue"
              value={formatCurrencyFromCentsExact(summary.grossRevenueCents)}
              helper="Confirmed volume before refunds"
            />
            <DetailMetricRow
              label="Platform fees"
              value={formatCurrencyFromCentsExact(summary.platformFeeRevenueCents)}
              helper="Recorded fees collected"
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

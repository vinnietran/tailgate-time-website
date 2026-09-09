import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import AdminConsoleNav from "../components/AdminConsoleNav";
import TopBar from "../components/TopBar";
import { useAuth } from "../hooks/useAuth";
import {
  type AnalyticsRangePreset,
  type PaidAnalyticsEvent,
  type PaidAnalyticsTrend,
  usePaidTailgateAnalyticsDashboard
} from "../hooks/usePaidTailgateAnalyticsDashboard";
import { formatCurrencyFromCents, getFirstName } from "../utils/format";

type EventSort = "views" | "conversion" | "tickets" | "revenue" | "date";

const FUNNEL_LABELS: Record<string, string> = {
  paid_tailgate_impression: "Impressions",
  paid_tailgate_view: "Event views",
  ticket_type_selected: "Ticket selections",
  checkout_started: "Checkout starts",
  purchase_completed: "Tracked purchases"
};

const SOURCE_LABELS: Record<string, string> = {
  discover: "Discover",
  search: "Search",
  map: "Map",
  host_page: "Host page",
  game_page: "Game page",
  direct_link: "Direct link",
  instagram: "Instagram",
  facebook: "Facebook",
  google: "Google",
  email: "Email",
  push_notification: "Push notification",
  other: "Other"
};

const DIAGNOSTIC_THRESHOLDS = {
  highTrafficViews: 50,
  lowTrafficViews: 5,
  checkoutAbandonmentStarts: 10,
  checkoutConversionRate: 0.2
} as const;

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatPercent(value: number | null) {
  return value === null ? "—" : new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return "Date unavailable";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function formatSource(value: string) {
  return SOURCE_LABELS[value] ?? value.replace(/_/g, " ");
}

function diagnostics(event: PaidAnalyticsEvent) {
  const alerts: string[] = [];
  if (event.views >= DIAGNOSTIC_THRESHOLDS.highTrafficViews && event.completedOrders === 0) {
    alerts.push("High traffic, no purchases");
  }
  if (
    event.checkoutStarts >= DIAGNOSTIC_THRESHOLDS.checkoutAbandonmentStarts &&
    (event.checkoutConversionRate ?? 0) < DIAGNOSTIC_THRESHOLDS.checkoutConversionRate
  ) {
    alerts.push("High checkout abandonment");
  }
  if (event.views < DIAGNOSTIC_THRESHOLDS.lowTrafficViews) alerts.push("Low traffic");
  return alerts;
}

function SummaryCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <article className="paid-analytics-summary-card">
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{helper}</span>
    </article>
  );
}

function TrendChart({
  title,
  data,
  metric,
  formatValue = formatNumber
}: {
  title: string;
  data: PaidAnalyticsTrend[];
  metric: keyof Pick<PaidAnalyticsTrend, "views" | "checkoutStarts" | "purchases" | "grossRevenueCents">;
  formatValue?: (value: number) => string;
}) {
  const max = Math.max(0, ...data.map((item) => item[metric]));
  const total = data.reduce((sum, item) => sum + item[metric], 0);
  return (
    <article className="paid-analytics-chart-card">
      <div>
        <p>{title}</p>
        <strong>{formatValue(total)}</strong>
      </div>
      {data.length ? (
        <div className="paid-analytics-chart" aria-label={`${title} trend`}>
          {data.map((item) => (
            <span
              key={`${metric}-${item.date}`}
              style={{ height: `${max > 0 ? Math.max(5, (item[metric] / max) * 100) : 5}%` }}
              title={`${formatDate(item.date)}: ${formatValue(item[metric])}`}
            />
          ))}
        </div>
      ) : (
        <p className="meta-muted">No data in this range.</p>
      )}
    </article>
  );
}

function EventDetail({ event }: { event: PaidAnalyticsEvent }) {
  const metrics = [
    ["Impressions", event.impressions],
    ["Views", event.views],
    ["Ticket selections", event.ticketSelections],
    ["Checkout starts", event.checkoutStarts],
    ["Completed orders", event.completedOrders],
    ["Tickets sold", event.ticketsSold]
  ] as const;
  return (
    <div className="paid-analytics-event-detail">
      <div className="paid-analytics-event-detail-metrics">
        {metrics.map(([label, value]) => <span key={label}><small>{label}</small><strong>{formatNumber(value)}</strong></span>)}
        <span><small>Gross revenue</small><strong>{formatCurrencyFromCents(event.grossRevenueCents)}</strong></span>
        <span><small>TailgateTime revenue</small><strong>{formatCurrencyFromCents(event.platformFeeRevenueCents)}</strong></span>
      </div>
      <div className="paid-analytics-event-detail-grid">
        <section>
          <h4>Ticket type performance</h4>
          {event.ticketTypePerformance.length ? (
            <div className="paid-analytics-mini-table">
              {event.ticketTypePerformance.map((ticket) => (
                <div key={ticket.ticketTypeId}>
                  <span><strong>{ticket.name}</strong><small>{formatCurrencyFromCents(ticket.priceCents)}</small></span>
                  <span>{formatNumber(ticket.ticketsSold)} sold</span>
                  <span>{formatCurrencyFromCents(ticket.revenueCents)}</span>
                  <span>{formatPercent(ticket.salesShare)}</span>
                </div>
              ))}
            </div>
          ) : <p className="meta-muted">No completed ticket sales in this range.</p>}
        </section>
        <section>
          <h4>Traffic sources</h4>
          {event.sources.length ? (
            <div className="paid-analytics-mini-table">
              {event.sources.sort((a, b) => b.views - a.views).map((source) => (
                <div key={source.source}>
                  <strong>{formatSource(source.source)}</strong>
                  <span>{formatNumber(source.views)} views</span>
                  <span>{formatNumber(source.purchases)} purchases</span>
                  <span>{formatPercent(source.conversionRate)}</span>
                </div>
              ))}
            </div>
          ) : <p className="meta-muted">No attributed traffic in this range.</p>}
        </section>
      </div>
      <Link className="admin-ops-inline-link" to={`/tailgates/${event.id}`}>Open tailgate</Link>
    </div>
  );
}

export default function AdminTicketAnalytics() {
  const { user } = useAuth();
  const [preset, setPreset] = useState<AnalyticsRangePreset>("last_30_days");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [appliedCustom, setAppliedCustom] = useState<{ start?: string; end?: string }>({});
  const [search, setSearch] = useState("");
  const [hostFilter, setHostFilter] = useState("");
  const [sort, setSort] = useState<EventSort>("views");
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const range = useMemo(
    () =>
      preset === "custom" && (!appliedCustom.start || !appliedCustom.end)
        ? { preset: "last_30_days" as const }
        : { preset, ...appliedCustom },
    [appliedCustom, preset]
  );
  const { data, loading, error, refresh } = usePaidTailgateAnalyticsDashboard(range);
  const firstName = getFirstName(user?.displayName ?? user?.email ?? "Admin");

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...(data?.events ?? [])]
      .filter((event) => !hostFilter || event.hostId === hostFilter || event.hostName === hostFilter)
      .filter((event) => !query || [event.eventName, event.hostName, event.gameContext, formatDate(event.eventDate)].some((value) => value.toLowerCase().includes(query)))
      .sort((left, right) => {
        if (sort === "conversion") return (right.conversionRate ?? -1) - (left.conversionRate ?? -1);
        if (sort === "tickets") return right.ticketsSold - left.ticketsSold;
        if (sort === "revenue") return right.grossRevenueCents - left.grossRevenueCents;
        if (sort === "date") return (new Date(right.eventDate ?? 0).getTime() - new Date(left.eventDate ?? 0).getTime());
        return right.views - left.views;
      });
  }, [data?.events, hostFilter, search, sort]);

  const summary = data?.summary;
  const dateLabel = data ? `${formatDate(data.range.start)} – ${formatDate(data.range.end)}` : "Selected period";

  return (
    <AppShell header={<TopBar firstName={firstName} />} showHeaderActions={false}>
      <section className="admin-console-stack paid-analytics-dashboard">
        <article className="paid-analytics-hero">
          <div className="paid-analytics-hero-heading">
            <div>
              <p className="paid-analytics-eyebrow">Admin · Open paid tailgates</p>
              <h2>Ticket Conversion</h2>
              <p>See where fans find paid events, enter checkout, and complete a purchase.</p>
            </div>
            <AdminConsoleNav />
          </div>
          <div className="paid-analytics-range-bar">
            <div className="paid-analytics-preset-group" aria-label="Analytics date range">
              {([
                ["last_7_days", "Last 7 Days"],
                ["last_30_days", "Last 30 Days"],
                ["this_season", "This Season"],
                ["custom", "Custom Range"]
              ] as Array<[AnalyticsRangePreset, string]>).map(([value, label]) => (
                <button key={value} type="button" className={preset === value ? "active" : ""} onClick={() => setPreset(value)}>{label}</button>
              ))}
            </div>
            {preset === "custom" ? (
              <div className="paid-analytics-custom-range">
                <label>From<input type="date" value={customStart} onChange={(event) => setCustomStart(event.target.value)} /></label>
                <label>To<input type="date" value={customEnd} onChange={(event) => setCustomEnd(event.target.value)} /></label>
                <button type="button" onClick={() => setAppliedCustom({ start: customStart || undefined, end: customEnd || undefined })} disabled={!customStart || !customEnd}>Apply</button>
              </div>
            ) : null}
            <span>{dateLabel}</span>
          </div>
        </article>

        {loading ? <div className="paid-analytics-loading" aria-live="polite">Loading conversion data…</div> : null}
        {error ? <div className="error-banner"><span>{error}</span><button type="button" className="secondary-button" onClick={refresh}>Try again</button></div> : null}
        {data?.truncated ? <div className="admin-console-note">This high-volume range reached the reporting row limit. Choose a shorter range for complete funnel totals.</div> : null}
        {data && !data.analyticsStartedAt ? <div className="admin-console-note">Behavioral tracking has not recorded any paid-event activity in this period. Historical purchases still appear below.</div> : null}
        {data?.analyticsStartedAt && new Date(data.range.start) < new Date(data.analyticsStartedAt) ? (
          <div className="admin-console-note">Event-view tracking began on {formatDate(data.analyticsStartedAt)}, so earlier funnel data is unavailable. Historical purchases are still included.</div>
        ) : null}

        {summary ? (
          <div className="paid-analytics-summary-grid">
            <SummaryCard label="Paid event views" value={formatNumber(summary.views)} helper="Tracked detail views" />
            <SummaryCard label="Checkout starts" value={formatNumber(summary.checkoutStarts)} helper="Entered Stripe checkout" />
            <SummaryCard label="Completed orders" value={formatNumber(summary.completedOrders)} helper="Confirmed payment records" />
            <SummaryCard label="Tickets sold" value={formatNumber(summary.ticketsSold)} helper="Confirmed tickets only" />
            <SummaryCard label="Gross ticket revenue" value={formatCurrencyFromCents(summary.grossRevenueCents)} helper="Before fees" />
            <SummaryCard label="TailgateTime revenue" value={formatCurrencyFromCents(summary.platformFeeRevenueCents)} helper="Recorded platform fees" />
            <SummaryCard label="View → purchase" value={formatPercent(summary.viewConversionRate)} helper="Orders ÷ views" />
            <SummaryCard label="Checkout conversion" value={formatPercent(summary.checkoutConversionRate)} helper="Orders ÷ checkout starts" />
          </div>
        ) : null}

        {data ? (
          <article className="tailgate-card admin-console-card paid-analytics-section">
            <div className="section-header"><div><h2>Purchase Funnel</h2><p className="section-subtitle">Raw events and approximate unique visitors for each step.</p></div></div>
            <div className="paid-analytics-funnel">
              {data.funnel.map((stage, index) => (
                <div className="paid-analytics-funnel-stage" key={stage.name}>
                  <span>{index + 1}</span>
                  <div><p>{FUNNEL_LABELS[stage.name] ?? stage.name}</p><strong>{formatNumber(stage.eventCount)}</strong><small>{formatNumber(stage.uniqueUsers)} unique visitors</small></div>
                  {index < data.funnel.length - 1 ? <div className="paid-analytics-funnel-rate"><strong>{formatPercent(stage.nextStageRate)}</strong><small>{formatPercent(stage.dropOffRate)} drop-off</small></div> : null}
                </div>
              ))}
            </div>
          </article>
        ) : null}

        {data ? (
          <article className="tailgate-card admin-console-card paid-analytics-section">
            <div className="section-header"><div><h2>Trends</h2><p className="section-subtitle">Daily for shorter ranges and weekly for longer ranges.</p></div></div>
            <div className="paid-analytics-chart-grid">
              <TrendChart title="Paid event views" data={data.trends} metric="views" />
              <TrendChart title="Checkout starts" data={data.trends} metric="checkoutStarts" />
              <TrendChart title="Completed purchases" data={data.trends} metric="purchases" />
              <TrendChart title="Gross ticket revenue" data={data.trends} metric="grossRevenueCents" formatValue={formatCurrencyFromCents} />
            </div>
          </article>
        ) : null}

        {data ? (
          <article className="tailgate-card admin-console-card paid-analytics-section">
            <div className="section-header"><div><h2>Event Performance</h2><p className="section-subtitle">Open paid tailgates only. Expand a row for ticket and source detail.</p></div></div>
            <div className="paid-analytics-toolbar">
              <label><span>Search events</span><input className="text-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Event, host, team, or date" /></label>
              <label><span>Sort by</span><select className="text-input" value={sort} onChange={(event) => setSort(event.target.value as EventSort)}><option value="views">Views</option><option value="conversion">Conversion rate</option><option value="tickets">Tickets sold</option><option value="revenue">Revenue</option><option value="date">Event date</option></select></label>
              {hostFilter ? <button type="button" className="secondary-button" onClick={() => setHostFilter("")}>Clear host filter</button> : null}
            </div>
            {filteredEvents.length ? (
              <div className="paid-analytics-table-wrap">
                <table className="paid-analytics-table">
                  <thead><tr><th>Event</th><th>Game / team</th><th>Host</th><th>Event date</th><th>Views</th><th>Checkouts</th><th>Orders</th><th>Tickets</th><th>Gross revenue</th><th>Conversion</th></tr></thead>
                  <tbody>
                    {filteredEvents.map((event) => {
                      const alerts = diagnostics(event);
                      const expanded = expandedEventId === event.id;
                      return [
                        <tr key={event.id} className={expanded ? "is-expanded" : ""}>
                          <td><button type="button" className="paid-analytics-event-button" aria-expanded={expanded} onClick={() => setExpandedEventId(expanded ? null : event.id)}><strong>{event.eventName}</strong><span>{expanded ? "Hide details" : "View details"}</span></button>{alerts.length ? <div className="paid-analytics-alerts">{alerts.map((alert) => <small key={alert}>{alert}</small>)}</div> : null}</td>
                          <td>{event.gameContext}</td><td>{event.hostName}</td><td>{formatDate(event.eventDate)}</td><td>{formatNumber(event.views)}</td><td>{formatNumber(event.checkoutStarts)}</td><td>{formatNumber(event.completedOrders)}</td><td>{formatNumber(event.ticketsSold)}</td><td>{formatCurrencyFromCents(event.grossRevenueCents)}</td><td>{formatPercent(event.conversionRate)}</td>
                        </tr>,
                        expanded ? <tr key={`${event.id}-detail`} className="paid-analytics-detail-row"><td colSpan={10}><EventDetail event={event} /></td></tr> : null
                      ];
                    })}
                  </tbody>
                </table>
              </div>
            ) : <div className="paid-analytics-empty"><strong>No paid tailgates match these filters.</strong><span>Try a different date range or search.</span></div>}
          </article>
        ) : null}

        {data ? (
          <div className="paid-analytics-bottom-grid">
            <article className="tailgate-card admin-console-card paid-analytics-section">
              <div className="section-header"><div><h2>Host Performance</h2><p className="section-subtitle">Admin-only comparison across paid events.</p></div></div>
              {data.hosts.length ? <div className="paid-analytics-ranking-list">{[...data.hosts].sort((a, b) => b.grossRevenueCents - a.grossRevenueCents).map((host) => <button key={host.hostId || host.hostName} type="button" onClick={() => setHostFilter(host.hostId || host.hostName)}><span><strong>{host.hostName}</strong><small>{formatNumber(host.paidEvents)} paid events · {formatNumber(host.views)} views</small></span><span><strong>{formatCurrencyFromCents(host.grossRevenueCents)}</strong><small>{formatNumber(host.ticketsSold)} tickets · {formatPercent(host.conversionRate)}</small></span></button>)}</div> : <p className="meta-muted">No open paid tailgates are available.</p>}
            </article>
            <article className="tailgate-card admin-console-card paid-analytics-section">
              <div className="section-header"><div><h2>Traffic Sources</h2><p className="section-subtitle">Where tracked visitors and buyers came from.</p></div></div>
              {data.sources.length ? <div className="paid-analytics-ranking-list">{[...data.sources].sort((a, b) => b.views - a.views).map((source) => <div key={source.source}><span><strong>{formatSource(source.source)}</strong><small>{formatNumber(source.views)} views · {formatNumber(source.checkoutStarts)} checkouts</small></span><span><strong>{formatNumber(source.purchases)} purchases</strong><small>{formatPercent(source.conversionRate)} · {formatCurrencyFromCents(source.revenueCents)}</small></span></div>)}</div> : <p className="meta-muted">No attributed traffic in this range.</p>}
            </article>
          </div>
        ) : null}
      </section>
    </AppShell>
  );
}

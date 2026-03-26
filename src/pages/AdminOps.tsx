import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import TopBar from "../components/TopBar";
import { useAuth } from "../hooks/useAuth";
import {
  type OpsPurchaseAlert,
  type OpsPayoutAlert,
  type OpsPurchaseSummary,
  type OpsTailgateCancellation,
  useAdminOpsDashboard
} from "../hooks/useAdminOpsDashboard";
import { formatCurrencyFromCents, formatDateTime, getFirstName } from "../utils/format";

function formatStatusLabel(value: string) {
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

function statusChipClass(status: string) {
  if (
    status === "confirmed" ||
    status === "paid" ||
    status === "succeeded" ||
    status === "completed" ||
    status === "purchase_succeeded"
  ) {
    return "chip-live";
  }
  if (
    status === "failed" ||
    status === "expired" ||
    status === "cancelled" ||
    status === "canceled" ||
    status === "refunded"
  ) {
    return "chip-cancelled";
  }
  return "chip-upcoming";
}

function metricToneClass(tone?: "default" | "success" | "warning" | "danger") {
  if (tone === "success") return "is-success";
  if (tone === "warning") return "is-warning";
  if (tone === "danger") return "is-danger";
  return "";
}

function AdminConsoleNav() {
  return (
    <div className="admin-console-nav">
      <Link className="secondary-button" to="/admin/ops">
        Ops dashboard
      </Link>
      <Link className="secondary-button" to="/admin/spotlight">
        Spotlight editor
      </Link>
    </div>
  );
}

function CheckoutAlertRow({ item }: { item: OpsPurchaseAlert }) {
  return (
    <article className="admin-ops-list-item">
      <div className="admin-ops-list-top">
        <div>
          <h3>{item.tailgateName}</h3>
          <p>{item.purchaserLabel}</p>
        </div>
        <span className={`chip ${statusChipClass(item.status)}`}>{formatStatusLabel(item.status)}</span>
      </div>
      <p className="admin-ops-list-note">{item.reason}</p>
      <div className="admin-ops-list-meta">
        <span>{formatCurrencyFromCents(item.amountCents)}</span>
        <span>{formatRelativeDate(item.updatedAt ?? item.createdAt)}</span>
      </div>
      {item.tailgateId ? (
        <Link className="admin-ops-inline-link" to={`/tailgates/${item.tailgateId}`}>
          Open tailgate
        </Link>
      ) : null}
    </article>
  );
}

function PurchaseRow({ item }: { item: OpsPurchaseSummary }) {
  return (
    <article className="admin-ops-list-item compact">
      <div className="admin-ops-list-top">
        <div>
          <h3>{item.tailgateName}</h3>
          <p>{item.purchaserLabel}</p>
        </div>
        <strong>{formatCurrencyFromCents(item.amountCents)}</strong>
      </div>
      <div className="admin-ops-list-meta">
        <span className={`chip ${statusChipClass(item.status)}`}>{formatStatusLabel(item.status)}</span>
        <span>{item.createdAt ? formatDateTime(item.createdAt) : "No purchase date"}</span>
      </div>
      {item.tailgateId ? (
        <Link className="admin-ops-inline-link" to={`/tailgates/${item.tailgateId}`}>
          View purchase context
        </Link>
      ) : null}
    </article>
  );
}

function PayoutAlertRow({ item }: { item: OpsPayoutAlert }) {
  return (
    <article className="admin-ops-list-item">
      <div className="admin-ops-list-top">
        <div>
          <h3>{item.tailgateName}</h3>
          <p>{item.hostLabel}</p>
        </div>
        <span className="chip chip-cancelled">{formatStatusLabel(item.connectStatus)}</span>
      </div>
      <p className="admin-ops-list-note">{item.reason}</p>
      <div className="admin-ops-list-meta">
        <span>{formatDateTime(item.startDateTime)}</span>
        <span>{formatCurrencyFromCents(item.ticketPriceCents)} per ticket</span>
      </div>
      <Link className="admin-ops-inline-link" to={`/tailgates/${item.tailgateId}`}>
        Open paid tailgate
      </Link>
    </article>
  );
}

function CancellationRow({ item }: { item: OpsTailgateCancellation }) {
  return (
    <article className="admin-ops-list-item compact">
      <div className="admin-ops-list-top">
        <div>
          <h3>{item.tailgateName}</h3>
          <p>{item.hostLabel}</p>
        </div>
        <span className="chip chip-cancelled">{item.visibilityType.replace(/_/g, " ")}</span>
      </div>
      <div className="admin-ops-list-meta">
        <span>{item.cancelledAt ? formatDateTime(item.cancelledAt) : "No cancellation time"}</span>
        <span>{formatRelativeDate(item.cancelledAt)}</span>
      </div>
      <Link className="admin-ops-inline-link" to={`/tailgates/${item.tailgateId}`}>
        Review tailgate
      </Link>
    </article>
  );
}

export default function AdminOps() {
  const { user } = useAuth();
  const firstName = getFirstName(user?.displayName ?? user?.email ?? "Admin");
  const { metrics, checkoutAlerts, payoutAlerts, recentCancellations, recentPurchases, loading, error } =
    useAdminOpsDashboard();

  return (
    <AppShell header={<TopBar firstName={firstName} />}>
      <section className="admin-console-stack">
        <article className="tailgate-card admin-console-card admin-ops-hero">
          <div className="section-header">
            <div>
              <h2>Ops Dashboard</h2>
              <p className="section-subtitle">
                Live website-side monitoring for purchases, paid events, payout readiness, and cancellations.
              </p>
            </div>
            <AdminConsoleNav />
          </div>
          <div className="admin-console-note">
            This page reads directly from your shared Firebase data so you can monitor production activity
            without waiting on native app instrumentation.
          </div>
          {loading ? <p className="meta-muted">Loading live operations data...</p> : null}
          {error ? <p className="error-banner">{error}</p> : null}
          <div className="admin-ops-metric-grid">
            {metrics.map((metric) => (
              <section className={`admin-ops-metric-card ${metricToneClass(metric.tone)}`} key={metric.label}>
                <p>{metric.label}</p>
                <strong>{metric.value}</strong>
                <span>{metric.helper}</span>
              </section>
            ))}
          </div>
        </article>

        <div className="admin-ops-grid">
          <article className="tailgate-card admin-console-card">
            <div className="section-header">
              <div>
                <h2>Checkout Alerts</h2>
                <p className="section-subtitle">
                  Failed, refunded, canceled, or stalled purchases from the last day.
                </p>
              </div>
            </div>
            {checkoutAlerts.length === 0 ? (
              <p className="meta-muted">No checkout alerts right now.</p>
            ) : (
              <div className="admin-ops-list">
                {checkoutAlerts.map((item) => (
                  <CheckoutAlertRow item={item} key={item.id} />
                ))}
              </div>
            )}
          </article>

          <article className="tailgate-card admin-console-card">
            <div className="section-header">
              <div>
                <h2>Payout Blockers</h2>
                <p className="section-subtitle">
                  Upcoming paid events where the host still cannot receive payouts cleanly.
                </p>
              </div>
            </div>
            {payoutAlerts.length === 0 ? (
              <p className="meta-muted">No upcoming payout blockers detected.</p>
            ) : (
              <div className="admin-ops-list">
                {payoutAlerts.map((item) => (
                  <PayoutAlertRow item={item} key={item.tailgateId} />
                ))}
              </div>
            )}
          </article>

          <article className="tailgate-card admin-console-card">
            <div className="section-header">
              <div>
                <h2>Recent Purchases</h2>
                <p className="section-subtitle">
                  Latest confirmed purchases hitting the shared production data.
                </p>
              </div>
            </div>
            {recentPurchases.length === 0 ? (
              <p className="meta-muted">No confirmed purchases yet.</p>
            ) : (
              <div className="admin-ops-list">
                {recentPurchases.map((item) => (
                  <PurchaseRow item={item} key={item.id} />
                ))}
              </div>
            )}
          </article>

          <article className="tailgate-card admin-console-card">
            <div className="section-header">
              <div>
                <h2>Recent Cancellations</h2>
                <p className="section-subtitle">
                  Events canceled in the last seven days so support can stay ahead of fallout.
                </p>
              </div>
            </div>
            {recentCancellations.length === 0 ? (
              <p className="meta-muted">No recent cancellations.</p>
            ) : (
              <div className="admin-ops-list">
                {recentCancellations.map((item) => (
                  <CancellationRow item={item} key={item.tailgateId} />
                ))}
              </div>
            )}
          </article>
        </div>
      </section>
    </AppShell>
  );
}

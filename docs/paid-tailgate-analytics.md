# Paid tailgate conversion analytics

The admin-only **Ticket Analytics** screen combines two data sources:

- Firebase Analytics events for impressions, event views, ticket selection, checkout starts, and confirmed purchase-funnel behavior.
- `ticketPurchases` records for completed orders, ticket counts, gross revenue, and recorded platform fees.

The browser sends Firebase Analytics events on a best-effort basis. A callable Function also stores a small, sanitized event record in `paidTailgateAnalyticsEvents` so the server can build the dashboard without exposing Firebase Analytics or purchase collections to the client. Analytics failures are caught and never block event browsing or checkout.

`getPaidTailgateAnalyticsDashboard` checks the existing `users/{uid}.admin` flag before reading or returning any report. It joins open paid tailgates, behavioral events, and successful purchase records in one server-side pass. Refunded, failed, expired, and canceled payments do not contribute to sales or revenue.

Behavioral history begins when this instrumentation is deployed; it is not backfilled. Existing successful purchase records remain available for historical order and revenue totals. A missing behavioral denominator is displayed as an em dash instead of a misleading zero-percent conversion rate.

Source attribution preserves `utm_source`, `utm_medium`, and `utm_campaign` for the browser session and classifies internal discovery, search, map, host-page, and direct-link traffic. Checkout receives the same attribution payload so the purchase backend can retain it when supported.

Diagnostic thresholds live in `AdminTicketAnalytics.tsx` under `DIAGNOSTIC_THRESHOLDS`, making the low-traffic, high-traffic/no-sales, and checkout-abandonment indicators easy to tune.

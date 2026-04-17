import { useNavigate } from "react-router-dom";
import { TailgateEvent } from "../types";
import { formatCurrencyFromCents, formatDateTimeRange } from "../utils/format";
import {
  buildTailgatePricingSummary,
  estimateHostPayout,
  formatTicketPricingLabel,
  getEventStatus,
  getVisibilityLabel
} from "../utils/tailgate";
import { IconCalendar, IconExternal, IconLocation } from "./Icons";

export default function TailgateCard({
  event,
  isHost,
  hostLabel = "Hosting"
}: {
  event: TailgateEvent;
  isHost?: boolean;
  hostLabel?: string;
}) {
  const navigate = useNavigate();
  const status = getEventStatus(event);
  const visibilityLabel = getVisibilityLabel(event.visibilityType);
  const pricingSummary = buildTailgatePricingSummary(event);
  const payout = estimateHostPayout({
    ticketsSold: event.ticketsSold,
    ticketPriceCents: event.ticketPriceCents,
    grossRevenueCents: event.grossRevenueCents,
    purchaseCount: event.purchaseCount,
    platformFeeCents: event.platformFeeRevenueCents
  });
  const ticketPricingLabel =
    formatTicketPricingLabel(pricingSummary, pricingSummary?.hasVariablePricing ? "range" : "single") ??
    "Ticket pricing unavailable";
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);

  const showEdit = isHost === true && (status === "upcoming" || status === "live");
  const showCheckIn =
    isHost === true && event.visibilityType === "open_paid" && status !== "cancelled";
  const showHostMetrics = isHost === true;
  const isPaid = event.visibilityType === "open_paid";
  const showPaidOutChip = isHost === true && isPaid && event.payoutStatus === "sent";

  return (
    <article
      className={`tailgate-card${status === "cancelled" ? " is-cancelled" : ""}`}
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/tailgates/${event.id}`)}
      onKeyDown={(eventKey) => {
        if (eventKey.key === "Enter") {
          navigate(`/tailgates/${event.id}`);
        }
      }}
    >
      <div className="tailgate-card-header">
        <div>
          <h3>{event.name}</h3>
          <div className="chip-row">
            {isHost === true ? <span className="chip chip-live">{hostLabel}</span> : null}
            {showPaidOutChip ? <span className="chip chip-payout">Paid out</span> : null}
            <span className="chip chip-outline">{visibilityLabel}</span>
            <span className={`chip chip-status chip-${status}`}>{statusLabel}</span>
          </div>
        </div>
        <div className="card-actions">
          {showEdit && (
            <button
              className="outline-button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/tailgates/${event.id}/edit`);
              }}
            >
              Edit
            </button>
          )}
          <button
            className="icon-button icon-button-soft"
            aria-label="Open in app"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/tailgates/${event.id}`);
            }}
          >
            <IconExternal />
          </button>
        </div>
      </div>

      <div className={`tailgate-card-body${showHostMetrics ? "" : " tailgate-card-body-single"}`}>
        <div className="card-left">
          <div className="meta-row">
            <IconCalendar />
            <span>{formatDateTimeRange(event.startDateTime, event.endDateTime)}</span>
          </div>
          <div className="meta-row">
            <IconLocation />
            <span>{event.locationSummary ?? "Location TBD"}</span>
          </div>
          <p className="meta-muted">
            {event.visibilityType === "private" ? "Invite-only" : "Publicly discoverable"}
          </p>
        </div>

        {showHostMetrics ? (
          <div className="card-right">
            {isPaid ? (
              <div className="info-block">
                <p className="info-label">Tickets</p>
                <p className="info-value">
                  {event.ticketsSold ?? 0} / {event.capacity ?? "--"} sold
                </p>
                <p className="info-meta">{ticketPricingLabel}</p>
                <p className="info-highlight">
                  {event.payoutStatus === "sent"
                    ? "Payout sent"
                    : `${formatCurrencyFromCents(payout.payout)} host payout (est.)`}
                </p>
              </div>
            ) : (
              <div className="info-block">
                <p className="info-label">RSVPs</p>
                <p className="info-value">
                  {event.rsvpsConfirmed ?? 0} confirmed / {event.rsvpsPending ?? 0} pending
                </p>
                <p className="info-meta">
                  {event.capacity ? `${event.capacity} max guests` : "No capacity limit"}
                </p>
                <p className="info-highlight">Guests feel the hype.</p>
              </div>
            )}
          </div>
        ) : null}
      </div>

      <div className="tailgate-card-footer">
        <button
          className="link-button card-link-button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/tailgates/${event.id}`);
          }}
        >
          View details
        </button>
        {showCheckIn ? (
          <button
            className="link-button card-link-button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/tailgates/${event.id}/checkin`);
            }}
          >
            Open check-in
          </button>
        ) : null}
        <button
          className="link-button card-link-button"
          onClick={(e) => {
            e.stopPropagation();
            const shareUrl = `${window.location.origin}/#/tailgates/${event.id}`;
            navigator.clipboard?.writeText(shareUrl);
          }}
        >
          Copy share link
        </button>
      </div>
    </article>
  );
}

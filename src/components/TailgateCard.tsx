import React from "react";
import { useNavigate } from "react-router-dom";
import { TailgateEvent } from "../types";
import { formatCurrencyFromCents, formatDateTime } from "../utils/format";
import { estimateHostPayout, getEventStatus, getVisibilityLabel } from "../utils/tailgate";
import { IconCalendar, IconExternal, IconLocation } from "./Icons";

export default function TailgateCard({ event }: { event: TailgateEvent }) {
  const navigate = useNavigate();
  const status = getEventStatus(event);
  const visibilityLabel = getVisibilityLabel(event.visibilityType);
  const payout = estimateHostPayout({
    ticketsSold: event.ticketsSold,
    ticketPriceCents: event.ticketPriceCents
  });
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);

  const showEdit = status === "upcoming" || status === "live";
  const isPaid = event.visibilityType === "open_paid";

  return (
    <article
      className="tailgate-card"
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
            className="icon-button"
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

      <div className="tailgate-card-body">
        <div className="card-left">
          <div className="meta-row">
            <IconCalendar />
            <span>{formatDateTime(event.startDateTime)}</span>
          </div>
          <div className="meta-row">
            <IconLocation />
            <span>{event.locationSummary ?? "Location TBD"}</span>
          </div>
          <p className="meta-muted">
            {event.visibilityType === "private" ? "Invite-only" : "Publicly discoverable"}
          </p>
        </div>

        <div className="card-right">
          {isPaid ? (
            <div className="info-block">
              <p className="info-label">Tickets</p>
              <p className="info-value">
                {event.ticketsSold ?? 0} / {event.capacity ?? "--"} sold
              </p>
              <p className="info-meta">{formatCurrencyFromCents(event.ticketPriceCents)} per person</p>
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
      </div>

      <div className="tailgate-card-footer">
        <button
          className="link-button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/tailgates/${event.id}`);
          }}
        >
          View details
        </button>
        <button
          className="link-button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/tailgates/${event.id}/checkin`);
          }}
        >
          Open check-in
        </button>
        <button
          className="link-button"
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

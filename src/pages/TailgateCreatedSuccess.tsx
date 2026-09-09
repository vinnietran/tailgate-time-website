import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import TopBar from "../components/TopBar";
import { useAuth } from "../hooks/useAuth";
import { usePromotionEvent } from "../hooks/usePromotionEvent";
import { formatDateTimeRange, getFirstName } from "../utils/format";
import {
  buildPromotionUrl,
  buildShareText,
  isPromotionEligible,
  type PromotionEvent
} from "../features/promotion/promotion";
import tailgateTimeLogo from "../../ttnobg.png";

type SuccessRouteState = { event?: PromotionEvent } | null;

export default function TailgateCreatedSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const fallback = (location.state as SuccessRouteState)?.event ?? null;
  const { user, isAdmin, adminLoading } = useAuth();
  const { event, loading, error } = usePromotionEvent(id, fallback);
  const firstName = getFirstName(user?.displayName ?? user?.email);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [coverFailed, setCoverFailed] = useState(false);
  const canManage = Boolean(
    event && user && (isAdmin || event.hostId === user.uid || event.coHostIds.includes(user.uid))
  );
  const eligible = event ? isPromotionEligible(event.visibilityType) : false;
  const paid = event?.visibilityType === "open_paid";
  const shareTailgate = async () => {
    if (!event) return;
    const url = buildPromotionUrl(event.id, "host_native_share");
    try {
      if (navigator.share) {
        await navigator.share({ title: event.name, text: buildShareText(event), url });
        setShareFeedback("Share sheet opened.");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setShareFeedback("Event link copied.");
      } else {
        setShareFeedback("Open promotion tools to copy the event link.");
      }
    } catch (shareError) {
      if ((shareError as DOMException)?.name !== "AbortError") {
        setShareFeedback("We couldn't open sharing. Your event is still live.");
      }
    }
  };

  return (
    <AppShell header={<TopBar firstName={firstName} />} showHeaderActions={false}>
      <main className="creation-success-page page-shell">
        {loading || adminLoading ? (
          <section className="creation-success-card" aria-busy="true"><p>Preparing your tailgate…</p></section>
        ) : error || !event ? (
          <section className="creation-success-card"><h1>Tailgate created</h1><p>{error ?? "We couldn't load the event summary."}</p><Link className="primary-button" to="/dashboard">Done</Link></section>
        ) : !canManage ? (
          <section className="creation-success-card"><h1>Tailgate created</h1><p>Your event is live, but this account cannot open its host controls.</p><Link className="primary-button" to={`/tailgates/${event.id}`}>View Tailgate</Link></section>
        ) : (
          <section className="creation-success-card">
            <div className="creation-success-icon" aria-hidden="true">✓</div>
            <p className="creation-success-kicker">Published successfully</p>
            <h1>Tailgate Successfully Created</h1>
            <p className="creation-success-lead">
              {paid
                ? "Your event is live. Share your ticket link with your audience to start driving ticket sales."
                : eligible
                ? "Your tailgate is live. Share it so fans can find the details and join you."
                : "Your invite-only tailgate is ready. You can start managing guests and event details."}
            </p>

            <article className="creation-success-event">
              {event.coverImageUrl && !coverFailed ? (
                <img
                  src={event.coverImageUrl}
                  alt={`${event.name} cover`}
                  onError={() => setCoverFailed(true)}
                />
              ) : (
                <div className="creation-success-cover-fallback">
                  <img
                    className="creation-success-logo"
                    src={tailgateTimeLogo}
                    alt="TailgateTime logo"
                  />
                </div>
              )}
              <div>
                <span className="creation-success-type">{paid ? "Open Paid" : eligible ? "Open Free" : "Invite Only"}</span>
                <h2>{event.name}</h2>
                <p>{formatDateTimeRange(event.startDateTime, event.endDateTime)}</p>
                <p>{event.locationSummary}</p>
              </div>
            </article>

            <div className="creation-success-actions">
              {eligible ? (
                <Link className="primary-button" to={`/tailgates/${event.id}/promote`} state={{ event }}>
                  {paid ? "Share Ticket Link & QR" : "Share Tailgate"}
                </Link>
              ) : null}
              {eligible ? <button type="button" className="secondary-button" onClick={() => void shareTailgate()}>Share Tailgate</button> : null}
              <Link className={eligible ? "secondary-button" : "primary-button"} to={`/tailgates/${event.id}`}>View Tailgate</Link>
              <Link className="outline-button" to="/dashboard">Done</Link>
            </div>
            {shareFeedback ? <p className="promotion-feedback success" role="status">{shareFeedback}</p> : null}
            {eligible ? <p className="creation-success-note">Sharing is optional—you can return to these tools from event management at any time.</p> : null}
          </section>
        )}
      </main>
    </AppShell>
  );
}

import { Link, useLocation, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import TopBar from "../components/TopBar";
import HostPromotionToolkit from "../components/HostPromotionToolkit";
import { useAuth } from "../hooks/useAuth";
import { usePromotionEvent } from "../hooks/usePromotionEvent";
import { getFirstName } from "../utils/format";
import { isPromotionEligible, type PromotionEvent } from "../features/promotion/promotion";

type PromotionRouteState = { event?: PromotionEvent } | null;

export default function HostPromotionPage() {
  const { id } = useParams();
  const location = useLocation();
  const fallback = (location.state as PromotionRouteState)?.event ?? null;
  const { user, isAdmin, adminLoading } = useAuth();
  const { event, loading, error } = usePromotionEvent(id, fallback);
  const firstName = getFirstName(user?.displayName ?? user?.email);
  const canManage = Boolean(
    event && user && (isAdmin || event.hostId === user.uid || event.coHostIds.includes(user.uid))
  );

  return (
    <AppShell header={<TopBar firstName={firstName} />} showHeaderActions={false}>
      <main className="promotion-page page-shell">
        {loading || adminLoading ? (
          <section className="promotion-state-card" aria-busy="true">
            <p>Loading promotion tools…</p>
          </section>
        ) : error || !event ? (
          <section className="promotion-state-card">
            <h1>Promotion tools unavailable</h1>
            <p>{error ?? "This tailgate could not be found."}</p>
            <Link className="secondary-button" to="/dashboard">Back to dashboard</Link>
          </section>
        ) : !canManage ? (
          <section className="promotion-state-card">
            <h1>You don’t have access to these tools</h1>
            <p>Only the host, an authorized co-host, or an administrator can promote this event.</p>
            <Link className="secondary-button" to={`/tailgates/${event.id}`}>View tailgate</Link>
          </section>
        ) : !isPromotionEligible(event.visibilityType) ? (
          <section className="promotion-state-card">
            <h1>This tailgate is invite-only</h1>
            <p>Public promotion tools are available only for open free and open paid events.</p>
            <Link className="secondary-button" to={`/tailgates/${event.id}`}>Manage tailgate</Link>
          </section>
        ) : (
          <>
            <nav className="promotion-breadcrumb" aria-label="Breadcrumb">
              <Link to={`/tailgates/${event.id}`}>Manage tailgate</Link><span aria-hidden="true">/</span><span>Share</span>
            </nav>
            <HostPromotionToolkit event={event} />
          </>
        )}
      </main>
    </AppShell>
  );
}

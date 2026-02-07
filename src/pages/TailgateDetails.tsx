import React, { useEffect, useMemo, useRef, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import { useAuth } from "../hooks/useAuth";
import { db } from "../lib/firebase";
import { mockTailgates } from "../data/mockTailgates";
import { TailgateEvent, TailgateStatus, VisibilityType } from "../types";
import { estimateHostPayout, getVisibilityLabel } from "../utils/tailgate";
import { formatCurrencyFromCents, formatDateTime } from "../utils/format";

type AttendeeFilterKey = "All" | "Going" | "Pending" | "Not Going";
type AttendeeStatus = "Host" | "Attending" | "Pending" | "Not Attending";
type ExpectationKey =
  | "foodProvided"
  | "alcoholProvided"
  | "byobWelcome"
  | "familyFriendly"
  | "musicLoud"
  | "grillAvailable"
  | "restroomNearby";

type AttendeeRecord = {
  id: string;
  userId?: string;
  name: string;
  status: AttendeeStatus;
  phone?: string;
  email?: string;
};

type LocationPin = {
  lat?: number;
  lng?: number;
};

type TailgateDetail = {
  id: string;
  eventName: string;
  description?: string;
  hostId: string;
  hostName: string;
  coHostIds: string[];
  startDateTime: Date | null;
  locationRaw: unknown;
  locationSummary?: string;
  locationCoords?: { lat: number; lng: number } | null;
  attendees: AttendeeRecord[];
  visibilityType: VisibilityType;
  capacity?: number;
  ticketPriceCents?: number;
  currency: string;
  ticketsSold?: number;
  checkedInCount?: number;
  status?: string;
  cancelledAt?: Date | null;
  expectations?: Partial<Record<ExpectationKey, boolean>>;
};

const expectationChipMap: Record<ExpectationKey, string> = {
  foodProvided: "Food",
  alcoholProvided: "Alcohol",
  byobWelcome: "BYOB",
  familyFriendly: "Family-friendly",
  musicLoud: "Loud music",
  grillAvailable: "Grill",
  restroomNearby: "Restroom nearby"
};

const attendeeStatusMeta: Record<AttendeeStatus, { label: string; className: string }> = {
  Host: { label: "Host", className: "event-attendee-host" },
  Attending: { label: "Going", className: "event-attendee-going" },
  Pending: { label: "Pending", className: "event-attendee-pending" },
  "Not Attending": { label: "Not Going", className: "event-attendee-not-going" }
};

const normalizedStatusMap: Record<string, AttendeeStatus> = {
  attending: "Attending",
  going: "Attending",
  host: "Host",
  hosted: "Host",
  pending: "Pending",
  invited: "Pending",
  undecided: "Pending",
  "not attending": "Not Attending",
  "not going": "Not Attending",
  declined: "Not Attending"
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function firstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function coerceNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function normalizeDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const maybeTimestamp = value as { toDate?: () => Date; seconds?: number };
  if (typeof maybeTimestamp.toDate === "function") {
    try {
      const parsed = maybeTimestamp.toDate();
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    } catch {
      return null;
    }
  }

  if (typeof maybeTimestamp.seconds === "number") {
    const parsed = new Date(maybeTimestamp.seconds * 1000);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

function resolveVisibilityType(raw: unknown): VisibilityType {
  if (raw === "private" || raw === "open_free" || raw === "open_paid") {
    return raw;
  }
  return "private";
}

function normalizeStatus(value: unknown): AttendeeStatus {
  const label = firstString(value) ?? "";
  const normalized = normalizedStatusMap[label.toLowerCase()];
  return normalized ?? "Pending";
}

function normalizeAttendees(
  rawAttendees: unknown,
  hostId: string,
  hostName: string
): AttendeeRecord[] {
  const attendeesRaw = Array.isArray(rawAttendees) ? rawAttendees : [];
  const seen = new Set<string>();
  const attendees: AttendeeRecord[] = attendeesRaw
    .map((entry, index) => {
      const record = asRecord(entry);
      if (!record) return null;

      const userId = firstString(record.userId, record.uid, record.id);
      const name = firstString(
        record.displayName,
        record.name,
        record.contact,
        record.email
      ) ?? `Guest ${index + 1}`;

      let status = normalizeStatus(record.status);
      if (userId && userId === hostId) {
        status = "Host";
      }

      const id = userId ?? firstString(record.id) ?? `guest-${index}-${name}`;
      if (seen.has(id)) return null;
      seen.add(id);

      return {
        id,
        userId,
        name,
        status,
        phone: firstString(record.phone),
        email: firstString(record.email)
      };
    })
    .filter((attendee): attendee is AttendeeRecord => Boolean(attendee));

  const hostExists = attendees.some((attendee) => attendee.userId === hostId);
  if (!hostExists && hostId) {
    attendees.unshift({
      id: `host-${hostId}`,
      userId: hostId,
      name: hostName || "Host",
      status: "Host"
    });
  }

  return attendees;
}

function resolveLocationString(location: unknown): string | undefined {
  if (!location) return undefined;
  if (typeof location === "string") {
    const trimmed = location.trim();
    return trimmed || undefined;
  }

  const record = asRecord(location);
  if (!record) return undefined;

  return firstString(
    record.formatted,
    record.formattedAddress,
    record.description,
    record.address,
    record.text,
    record.name,
    record.shortAddress
  );
}

function resolveLocationCoords(
  locationRaw: unknown,
  locationCoordsRaw: unknown
): { lat: number; lng: number } | null {
  const locationRecord = asRecord(locationRaw);
  const locationCoordsRecord = asRecord(locationCoordsRaw);

  const pin = asRecord(locationRecord?.pin) as LocationPin | null;
  const lat =
    coerceNumber(pin?.lat) ??
    coerceNumber(locationRecord?.lat) ??
    coerceNumber(locationCoordsRecord?.lat);
  const lng =
    coerceNumber(pin?.lng) ??
    coerceNumber(locationRecord?.lng) ??
    coerceNumber(locationCoordsRecord?.lng);

  if (typeof lat === "number" && typeof lng === "number") {
    return { lat, lng };
  }

  const locationString = resolveLocationString(locationRaw);
  if (locationString) {
    const matches = locationString.match(
      /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/
    );
    if (matches) {
      return { lat: Number(matches[1]), lng: Number(matches[2]) };
    }
  }

  return null;
}

function buildMapEmbedUrl(coords: { lat: number; lng: number }) {
  const delta = 0.008;
  const left = coords.lng - delta;
  const right = coords.lng + delta;
  const top = coords.lat + delta;
  const bottom = coords.lat - delta;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`;
}

function toDetailFromFirestore(id: string, data: Record<string, unknown>): TailgateDetail {
  const hostId = firstString(data.hostId, data.hostUserId, data.ownerId) ?? "";
  const hostName = firstString(data.hostName, data.displayName) ?? "Host";
  const startDateTime =
    normalizeDate(data.dateTime) ??
    normalizeDate(data.startDateTime) ??
    normalizeDate(data.startAt) ??
    normalizeDate(data.createdAt);
  const visibilityType = resolveVisibilityType(data.visibilityType);
  const priceCents = coerceNumber(data.priceCents) ?? coerceNumber(data.ticketPriceCents);
  const ticketsSold =
    coerceNumber(data.confirmedPaidCount) ??
    coerceNumber(data.ticketsSold) ??
    coerceNumber(data.rsvpsConfirmed) ??
    0;

  return {
    id,
    eventName: firstString(data.eventName, data.name, data.title) ?? "Untitled Tailgate",
    description: firstString(data.description),
    hostId,
    hostName,
    coHostIds: Array.isArray(data.coHostIds)
      ? data.coHostIds.filter((value): value is string => typeof value === "string")
      : [],
    startDateTime,
    locationRaw: data.location,
    locationSummary:
      resolveLocationString(data.location) ??
      firstString(data.locationSummary, data.venueName),
    locationCoords: resolveLocationCoords(data.location, data.locationCoords),
    attendees: normalizeAttendees(data.attendees, hostId, hostName),
    visibilityType,
    capacity: coerceNumber(data.capacity),
    ticketPriceCents: priceCents,
    currency: firstString(data.currency) ?? "USD",
    ticketsSold,
    checkedInCount: coerceNumber(data.checkedInCount),
    status: firstString(data.status, data.eventStatus),
    cancelledAt: normalizeDate(data.cancelledAt),
    expectations: asRecord(data.expectations) as TailgateDetail["expectations"]
  };
}

function toDetailFromMock(event: TailgateEvent): TailgateDetail {
  const attendees: AttendeeRecord[] = [];
  attendees.push({
    id: `host-${event.hostUserId}`,
    userId: event.hostUserId,
    name: "Host",
    status: "Host"
  });
  for (let index = 0; index < (event.rsvpsConfirmed ?? 0); index += 1) {
    attendees.push({
      id: `going-${index}`,
      name: `Attendee ${index + 1}`,
      status: "Attending"
    });
  }
  for (let index = 0; index < (event.rsvpsPending ?? 0); index += 1) {
    attendees.push({
      id: `pending-${index}`,
      name: `Pending Guest ${index + 1}`,
      status: "Pending"
    });
  }

  return {
    id: event.id,
    eventName: event.name,
    hostId: event.hostUserId,
    hostName: "Host",
    coHostIds: [],
    startDateTime: event.startDateTime,
    locationRaw: event.locationSummary,
    locationSummary: event.locationSummary,
    locationCoords: null,
    attendees,
    visibilityType: event.visibilityType,
    capacity: event.capacity,
    ticketPriceCents: event.ticketPriceCents,
    currency: "USD",
    ticketsSold: event.ticketsSold ?? event.rsvpsConfirmed ?? 0,
    checkedInCount: undefined,
    status: event.status,
    cancelledAt: null,
    expectations: {}
  };
}

function resolveStatus(detail: TailgateDetail, now = new Date()): TailgateStatus {
  const raw = (detail.status ?? "").toLowerCase();
  if (raw === "cancelled") return "cancelled";
  if (raw === "live") return "live";
  if (detail.startDateTime && detail.startDateTime.getTime() < now.getTime()) return "past";
  return "upcoming";
}

export default function TailgateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const attendeeSectionRef = useRef<HTMLElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<TailgateDetail | null>(null);
  const [attendeeFilter, setAttendeeFilter] = useState<AttendeeFilterKey>("All");
  const [pinning, setPinning] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("Missing tailgate id.");
      setLoading(false);
      return;
    }

    if (!db) {
      const mock = mockTailgates.find((event) => event.id === id);
      if (!mock) {
        setError("Tailgate not found.");
      } else {
        setDetail(toDetailFromMock(mock));
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const eventRef = doc(db, "tailgateEvents", id);
    const unsubscribe = onSnapshot(
      eventRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setDetail(null);
          setError("Tailgate not found.");
          setLoading(false);
          return;
        }
        setDetail(toDetailFromFirestore(snapshot.id, snapshot.data() as Record<string, unknown>));
        setLoading(false);
      },
      (snapshotError) => {
        console.error("Failed to load tailgate details", snapshotError);
        setError(snapshotError instanceof Error ? snapshotError.message : "Failed to load details.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [id]);

  const status = useMemo(() => (detail ? resolveStatus(detail) : null), [detail]);
  const isHostUser = useMemo(() => {
    if (!detail || !user?.uid) return false;
    return detail.hostId === user.uid || detail.coHostIds.includes(user.uid);
  }, [detail, user?.uid]);

  const locationLabel = detail?.locationSummary ?? "Location not set";
  const locationCoords = detail?.locationCoords ?? null;
  const mapUrl = locationCoords ? buildMapEmbedUrl(locationCoords) : null;

  const attendeeCounts = useMemo(() => {
    if (!detail) {
      return { all: 0, going: 0, pending: 0, notGoing: 0, nonHost: 0 };
    }
    const all = detail.attendees;
    const nonHost = all.filter((attendee) => attendee.status !== "Host");
    return {
      all: all.length,
      nonHost: nonHost.length,
      going: nonHost.filter((attendee) => attendee.status === "Attending").length,
      pending: nonHost.filter((attendee) => attendee.status === "Pending").length,
      notGoing: nonHost.filter((attendee) => attendee.status === "Not Attending").length
    };
  }, [detail]);

  const filteredAttendees = useMemo(() => {
    if (!detail) return [];
    return detail.attendees.filter((attendee) => {
      if (attendeeFilter === "All") return true;
      if (attendeeFilter === "Going") return attendee.status === "Attending";
      if (attendeeFilter === "Pending") return attendee.status === "Pending";
      if (attendeeFilter === "Not Going") return attendee.status === "Not Attending";
      return true;
    });
  }, [attendeeFilter, detail]);

  const expectationChips = useMemo(() => {
    if (!detail?.expectations) return [];
    return (Object.keys(expectationChipMap) as ExpectationKey[])
      .filter((key) => detail.expectations?.[key])
      .map((key) => expectationChipMap[key]);
  }, [detail?.expectations]);

  const ticketPriceCents = detail?.ticketPriceCents ?? 0;
  const ticketsSold = detail?.ticketsSold ?? attendeeCounts.going;
  const payout = estimateHostPayout({
    ticketsSold,
    ticketPriceCents
  });

  const openMaps = () => {
    if (!detail) return;
    const query = locationCoords
      ? `${locationCoords.lat},${locationCoords.lng}`
      : locationLabel;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const dropLocationPin = () => {
    if (!detail || !id || !db) return;
    if (!navigator.geolocation) {
      window.alert("Geolocation is not supported in this browser.");
      return;
    }

    setPinning(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const baseLocationRecord = asRecord(detail.locationRaw) ?? {};
        const nextLocation = {
          ...baseLocationRecord,
          pin: {
            lat,
            lng,
            timestamp: new Date().toISOString()
          }
        };

        try {
          await updateDoc(doc(db, "tailgateEvents", id), {
            location: nextLocation,
            locationCoords: { lat, lng }
          });
        } catch (updateError) {
          console.error("Failed to pin location", updateError);
          window.alert("Unable to save location pin. Try again.");
        } finally {
          setPinning(false);
        }
      },
      (geoError) => {
        console.error("Failed to get current location", geoError);
        window.alert("Unable to access your location.");
        setPinning(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const cancelTailgate = async () => {
    if (!detail || !id || !db) return;
    const ok = window.confirm(
      "Cancel this tailgate? Guests will see that this event is cancelled."
    );
    if (!ok) return;

    try {
      await updateDoc(doc(db, "tailgateEvents", id), {
        status: "cancelled",
        cancelledAt: new Date()
      });
    } catch (cancelError) {
      console.error("Failed to cancel tailgate", cancelError);
      window.alert("Unable to cancel tailgate right now.");
    }
  };

  const scrollToAttendees = () => {
    attendeeSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AppShell header={<div className="simple-header"><h1>Tailgate Details</h1></div>}>
      {loading ? (
        <section className="tailgate-details-stack">
          <div className="tailgate-card skeleton" />
          <div className="tailgate-card skeleton" />
        </section>
      ) : error ? (
        <section className="error-banner">{error}</section>
      ) : !detail ? (
        <section className="empty-state">
          <p>Tailgate {id} was not found.</p>
        </section>
      ) : (
        <section className="tailgate-details-stack">
          <article className="tailgate-details-hero">
            <div className="tailgate-details-hero-top">
              <div>
                <p className="tailgate-details-eyebrow">
                  {isHostUser ? "You're hosting" : "Tailgate details"}
                </p>
                <h2>{detail.eventName}</h2>
                <p className="tailgate-details-subtitle">
                  {detail.startDateTime ? formatDateTime(detail.startDateTime) : "Date TBD"}
                </p>
              </div>
              <div className="tailgate-details-status-wrap">
                <span className="chip chip-outline">{getVisibilityLabel(detail.visibilityType)}</span>
                {status ? <span className={`chip chip-status chip-${status}`}>{status}</span> : null}
              </div>
            </div>
            <p className="tailgate-details-meta">
              <strong>Location:</strong> {locationLabel}
            </p>
            <div className="tailgate-details-hero-actions">
              <button className="primary-button" onClick={openMaps}>
                Open maps
              </button>
              <button
                className="secondary-button"
                onClick={() => {
                  const shareUrl = `${window.location.origin}/#/tailgates/${detail.id}`;
                  navigator.clipboard?.writeText(shareUrl);
                }}
              >
                Copy share link
              </button>
            </div>
            {detail.cancelledAt ? (
              <p className="tailgate-details-cancel-note">
                Cancelled on {detail.cancelledAt.toLocaleString()}
              </p>
            ) : null}
          </article>

          <article className="tailgate-details-card">
            <div className="section-header">
              <div>
                <h2>Host Snapshot</h2>
                <p className="section-subtitle">Live tailgate metrics and attendance.</p>
              </div>
            </div>
            <div className="tailgate-details-metric-grid">
              <div className="tailgate-details-metric-card">
                <p>Invited</p>
                <strong>{attendeeCounts.nonHost}</strong>
              </div>
              <div className="tailgate-details-metric-card">
                <p>Going</p>
                <strong>{attendeeCounts.going}</strong>
              </div>
              <div className="tailgate-details-metric-card">
                <p>Pending</p>
                <strong>{attendeeCounts.pending}</strong>
              </div>
              <div className="tailgate-details-metric-card">
                <p>Not Going</p>
                <strong>{attendeeCounts.notGoing}</strong>
              </div>
              {detail.visibilityType === "open_paid" ? (
                <>
                  <div className="tailgate-details-metric-card">
                    <p>Tickets Sold</p>
                    <strong>{ticketsSold}</strong>
                  </div>
                  <div className="tailgate-details-metric-card">
                    <p>Checked In</p>
                    <strong>{detail.checkedInCount ?? "--"}</strong>
                  </div>
                  <div className="tailgate-details-metric-card">
                    <p>Gross Revenue</p>
                    <strong>{formatCurrencyFromCents(payout.gross)}</strong>
                  </div>
                  <div className="tailgate-details-metric-card">
                    <p>Est. Payout</p>
                    <strong>{formatCurrencyFromCents(payout.payout)}</strong>
                  </div>
                </>
              ) : detail.capacity ? (
                <div className="tailgate-details-metric-card">
                  <p>Capacity</p>
                  <strong>{detail.capacity}</strong>
                </div>
              ) : null}
            </div>
          </article>

          {isHostUser ? (
            <article className="tailgate-details-card">
              <div className="section-header">
                <div>
                  <h2>Host Controls</h2>
                  <p className="section-subtitle">Manage your tailgate operations.</p>
                </div>
              </div>
              <div className="tailgate-details-control-list">
                <button
                  className="tailgate-details-control-row"
                  onClick={() => navigate(`/tailgates/${detail.id}/edit`)}
                >
                  <span>Edit event details</span>
                  <small>Update name, schedule, and location</small>
                </button>
                <button className="tailgate-details-control-row" onClick={scrollToAttendees}>
                  <span>{detail.visibilityType === "open_paid" ? "View tickets" : "View guest list"}</span>
                  <small>
                    {detail.visibilityType === "open_paid"
                      ? "See ticket holders and status"
                      : "Review invites and RSVPs"}
                  </small>
                </button>
                <button
                  className="tailgate-details-control-row"
                  onClick={() => navigate(`/tailgates/${detail.id}/checkin`)}
                >
                  <span>Open check-in</span>
                  <small>Run arrivals and verify guests</small>
                </button>
                <button className="tailgate-details-control-row" onClick={() => navigate("/messages")}>
                  <span>Message guests</span>
                  <small>Broadcast updates to attendees</small>
                </button>
                <button
                  className="tailgate-details-control-row"
                  onClick={dropLocationPin}
                  disabled={pinning}
                >
                  <span>{pinning ? "Dropping pin..." : "Drop location pin"}</span>
                  <small>Share exact meetup point from your current location</small>
                </button>
                {status !== "cancelled" ? (
                  <button className="tailgate-details-control-row danger" onClick={() => void cancelTailgate()}>
                    <span>Cancel tailgate</span>
                    <small>Notify all guests the event is cancelled</small>
                  </button>
                ) : null}
              </div>
            </article>
          ) : null}

          <article className="tailgate-details-card">
            <div className="section-header">
              <div>
                <h2>Event Snapshot</h2>
                <p className="section-subtitle">Essential details guests need.</p>
              </div>
            </div>
            <div className="tailgate-details-info-grid">
              <div className="tailgate-details-info-card">
                <p>When</p>
                <strong>{detail.startDateTime ? detail.startDateTime.toLocaleDateString() : "TBD"}</strong>
                <span>
                  {detail.startDateTime
                    ? detail.startDateTime.toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit"
                      })
                    : ""}
                </span>
              </div>
              <div className="tailgate-details-info-card">
                <p>Where</p>
                <strong>{locationLabel}</strong>
                <button className="link-button" onClick={openMaps}>Open in maps</button>
              </div>
              <div className="tailgate-details-info-card">
                <p>Type</p>
                <strong>{getVisibilityLabel(detail.visibilityType)}</strong>
                {detail.visibilityType === "open_paid" ? (
                  <span>{formatCurrencyFromCents(detail.ticketPriceCents)} per person</span>
                ) : (
                  <span>{detail.capacity ? `${detail.capacity} max guests` : "No capacity limit"}</span>
                )}
              </div>
            </div>
          </article>

          <article className="tailgate-details-card">
            <div className="section-header">
              <div>
                <h2>What To Expect</h2>
                <p className="section-subtitle">Host-set expectations for guests.</p>
              </div>
            </div>
            {expectationChips.length > 0 ? (
              <div className="tailgate-details-expectation-row">
                {expectationChips.map((chip) => (
                  <span key={chip} className="chip chip-outline">{chip}</span>
                ))}
              </div>
            ) : (
              <p className="meta-muted">Host has not added expectations yet.</p>
            )}
            {detail.description ? (
              <p className="tailgate-details-description">{detail.description}</p>
            ) : null}
          </article>

          <article className="tailgate-details-card">
            <div className="section-header">
              <div>
                <h2>Meet-up Spot</h2>
                <p className="section-subtitle">{locationLabel}</p>
              </div>
            </div>
            {mapUrl ? (
              <iframe className="tailgate-details-map" src={mapUrl} title="Tailgate map preview" />
            ) : (
              <div className="tailgate-details-map-placeholder">
                No coordinates yet. Host can drop an exact location pin from Host Controls.
              </div>
            )}
          </article>

          <article className="tailgate-details-card" ref={attendeeSectionRef}>
            <div className="section-header">
              <div>
                <h2>Who's Going</h2>
                <p className="section-subtitle">Filter by RSVP status.</p>
              </div>
            </div>
            <div className="tailgate-details-filter-row">
              {([
                { key: "All", label: `All (${attendeeCounts.nonHost})` },
                { key: "Going", label: `Going (${attendeeCounts.going})` },
                { key: "Pending", label: `Pending (${attendeeCounts.pending})` },
                { key: "Not Going", label: `Not Going (${attendeeCounts.notGoing})` }
              ] as Array<{ key: AttendeeFilterKey; label: string }>).map((filter) => (
                <button
                  key={filter.key}
                  className={`chip ${attendeeFilter === filter.key ? "chip-upcoming" : "chip-outline"}`}
                  onClick={() => setAttendeeFilter(filter.key)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="tailgate-details-attendee-list">
              {filteredAttendees.length > 0 ? (
                filteredAttendees.map((attendee) => {
                  const meta = attendeeStatusMeta[attendee.status];
                  return (
                    <div className="tailgate-details-attendee-row" key={attendee.id}>
                      <div>
                        <p className="tailgate-details-attendee-name">{attendee.name}</p>
                        <p className="tailgate-details-attendee-meta">
                          {attendee.phone ?? attendee.email ?? "No contact"}
                        </p>
                      </div>
                      <span className={`chip ${meta.className}`}>{meta.label}</span>
                    </div>
                  );
                })
              ) : (
                <p className="meta-muted">No attendees for this filter yet.</p>
              )}
            </div>
          </article>
        </section>
      )}
    </AppShell>
  );
}

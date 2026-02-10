import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import { useAuth } from "../hooks/useAuth";
import { db, functions as firebaseFunctions } from "../lib/firebase";
import { mockTailgates } from "../data/mockTailgates";
import { TailgateEvent, TailgateStatus, VisibilityType } from "../types";
import { estimateHostPayout, getVisibilityLabel } from "../utils/tailgate";
import { formatCurrencyFromCents, formatDateTime } from "../utils/format";

const MAPS_API_KEY = (
  import.meta.env.MAPS_API_KEY ??
  import.meta.env.VITE_MAPS_API_KEY ??
  ""
).trim();
const MAX_TICKET_QUANTITY = 8;

type AttendeeFilterKey = "All" | "Going" | "Pending" | "Not Going";
type AttendeeStatus = "Host" | "Attending" | "Pending" | "Not Attending";
type TicketCheckState = "loading" | "confirmed" | "pending" | "missing";
type TimelineStep = {
  id: string;
  title: string;
  description?: string;
  timestampStart: Date;
  timestampEnd?: Date | null;
};
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

type TimelineDraft = {
  title: string;
  description: string;
  startTime: string;
  durationHours: string;
  durationMinutes: string;
  durationSeconds: string;
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
  eventTargetTime?: Date | null;
  schedulePublished?: boolean;
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

function parseDurationPart(value: string) {
  if (!value.trim()) return 0;
  const parsed = Number(value.replace(/\D/g, ""));
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.floor(parsed));
}

function formatDurationCountdown(diffMs: number) {
  if (diffMs <= 0) return "00:00:00";
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

function toTimeInput(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function buildTimelineWindow(
  baseDate: Date,
  startTime: string,
  durationHours: number,
  durationMinutes: number,
  durationSeconds: number
) {
  const matches = startTime.match(/^(\d{2}):(\d{2})$/);
  if (!matches) return null;
  const hours = Number(matches[1]);
  const minutes = Number(matches[2]);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;

  const start = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    hours,
    minutes,
    0,
    0
  );
  if (Number.isNaN(start.getTime())) return null;

  const safeHours = Math.max(0, Math.floor(durationHours));
  const safeMinutes = Math.max(0, Math.floor(durationMinutes));
  const safeSeconds = Math.max(0, Math.floor(durationSeconds));
  const durationMs =
    safeHours * 60 * 60 * 1000 + safeMinutes * 60 * 1000 + safeSeconds * 1000;
  const end = new Date(start.getTime() + durationMs);

  return { start, end };
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

function buildMapEmbedUrl(
  coords: { lat: number; lng: number },
  mapsApiKey: string,
  locationLabel?: string
): string | null {
  if (!mapsApiKey) return null;
  const query = `${coords.lat},${coords.lng}`;
  const url = new URL("https://www.google.com/maps/embed/v1/place");
  url.searchParams.set("key", mapsApiKey);
  url.searchParams.set("q", query);
  if (locationLabel?.trim()) {
    url.searchParams.set("q", `${query} (${locationLabel.trim()})`);
  }
  url.searchParams.set("zoom", "14");
  return url.toString();
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
    eventTargetTime:
      normalizeDate(data.eventTargetTime) ??
      normalizeDate(data.gameTime) ??
      startDateTime,
    schedulePublished: data.schedulePublished === true,
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
    eventTargetTime: event.startDateTime,
    schedulePublished: false,
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
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const attendeeSectionRef = useRef<HTMLElement | null>(null);
  const timelineSectionRef = useRef<HTMLElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<TailgateDetail | null>(null);
  const [attendeeFilter, setAttendeeFilter] = useState<AttendeeFilterKey>("All");
  const [pinning, setPinning] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [ticketCheckState, setTicketCheckState] = useState<TicketCheckState>("loading");
  const [hasConfirmedTicket, setHasConfirmedTicket] = useState(false);
  const [confirmedTicketCount, setConfirmedTicketCount] = useState(0);
  const [ticketPurchaseCount, setTicketPurchaseCount] = useState(0);
  const [hasPendingTickets, setHasPendingTickets] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [timelineSteps, setTimelineSteps] = useState<TimelineStep[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(true);
  const [timelineError, setTimelineError] = useState<string | null>(null);
  const [timelineDraft, setTimelineDraft] = useState<TimelineDraft>({
    title: "",
    description: "",
    startTime: "09:00",
    durationHours: "0",
    durationMinutes: "0",
    durationSeconds: "0"
  });
  const [editingTimelineId, setEditingTimelineId] = useState<string | null>(null);
  const [timelineSaving, setTimelineSaving] = useState(false);
  const [publishingTimeline, setPublishingTimeline] = useState(false);
  const [eventStartInput, setEventStartInput] = useState("09:00");

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

  useEffect(() => {
    if (!id) {
      setTimelineSteps([]);
      setTimelineLoading(false);
      setTimelineError("Missing tailgate id.");
      return;
    }
    if (!db) {
      setTimelineSteps([]);
      setTimelineLoading(false);
      setTimelineError(null);
      return;
    }

    setTimelineLoading(true);
    setTimelineError(null);
    const scheduleQuery = query(
      collection(db, "tailgateEvents", id, "schedule"),
      orderBy("timestampStart")
    );
    const unsubscribe = onSnapshot(
      scheduleQuery,
      (snapshot) => {
        const nextSteps = snapshot.docs.map((snapshotDoc) => {
          const data = snapshotDoc.data() as Record<string, unknown>;
          return {
            id: snapshotDoc.id,
            title: firstString(data.title) ?? "Untitled step",
            description: firstString(data.description),
            timestampStart: normalizeDate(data.timestampStart) ?? new Date(0),
            timestampEnd: normalizeDate(data.timestampEnd)
          } as TimelineStep;
        });
        setTimelineSteps(nextSteps);
        setTimelineLoading(false);
        setTimelineError(null);
      },
      (snapshotError) => {
        console.error("Failed to load timeline steps", snapshotError);
        setTimelineLoading(false);
        setTimelineError("Unable to load timeline.");
      }
    );

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    const baseEventTime = detail?.eventTargetTime ?? detail?.startDateTime;
    if (!baseEventTime) return;

    const timeValue = toTimeInput(baseEventTime);
    setEventStartInput(timeValue);
    setTimelineDraft((previous) => {
      if (editingTimelineId) return previous;
      if (previous.title.trim() || previous.description.trim()) {
        return previous;
      }
      return {
        ...previous,
        startTime: timeValue
      };
    });
  }, [detail?.eventTargetTime, detail?.startDateTime, editingTimelineId]);

  const status = useMemo(() => (detail ? resolveStatus(detail) : null), [detail]);
  const isHostUser = useMemo(() => {
    if (!detail || !user?.uid) return false;
    return detail.hostId === user.uid || detail.coHostIds.includes(user.uid);
  }, [detail, user?.uid]);

  useEffect(() => {
    setTicketQuantity(1);
    setCheckoutError(null);
  }, [detail?.id]);

  useEffect(() => {
    if (!detail || detail.visibilityType !== "open_paid" || isHostUser) {
      setHasConfirmedTicket(true);
      setTicketCheckState("confirmed");
      setConfirmedTicketCount(0);
      setTicketPurchaseCount(0);
      setHasPendingTickets(false);
      return;
    }
    if (!user?.uid || !db) {
      setHasConfirmedTicket(false);
      setTicketCheckState("missing");
      setConfirmedTicketCount(0);
      setTicketPurchaseCount(0);
      setHasPendingTickets(false);
      return;
    }

    setTicketCheckState("loading");
    let newTicketCount = 0;
    let purchaseCount = 0;
    let pendingPurchaseCount = 0;
    let legacyConfirmedCount = 0;
    let legacyPendingExists = false;
    let legacyPurchaseCount = 0;
    let hasNewSnapshot = false;
    let hasPurchaseSnapshot = false;
    let hasLegacySnapshot = false;

    const applyTicketState = () => {
      if (!hasNewSnapshot || !hasPurchaseSnapshot || !hasLegacySnapshot) {
        return;
      }

      const useNewModel = newTicketCount > 0 || purchaseCount > 0;
      if (useNewModel) {
        setTicketPurchaseCount(purchaseCount);
        setHasPendingTickets(pendingPurchaseCount > 0);
        if (newTicketCount > 0) {
          setHasConfirmedTicket(true);
          setTicketCheckState("confirmed");
          setConfirmedTicketCount(newTicketCount);
          return;
        }
        setHasConfirmedTicket(false);
        setTicketCheckState(pendingPurchaseCount > 0 ? "pending" : "missing");
        setConfirmedTicketCount(0);
        return;
      }

      setTicketPurchaseCount(legacyPurchaseCount);
      setHasPendingTickets(legacyPendingExists);
      if (legacyConfirmedCount > 0) {
        setHasConfirmedTicket(true);
        setTicketCheckState("confirmed");
        setConfirmedTicketCount(legacyConfirmedCount);
        return;
      }
      setHasConfirmedTicket(false);
      setTicketCheckState(legacyPendingExists ? "pending" : "missing");
      setConfirmedTicketCount(0);
    };

    const newTicketsQuery = query(
      collection(db, "tickets"),
      where("tailgateId", "==", detail.id),
      where("attendeeUserId", "==", user.uid)
    );
    const purchasesQuery = query(
      collection(db, "ticketPurchases"),
      where("tailgateId", "==", detail.id),
      where("buyerUserId", "==", user.uid)
    );
    const legacyTicketsQuery = query(
      collection(db, "tailgateTickets"),
      where("tailgateId", "==", detail.id),
      where("userId", "==", user.uid)
    );

    const unsubscribeNew = onSnapshot(
      newTicketsQuery,
      (snapshot) => {
        newTicketCount = snapshot.docs.filter((docSnap) => {
          const statusValue = docSnap.get("status");
          return statusValue === "valid" || statusValue === "checked_in";
        }).length;
        hasNewSnapshot = true;
        applyTicketState();
      },
      (snapshotError) => {
        console.error("Ticket lookup failed", snapshotError);
        hasNewSnapshot = true;
        applyTicketState();
      }
    );
    const unsubscribePurchases = onSnapshot(
      purchasesQuery,
      (snapshot) => {
        purchaseCount = snapshot.docs.filter((docSnap) => docSnap.get("status") !== "cancelled").length;
        pendingPurchaseCount = snapshot.docs.filter((docSnap) => docSnap.get("status") === "pending").length;
        hasPurchaseSnapshot = true;
        applyTicketState();
      },
      (snapshotError) => {
        console.error("Purchase lookup failed", snapshotError);
        hasPurchaseSnapshot = true;
        applyTicketState();
      }
    );
    const unsubscribeLegacy = onSnapshot(
      legacyTicketsQuery,
      (snapshot) => {
        legacyPurchaseCount = snapshot.docs.filter((docSnap) => docSnap.get("status") !== "cancelled").length;
        legacyPendingExists = snapshot.docs.some((docSnap) => docSnap.get("status") === "pending");
        legacyConfirmedCount = snapshot.docs.reduce((sum, docSnap) => {
          const data = docSnap.data() || {};
          if (data?.status !== "confirmed") {
            return sum;
          }
          const quantity = Number(data?.quantity);
          return sum + (Number.isFinite(quantity) && quantity > 0 ? quantity : 1);
        }, 0);
        hasLegacySnapshot = true;
        applyTicketState();
      },
      (snapshotError) => {
        console.error("Legacy ticket lookup failed", snapshotError);
        hasLegacySnapshot = true;
        applyTicketState();
      }
    );

    return () => {
      unsubscribeNew();
      unsubscribePurchases();
      unsubscribeLegacy();
    };
  }, [detail, isHostUser, user?.uid]);

  const locationLabel = detail?.locationSummary ?? "Location not set";
  const locationCoords = detail?.locationCoords ?? null;
  const mapUrl = locationCoords
    ? buildMapEmbedUrl(locationCoords, MAPS_API_KEY, locationLabel)
    : null;
  const checkoutResult = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const value = params.get("checkout");
    return value === "success" || value === "cancel" ? value : null;
  }, [location.search]);

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
  const capacity =
    typeof detail?.capacity === "number" && detail.capacity > 0
      ? detail.capacity
      : null;
  const confirmedPaidCount =
    typeof detail?.ticketsSold === "number" && detail.ticketsSold >= 0
      ? detail.ticketsSold
      : 0;
  const capacityRemaining =
    capacity !== null ? Math.max(0, capacity - confirmedPaidCount) : null;
  const isSoldOut = capacityRemaining !== null && capacityRemaining <= 0;
  const maxSelectableQuantity =
    capacityRemaining !== null
      ? Math.max(1, Math.min(MAX_TICKET_QUANTITY, capacityRemaining))
      : MAX_TICKET_QUANTITY;
  const showTicketPurchase =
    detail?.visibilityType === "open_paid" &&
    !isHostUser &&
    status !== "cancelled";
  const canPurchaseTickets =
    showTicketPurchase &&
    (ticketCheckState === "missing" || ticketCheckState === "confirmed") &&
    !isSoldOut;
  const totalTicketCents =
    typeof detail?.ticketPriceCents === "number"
      ? detail.ticketPriceCents * ticketQuantity
      : null;
  const ticketTotalLabel =
    typeof totalTicketCents === "number"
      ? formatCurrencyFromCents(totalTicketCents)
      : null;
  const purchaseCtaLabel = isSoldOut
    ? "Sold out"
    : hasConfirmedTicket
    ? "Buy more tickets"
    : "Purchase ticket";
  const ticketStatusMessage =
    ticketCheckState === "loading"
      ? "Checking your ticket status..."
      : ticketCheckState === "confirmed"
      ? hasConfirmedTicket && confirmedTicketCount > 0
        ? `You already have ${confirmedTicketCount} ticket${confirmedTicketCount === 1 ? "" : "s"}.`
        : "Your tickets are confirmed."
      : ticketCheckState === "pending"
      ? "Payment received. Ticket confirmation is in progress."
      : isSoldOut
      ? "This tailgate is sold out."
      : "Continue to checkout to purchase tickets.";
  const timelineBaseEventTime = detail?.eventTargetTime ?? detail?.startDateTime ?? null;
  const canViewTimeline = isHostUser || detail?.schedulePublished === true;
  const timelinePublishLabel = detail?.schedulePublished
    ? "Schedule is visible to attendees."
    : "Schedule is hidden from attendees.";

  useEffect(() => {
    setTicketQuantity((current) =>
      Math.max(1, Math.min(current, maxSelectableQuantity))
    );
  }, [maxSelectableQuantity]);

  const openMaps = () => {
    if (!detail) return;
    const query = locationCoords
      ? `${locationCoords.lat},${locationCoords.lng}`
      : locationLabel;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCheckoutPress = async () => {
    if (!detail || !canPurchaseTickets || isCheckoutLoading) {
      return;
    }
    if (!user) {
      setCheckoutError("Please sign in to purchase tickets.");
      return;
    }
    if (!firebaseFunctions) {
      setCheckoutError("Checkout is unavailable right now.");
      return;
    }

    setCheckoutError(null);
    setIsCheckoutLoading(true);

    const sanitizedQuantity = Math.max(
      1,
      Math.min(ticketQuantity, MAX_TICKET_QUANTITY)
    );
    if (sanitizedQuantity !== ticketQuantity) {
      setTicketQuantity(sanitizedQuantity);
    }

    try {
      const successUrl = `${window.location.origin}${window.location.pathname}#/tailgates/${encodeURIComponent(
        detail.id
      )}?checkout=success`;
      const cancelUrl = `${window.location.origin}${window.location.pathname}#/tailgates/${encodeURIComponent(
        detail.id
      )}?checkout=cancel`;
      const createSession = httpsCallable(
        firebaseFunctions,
        "createTailgateCheckoutSession"
      );
      const result = await createSession({
        tailgateId: detail.id,
        quantity: sanitizedQuantity,
        successUrl,
        cancelUrl
      });
      const data = result.data as {
        checkoutUrl?: string | null;
      };

      if (!data?.checkoutUrl) {
        setCheckoutError("Checkout session unavailable. Please try again.");
        return;
      }

      window.location.assign(data.checkoutUrl);
    } catch (checkoutFailure) {
      const message =
        checkoutFailure instanceof Error
          ? checkoutFailure.message
          : "Unable to start checkout right now.";

      if (message.includes("SOLD_OUT")) {
        setCheckoutError("This tailgate is sold out.");
      } else if (message.includes("unauthenticated")) {
        setCheckoutError("Please sign in again.");
      } else {
        setCheckoutError("Unable to start checkout. Please try again.");
      }
    } finally {
      setIsCheckoutLoading(false);
    }
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

  const scrollToTimeline = () => {
    timelineSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const resetTimelineDraft = () => {
    setEditingTimelineId(null);
    setTimelineDraft({
      title: "",
      description: "",
      startTime: eventStartInput || "09:00",
      durationHours: "0",
      durationMinutes: "0",
      durationSeconds: "0"
    });
  };

  const saveEventStartTime = async () => {
    if (!db || !id) return;
    const matches = eventStartInput.match(/^(\d{2}):(\d{2})$/);
    if (!matches) {
      setTimelineError("Event start time is invalid.");
      return;
    }

    const baseDate = timelineBaseEventTime ?? detail?.startDateTime ?? new Date();
    const nextEventStart = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      Number(matches[1]),
      Number(matches[2]),
      0,
      0
    );

    try {
      setTimelineError(null);
      await updateDoc(doc(db, "tailgateEvents", id), {
        eventTargetTime: nextEventStart
      });
    } catch (saveError) {
      console.error("Failed to save event start time", saveError);
      setTimelineError("Unable to save event start time.");
    }
  };

  const saveTimelineStep = async () => {
    if (!db || !id || !timelineBaseEventTime) {
      setTimelineError("Timeline is unavailable right now.");
      return;
    }

    const title = timelineDraft.title.trim();
    if (!title) {
      setTimelineError("Timeline step title is required.");
      return;
    }

    const durationHours = parseDurationPart(timelineDraft.durationHours);
    const durationMinutes = parseDurationPart(timelineDraft.durationMinutes);
    const durationSeconds = parseDurationPart(timelineDraft.durationSeconds);
    const window = buildTimelineWindow(
      timelineBaseEventTime,
      timelineDraft.startTime,
      durationHours,
      durationMinutes,
      durationSeconds
    );
    if (!window) {
      setTimelineError("Timeline start time is invalid.");
      return;
    }

    setTimelineSaving(true);
    setTimelineError(null);
    try {
      const scheduleData = {
        title,
        description: timelineDraft.description.trim(),
        timestampStart: window.start,
        timestampEnd: window.end,
        updatedAt: new Date()
      };

      if (editingTimelineId) {
        await updateDoc(
          doc(db, "tailgateEvents", id, "schedule", editingTimelineId),
          scheduleData
        );
      } else {
        await addDoc(collection(db, "tailgateEvents", id, "schedule"), {
          ...scheduleData,
          createdAt: new Date()
        });
      }
      resetTimelineDraft();
    } catch (saveError) {
      console.error("Failed to save timeline step", saveError);
      setTimelineError("Unable to save timeline step.");
    } finally {
      setTimelineSaving(false);
    }
  };

  const editTimelineStep = (step: TimelineStep) => {
    const endTime = step.timestampEnd ?? step.timestampStart;
    const diffMs = Math.max(endTime.getTime() - step.timestampStart.getTime(), 0);
    const hours = Math.floor(diffMs / (60 * 60 * 1000));
    const minutes = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((diffMs % (60 * 1000)) / 1000);

    setEditingTimelineId(step.id);
    setTimelineDraft({
      title: step.title,
      description: step.description ?? "",
      startTime: toTimeInput(step.timestampStart),
      durationHours: String(hours),
      durationMinutes: String(minutes),
      durationSeconds: String(seconds)
    });
    setTimelineError(null);
  };

  const removeTimelineStep = async (stepId: string) => {
    if (!db || !id) return;
    const confirmed = window.confirm("Delete this timeline step?");
    if (!confirmed) return;

    try {
      setTimelineError(null);
      await deleteDoc(doc(db, "tailgateEvents", id, "schedule", stepId));
      if (editingTimelineId === stepId) {
        resetTimelineDraft();
      }
    } catch (deleteError) {
      console.error("Failed to delete timeline step", deleteError);
      setTimelineError("Unable to delete timeline step.");
    }
  };

  const toggleTimelinePublish = async () => {
    if (!db || !id || publishingTimeline) return;
    setPublishingTimeline(true);
    try {
      setTimelineError(null);
      await updateDoc(doc(db, "tailgateEvents", id), {
        schedulePublished: !(detail?.schedulePublished === true)
      });
    } catch (publishError) {
      console.error("Failed to update timeline publish status", publishError);
      setTimelineError("Unable to update publish status.");
    } finally {
      setPublishingTimeline(false);
    }
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
          {checkoutResult === "success" ? (
            <section className="tailgate-details-checkout-banner success">
              Purchase successful. Open the TailgateTime app to view tickets.
            </section>
          ) : checkoutResult === "cancel" ? (
            <section className="tailgate-details-checkout-banner">
              Checkout was canceled. You can try again whenever you're ready.
            </section>
          ) : null}
          <article className="tailgate-details-hero">
            <div className="tailgate-details-hero-top">
              <div>
                <p className="tailgate-details-eyebrow">
                  {isHostUser ? "Host dashboard" : "Tailgate details"}
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

          {isHostUser ? (
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
          ) : null}

          {isHostUser ? (
            <article className="tailgate-details-card">
              <div className="section-header">
                <div>
                  <h2>Quick actions</h2>
                  <p className="section-subtitle">Keep everything on track.</p>
                </div>
              </div>
              <div className="tailgate-details-control-list">
                <button
                  className="tailgate-details-control-row"
                  onClick={() => navigate(`/tailgates/${detail.id}/edit`)}
                >
                  <span>Edit event details</span>
                  <small>Update event name, kickoff, and meetup details</small>
                </button>
                <button className="tailgate-details-control-row" onClick={scrollToAttendees}>
                  <span>{detail.visibilityType === "open_paid" ? "View ticket holders" : "View guest list"}</span>
                  <small>
                    {detail.visibilityType === "open_paid"
                      ? "Review ticket and RSVP status"
                      : "Review invites and RSVPs"}
                  </small>
                </button>
                <button className="tailgate-details-control-row" onClick={scrollToTimeline}>
                  <span>{detail.schedulePublished ? "Edit schedule" : "Build schedule"}</span>
                  <small>
                    {detail.schedulePublished
                      ? "Fine tune your published run of show"
                      : "Map out the timeline so guests know the plan"}
                  </small>
                </button>
                <button
                  className="tailgate-details-control-row"
                  onClick={() => navigate(`/tailgates/${detail.id}/checkin`)}
                >
                  <span>Check-in by code</span>
                  <small>Enter ticket codes from the host list</small>
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
            {showTicketPurchase ? (
              <div className="tailgate-details-ticket-block">
                <div className="tailgate-details-ticket-row">
                  <p className="tailgate-details-ticket-title">Tickets</p>
                  <span className="chip chip-upcoming">
                    {formatCurrencyFromCents(detail.ticketPriceCents)} per person
                  </span>
                </div>
                <p className="tailgate-details-ticket-copy">{ticketStatusMessage}</p>
                {ticketPurchaseCount > 0 || hasPendingTickets ? (
                  <p className="tailgate-details-ticket-copy app-note">
                    Purchase detected. Open the TailgateTime app to view your tickets.
                  </p>
                ) : null}
                {canPurchaseTickets ? (
                  <div className="tailgate-details-ticket-controls">
                    <div className="tailgate-details-ticket-qty">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                          setTicketQuantity((current) => Math.max(1, current - 1))
                        }
                        disabled={ticketQuantity <= 1}
                      >
                        -
                      </button>
                      <strong>{ticketQuantity}</strong>
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                          setTicketQuantity((current) =>
                            Math.min(maxSelectableQuantity, current + 1)
                          )
                        }
                        disabled={ticketQuantity >= maxSelectableQuantity}
                      >
                        +
                      </button>
                    </div>
                    {ticketTotalLabel ? (
                      <p className="tailgate-details-ticket-total">Total {ticketTotalLabel}</p>
                    ) : null}
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => void handleCheckoutPress()}
                      disabled={isCheckoutLoading || isSoldOut}
                    >
                      {isCheckoutLoading ? "Preparing checkout..." : purchaseCtaLabel}
                    </button>
                  </div>
                ) : null}
                {checkoutError ? <p className="tailgate-details-ticket-error">{checkoutError}</p> : null}
              </div>
            ) : null}
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

          {canViewTimeline ? (
            <article className="tailgate-details-card" ref={timelineSectionRef}>
              <div className="section-header">
                <div>
                  <h2>Timeline</h2>
                  <p className="section-subtitle">
                    {isHostUser
                      ? "Build and publish your event run-of-show."
                      : "Host-published run-of-show for this tailgate."}
                  </p>
                </div>
              </div>
              {isHostUser ? (
                <div className="tailgate-timeline-host-tools">
                  <div className="tailgate-timeline-time-row">
                    <label className="input-label" htmlFor="tailgate-event-start-time">
                      Event Start Time
                    </label>
                    <div className="tailgate-timeline-time-actions">
                      <input
                        id="tailgate-event-start-time"
                        className="text-input"
                        type="time"
                        value={eventStartInput}
                        onChange={(event) => setEventStartInput(event.target.value)}
                      />
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => void saveEventStartTime()}
                      >
                        Save start time
                      </button>
                    </div>
                  </div>
                  <div className="tailgate-timeline-publish-row">
                    <p className="meta-muted">{timelinePublishLabel}</p>
                    <button
                      type="button"
                      className={detail.schedulePublished ? "secondary-button" : "primary-button"}
                      onClick={() => void toggleTimelinePublish()}
                      disabled={publishingTimeline}
                    >
                      {publishingTimeline
                        ? "Saving..."
                        : detail.schedulePublished
                        ? "Unpublish schedule"
                        : "Publish schedule"}
                    </button>
                  </div>
                  <div className="tailgate-timeline-editor">
                    <div className="tailgate-timeline-grid">
                      <label className="input-group">
                        <span className="input-label">Step title</span>
                        <input
                          className="text-input"
                          value={timelineDraft.title}
                          onChange={(event) =>
                            setTimelineDraft((previous) => ({
                              ...previous,
                              title: event.target.value
                            }))
                          }
                          placeholder="Grill setup"
                        />
                      </label>
                      <label className="input-group">
                        <span className="input-label">Start time</span>
                        <input
                          className="text-input"
                          type="time"
                          value={timelineDraft.startTime}
                          onChange={(event) =>
                            setTimelineDraft((previous) => ({
                              ...previous,
                              startTime: event.target.value
                            }))
                          }
                        />
                      </label>
                    </div>
                    <label className="input-group">
                      <span className="input-label">Description (optional)</span>
                      <textarea
                        className="text-input tailgate-timeline-description-input"
                        value={timelineDraft.description}
                        onChange={(event) =>
                          setTimelineDraft((previous) => ({
                            ...previous,
                            description: event.target.value
                          }))
                        }
                        placeholder="Prep stations and coolers for early arrivals."
                      />
                    </label>
                    <p className="input-label">Duration</p>
                    <div className="tailgate-timeline-duration-grid">
                      <label className="input-group">
                        <input
                          className="text-input"
                          value={timelineDraft.durationHours}
                          onChange={(event) =>
                            setTimelineDraft((previous) => ({
                              ...previous,
                              durationHours: event.target.value.replace(/\D/g, "")
                            }))
                          }
                          placeholder="0"
                        />
                        <span className="meta-muted">Hours</span>
                      </label>
                      <label className="input-group">
                        <input
                          className="text-input"
                          value={timelineDraft.durationMinutes}
                          onChange={(event) =>
                            setTimelineDraft((previous) => ({
                              ...previous,
                              durationMinutes: event.target.value.replace(/\D/g, "")
                            }))
                          }
                          placeholder="30"
                        />
                        <span className="meta-muted">Minutes</span>
                      </label>
                      <label className="input-group">
                        <input
                          className="text-input"
                          value={timelineDraft.durationSeconds}
                          onChange={(event) =>
                            setTimelineDraft((previous) => ({
                              ...previous,
                              durationSeconds: event.target.value.replace(/\D/g, "")
                            }))
                          }
                          placeholder="0"
                        />
                        <span className="meta-muted">Seconds</span>
                      </label>
                    </div>
                    <div className="tailgate-timeline-editor-actions">
                      <button
                        type="button"
                        className="primary-button"
                        onClick={() => void saveTimelineStep()}
                        disabled={timelineSaving}
                      >
                        {timelineSaving
                          ? "Saving..."
                          : editingTimelineId
                          ? "Save step"
                          : "Add step"}
                      </button>
                      {editingTimelineId ? (
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={resetTimelineDraft}
                          disabled={timelineSaving}
                        >
                          Cancel edit
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}
              {timelineError ? (
                <p className="tailgate-details-ticket-error">{timelineError}</p>
              ) : null}
              <div className="tailgate-timeline-list">
                {timelineLoading ? (
                  <p className="meta-muted">Loading timeline...</p>
                ) : timelineSteps.length > 0 ? (
                  timelineSteps.map((step) => {
                    const endTime = step.timestampEnd ?? step.timestampStart;
                    const timeUntilEvent = timelineBaseEventTime
                      ? formatDurationCountdown(
                          timelineBaseEventTime.getTime() - endTime.getTime()
                        )
                      : "--:--:--";
                    return (
                      <div className="tailgate-timeline-row" key={step.id}>
                        <div>
                          <p className="tailgate-details-attendee-name">{step.title}</p>
                          {step.description ? (
                            <p className="tailgate-timeline-row-description">
                              {step.description}
                            </p>
                          ) : null}
                          <p className="tailgate-details-attendee-meta">
                            {step.timestampStart.toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit"
                            })}{" "}
                            -{" "}
                            {endTime.toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit"
                            })}
                          </p>
                          <p className="tailgate-timeline-row-countdown">
                            Time until event: {timeUntilEvent}
                          </p>
                        </div>
                        {isHostUser ? (
                          <div className="tailgate-timeline-row-actions">
                            <button
                              type="button"
                              className="link-button"
                              onClick={() => editTimelineStep(step)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="link-button"
                              onClick={() => void removeTimelineStep(step.id)}
                            >
                              Remove
                            </button>
                          </div>
                        ) : null}
                      </div>
                    );
                  })
                ) : (
                  <p className="meta-muted">
                    {isHostUser
                      ? "No timeline steps yet."
                      : "No schedule has been published yet."}
                  </p>
                )}
              </div>
            </article>
          ) : null}

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
                {MAPS_API_KEY
                  ? "No coordinates yet. Host can drop an exact location pin from Host Controls."
                  : "Set MAPS_API_KEY to preview Google Maps for this tailgate."}
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
                  className={`tailgate-details-filter-chip${
                    attendeeFilter === filter.key ? " is-active" : ""
                  }`}
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
                        {attendee.email ? (
                          <p className="tailgate-details-attendee-meta">{attendee.email}</p>
                        ) : null}
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

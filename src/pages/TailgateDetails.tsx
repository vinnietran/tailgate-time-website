import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getBlob, getDownloadURL, ref } from "firebase/storage";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import { useAuth } from "../hooks/useAuth";
import { useDialog } from "../hooks/useDialog";
import { useCreateRefundRequest } from "../hooks/useCreateRefundRequest";
import {
  app as firebaseApp,
  db,
  functions as firebaseFunctions,
  storage as firebaseStorage
} from "../lib/firebase";
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
const MAX_HOST_BROADCAST_MESSAGE_LENGTH = 320;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

type AttendeeFilterKey = "All" | "Going" | "Pending" | "Not Going";
type AttendeeStatus = "Host" | "Attending" | "Pending" | "Not Attending";
type TicketCheckState = "loading" | "confirmed" | "missing";
type GuestRsvpChoice = "Attending" | "Not Attending";
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
  | "restroomNearby"
  | "musicLiveDj"
  | "musicGameDayPlaylist"
  | "musicBandSet"
  | "musicCountryHits"
  | "musicHipHopHits"
  | "musicNoPreference"
  | "drinkByob"
  | "drinkWaterSoda"
  | "drinkBeerSelection"
  | "drinkCraftCocktails"
  | "drinkPremiumSpirits"
  | "drinkDryFriendly"
  | "amenityLawnGames"
  | "amenityTvWall"
  | "amenityShadedSetup"
  | "amenityPowerAccess"
  | "amenityFamilyZone"
  | "amenityClimateControl";

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

type InlineEditDraft = {
  eventName: string;
  description: string;
  eventDate: string;
  eventStartTime: string;
  locationSummary: string;
  ticketPrice: string;
  capacity: string;
};

type GuestInviteDraft = {
  name: string;
  phone: string;
  email: string;
};

type HostBroadcastFeedbackTone = "success" | "info" | "error";

type HostBroadcastFeedback = {
  tone: HostBroadcastFeedbackTone;
  text: string;
};

type CancelRefundProgress = {
  loading: boolean;
  totalPaid: number;
  refunded: number;
  error: boolean;
};

type RefundRequestStatus = "pending" | "approved" | "denied" | null;

type GuestRefundTicket = {
  ticketId: string;
  ticketCode: string;
  purchaseReference: string;
  purchaseNumber?: string;
  quantity: number;
  amountCents?: number;
  ticketStatus: string;
  refundRequestStatus: RefundRequestStatus;
  refundRequestId?: string;
  guestReason?: string;
  hostDecisionReason?: string;
  isConfirmedTicket: boolean;
  isRefunded: boolean;
  isEligibleForRequest: boolean;
  createdAtMs: number;
};

type GuestRefundPurchase = {
  purchaseReference: string;
  purchaseNumber?: string;
  representativeTicketId: string;
  quantity: number;
  amountCents?: number;
  refundRequestStatus: RefundRequestStatus;
  refundRequestId?: string;
  hostDecisionReason?: string;
  isRefunded: boolean;
  isEligibleForRequest: boolean;
  createdAtMs: number;
};

type HostTextToAttendeesInput = {
  eventId: string;
  message: string;
};

type HostTextToAttendeesResponse = {
  attemptedCount?: unknown;
  sentCount?: unknown;
  failedCount?: unknown;
  successfulPhones?: unknown;
};

type TailgateDetail = {
  id: string;
  eventName: string;
  description?: string;
  coverImageUrls: string[];
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
  ticketSalesCloseAt?: Date | null;
  currency: string;
  ticketsSold?: number;
  checkedInCount?: number;
  status?: string;
  cancelledAt?: Date | null;
  eventTargetTime?: Date | null;
  timelineEnabled?: boolean;
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
  restroomNearby: "Restroom nearby",
  musicLiveDj: "Live DJ",
  musicGameDayPlaylist: "Game-day playlist",
  musicBandSet: "Live band",
  musicCountryHits: "Country hits",
  musicHipHopHits: "Hip-hop / throwbacks",
  musicNoPreference: "Low-key audio",
  drinkByob: "BYOB welcome",
  drinkWaterSoda: "Water + soft drinks",
  drinkBeerSelection: "Beer lineup",
  drinkCraftCocktails: "Cocktails",
  drinkPremiumSpirits: "Premium spirits",
  drinkDryFriendly: "Dry-friendly",
  amenityLawnGames: "Lawn games",
  amenityTvWall: "TV / screen",
  amenityShadedSetup: "Shade tents",
  amenityPowerAccess: "Power access",
  amenityFamilyZone: "Family zone",
  amenityClimateControl: "Fans / heaters"
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
const coordinateRegex = /^-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?$/;

function normalizeTicketLifecycleStatus(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function isConfirmedPaidTicketStatus(status: string): boolean {
  return status === "valid" || status === "checked_in" || status === "confirmed";
}

function isRefundedTicketStatus(status: string): boolean {
  return (
    status === "refunded" ||
    status === "refund_processed" ||
    status === "refund_succeeded"
  );
}

function isPaidTicketStatus(status: string): boolean {
  return (
    isConfirmedPaidTicketStatus(status) ||
    isRefundedTicketStatus(status) ||
    status === "paid" ||
    status === "purchase_succeeded"
  );
}

function formatPurchaseReference(reference: string) {
  const trimmed = reference.trim();
  if (!trimmed) return "unknown";
  if (trimmed.length <= 12) return trimmed;
  return `${trimmed.slice(0, 6)}...${trimmed.slice(-4)}`;
}

function normalizeRefundRequestStatus(value: unknown): RefundRequestStatus {
  const raw = String(value ?? "").trim().toLowerCase();
  if (!raw) return null;
  if (
    raw === "pending" ||
    raw === "requested" ||
    raw === "open" ||
    raw === "awaiting_host"
  ) {
    return "pending";
  }
  if (
    raw === "approved" ||
    raw === "refunded" ||
    raw === "processed" ||
    raw === "completed" ||
    raw === "succeeded"
  ) {
    return "approved";
  }
  if (raw === "denied" || raw === "declined" || raw === "rejected") {
    return "denied";
  }
  return null;
}

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

function stringArrayFromUnknown(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueStrings(values: string[]) {
  const seen = new Set<string>();
  const unique: string[] = [];
  values.forEach((value) => {
    if (seen.has(value)) return;
    seen.add(value);
    unique.push(value);
  });
  return unique;
}

function createInviteIdentifier() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
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

function toPhoneDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 10);
}

function formatPhoneInput(value: string) {
  const digits = toPhoneDigits(value);
  const area = digits.slice(0, 3);
  const middle = digits.slice(3, 6);
  const last = digits.slice(6, 10);

  if (digits.length <= 3) return area;
  if (digits.length <= 6) return `(${area}) ${middle}`;
  return `(${area}) ${middle}-${last}`;
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

function toDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function combineDateAndTime(dateValue: string, timeValue: string) {
  const [yearRaw, monthRaw, dayRaw] = dateValue.split("-");
  const [hoursRaw, minutesRaw] = timeValue.split(":");
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);
  if ([year, month, day, hours, minutes].some((value) => !Number.isFinite(value))) {
    return null;
  }
  const combined = new Date(year, month - 1, day, hours, minutes, 0, 0);
  if (Number.isNaN(combined.getTime())) return null;
  return combined;
}

function parsePriceToCents(value: string) {
  const normalized = value.replace(/[^0-9.]/g, "");
  if (!normalized) return null;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return null;
  return Math.round(parsed * 100);
}

function parseCapacity(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value.trim());
  if (!Number.isFinite(parsed) || parsed < 1) return null;
  return Math.floor(parsed);
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

function isCoordinateString(value?: string | null): boolean {
  if (typeof value !== "string") {
    return false;
  }
  return coordinateRegex.test(value.trim());
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
  mapsApiKey: string
): string | null {
  if (!mapsApiKey) return null;
  const query = `${coords.lat},${coords.lng}`;
  const url = new URL("https://www.google.com/maps/embed/v1/place");
  url.searchParams.set("key", mapsApiKey);
  url.searchParams.set("q", query);
  url.searchParams.set("zoom", "14");
  return url.toString();
}

function resolveCoverImageUrls(data: Record<string, unknown>): string[] {
  const cover = asRecord(data.cover);
  const media = asRecord(data.media);

  const singles = [
    firstString(
      data.coverImageUrl,
      data.coverPhotoUrl,
      data.heroImageUrl,
      data.bannerImageUrl,
      data.imageUrl,
      data.photoURL,
      data.photoUrl,
      cover?.url,
      cover?.imageUrl,
      cover?.downloadUrl,
      cover?.src,
      media?.coverImageUrl,
      media?.imageUrl
    )
  ].filter((value): value is string => Boolean(value));

  const arrays = [
    ...stringArrayFromUnknown(data.coverImageUrls),
    ...stringArrayFromUnknown(data.imageUrls),
    ...stringArrayFromUnknown(cover?.imageUrls),
    ...stringArrayFromUnknown(cover?.coverImageUrls),
    ...stringArrayFromUnknown(media?.coverImageUrls),
    ...stringArrayFromUnknown(media?.imageUrls)
  ];

  return uniqueStrings([...singles, ...arrays]);
}

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function inferMimeTypeFromValue(value: string) {
  const lower = value.toLowerCase();
  if (lower.includes(".png")) return "image/png";
  if (lower.includes(".webp")) return "image/webp";
  if (lower.includes(".gif")) return "image/gif";
  if (lower.includes(".heic")) return "image/heic";
  return "image/jpeg";
}

function toInlineImageUrl(urlValue: string) {
  if (!isHttpUrl(urlValue)) return urlValue;

  try {
    const parsed = new URL(urlValue);
    const isFirebaseStorageHost =
      parsed.hostname === "firebasestorage.googleapis.com" ||
      parsed.hostname === "storage.googleapis.com";
    if (!isFirebaseStorageHost) return urlValue;

    if (!parsed.searchParams.has("alt")) {
      parsed.searchParams.set("alt", "media");
    }
    if (!parsed.searchParams.has("response-content-disposition")) {
      parsed.searchParams.set("response-content-disposition", "inline");
    }
    if (!parsed.searchParams.has("response-content-type")) {
      parsed.searchParams.set("response-content-type", inferMimeTypeFromValue(urlValue));
    }

    return parsed.toString();
  } catch {
    return urlValue;
  }
}

function extractStoragePathFromValue(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (!isHttpUrl(trimmed)) {
    return trimmed.replace(/^\/+/, "");
  }

  try {
    const parsed = new URL(trimmed);
    const oSegmentMatch = parsed.pathname.match(/\/o\/(.+)$/);
    if (oSegmentMatch?.[1]) {
      return decodeURIComponent(oSegmentMatch[1]);
    }

    if (parsed.hostname === "storage.googleapis.com") {
      const segments = parsed.pathname.split("/").filter(Boolean);
      if (segments.length >= 2) {
        return decodeURIComponent(segments.slice(1).join("/"));
      }
    }
  } catch {
    return null;
  }

  return null;
}

function resolveTicketSalesCloseAt(
  data: Record<string, unknown>,
  startDateTime: Date | null
): Date | null {
  const direct =
    normalizeDate(data.ticketSalesCloseAt) ??
    normalizeDate(data.ticketSalesCutoffAt) ??
    normalizeDate(data.salesCloseAt);
  if (direct) return direct;

  const daysBefore =
    coerceNumber(data.ticketSalesCloseDaysBefore) ?? coerceNumber(data.ticketSalesCutoffDays);
  if (typeof daysBefore !== "number" || !startDateTime) {
    return null;
  }

  return new Date(startDateTime.getTime() - Math.max(0, daysBefore) * DAY_IN_MS);
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
  const ticketSalesCloseAt = resolveTicketSalesCloseAt(data, startDateTime);

  return {
    id,
    eventName: firstString(data.eventName, data.name, data.title) ?? "Untitled Tailgate",
    description: firstString(data.description),
    coverImageUrls: resolveCoverImageUrls(data),
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
    ticketSalesCloseAt,
    currency: firstString(data.currency) ?? "USD",
    ticketsSold,
    checkedInCount: coerceNumber(data.checkedInCount),
    status: firstString(data.status, data.eventStatus),
    cancelledAt: normalizeDate(data.cancelledAt),
    eventTargetTime:
      normalizeDate(data.eventTargetTime) ??
      normalizeDate(data.gameTime) ??
      startDateTime,
    timelineEnabled: data.timelineEnabled === true || data.schedulePublished === true,
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
    coverImageUrls: event.coverImageUrl ? [event.coverImageUrl] : [],
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
    ticketSalesCloseAt: null,
    currency: "USD",
    ticketsSold: event.ticketsSold ?? event.rsvpsConfirmed ?? 0,
    checkedInCount: undefined,
    status: event.status,
    cancelledAt: null,
    eventTargetTime: event.startDateTime,
    timelineEnabled: false,
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
  const { confirm, alert: showDialogAlert } = useDialog();
  const attendeeSectionRef = useRef<HTMLElement | null>(null);
  const timelineSectionRef = useRef<HTMLElement | null>(null);
  const eventSnapshotSectionRef = useRef<HTMLElement | null>(null);
  const attemptedCoverImageResolutionRef = useRef<Set<string>>(new Set());
  const attemptedCoverBlobFallbackRef = useRef<Set<string>>(new Set());
  const createdCoverBlobUrlsRef = useRef<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<TailgateDetail | null>(null);
  const [attendeeFilter, setAttendeeFilter] = useState<AttendeeFilterKey>("All");
  const [rsvpSaving, setRsvpSaving] = useState(false);
  const [rsvpPendingChoice, setRsvpPendingChoice] = useState<GuestRsvpChoice | null>(null);
  const [rsvpError, setRsvpError] = useState<string | null>(null);
  const [rsvpSuccess, setRsvpSuccess] = useState<string | null>(null);
  const [pinning, setPinning] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [ticketCheckState, setTicketCheckState] = useState<TicketCheckState>("loading");
  const [hasConfirmedTicket, setHasConfirmedTicket] = useState(false);
  const [confirmedTicketCount, setConfirmedTicketCount] = useState(0);
  const [guestRefundTickets, setGuestRefundTickets] = useState<GuestRefundTicket[]>([]);
  const [guestRefundModalPurchaseReference, setGuestRefundModalPurchaseReference] =
    useState<string | null>(null);
  const [guestRefundReason, setGuestRefundReason] = useState("");
  const [guestRefundFeedback, setGuestRefundFeedback] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);
  const [liveCheckedInCount, setLiveCheckedInCount] = useState<number | null>(null);
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
  const [enablingTimeline, setEnablingTimeline] = useState(false);
  const [eventStartInput, setEventStartInput] = useState("09:00");
  const [activeCoverIndex, setActiveCoverIndex] = useState(0);
  const [resolvedCoverImageUrlsByRaw, setResolvedCoverImageUrlsByRaw] = useState<
    Record<string, string>
  >({});
  const [blobCoverImageUrlsByRaw, setBlobCoverImageUrlsByRaw] = useState<
    Record<string, string>
  >({});
  const [loadedCoverImagesByKey, setLoadedCoverImagesByKey] = useState<Record<string, boolean>>(
    {}
  );
  const [coverImageLoadErrorsByRaw, setCoverImageLoadErrorsByRaw] = useState<
    Record<string, string>
  >({});
  const [recoveringCoverImageByRaw, setRecoveringCoverImageByRaw] = useState<
    Record<string, boolean>
  >({});
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [inlineEditSaving, setInlineEditSaving] = useState(false);
  const [inlineEditError, setInlineEditError] = useState<string | null>(null);
  const [inlineEditSuccess, setInlineEditSuccess] = useState<string | null>(null);
  const [inlineEditDraft, setInlineEditDraft] = useState<InlineEditDraft>({
    eventName: "",
    description: "",
    eventDate: "",
    eventStartTime: "",
    locationSummary: "",
    ticketPrice: "",
    capacity: ""
  });
  const [guestInviteDraft, setGuestInviteDraft] = useState<GuestInviteDraft>({
    name: "",
    phone: "",
    email: ""
  });
  const [guestInviteSaving, setGuestInviteSaving] = useState(false);
  const [guestInviteError, setGuestInviteError] = useState<string | null>(null);
  const [guestInviteSuccess, setGuestInviteSuccess] = useState<string | null>(null);
  const [isHostBroadcastComposerOpen, setIsHostBroadcastComposerOpen] = useState(false);
  const [hostBroadcastMessage, setHostBroadcastMessage] = useState("");
  const [hostBroadcastSending, setHostBroadcastSending] = useState(false);
  const [hostBroadcastFeedback, setHostBroadcastFeedback] =
    useState<HostBroadcastFeedback | null>(null);
  const [isCancelTailgateModalOpen, setIsCancelTailgateModalOpen] = useState(false);
  const [cancelTailgateSubmitting, setCancelTailgateSubmitting] = useState(false);
  const [cancelTailgateFeedback, setCancelTailgateFeedback] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);
  const [cancelRefundProgress, setCancelRefundProgress] = useState<CancelRefundProgress | null>(
    null
  );
  const rawCoverImageUrls = detail?.coverImageUrls ?? [];

  const clearCreatedCoverBlobUrls = () => {
    createdCoverBlobUrlsRef.current.forEach((blobUrl) => URL.revokeObjectURL(blobUrl));
    createdCoverBlobUrlsRef.current = [];
  };

  const getDisplayCoverImageUrl = (rawUrl: string) => {
    const normalized = rawUrl.trim();
    const resolved =
      blobCoverImageUrlsByRaw[rawUrl] ??
      blobCoverImageUrlsByRaw[normalized] ??
      resolvedCoverImageUrlsByRaw[rawUrl] ??
      resolvedCoverImageUrlsByRaw[normalized] ??
      normalized;
    return toInlineImageUrl(resolved);
  };

  const canBrowserDecodeBlob = async (blob: Blob) =>
    await new Promise<boolean>((resolve) => {
      const objectUrl = URL.createObjectURL(blob);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(true);
      };
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(false);
      };
      image.src = objectUrl;
    });

  const blobLooksLikeHeif = async (blob: Blob) => {
    try {
      const buffer = await blob.slice(0, 128).arrayBuffer();
      const bytes = new Uint8Array(buffer);
      if (bytes.length < 12) return false;

      const toAscii = (start: number, length: number) =>
        Array.from(bytes.slice(start, start + length))
          .map((byte) => String.fromCharCode(byte))
          .join("");

      const fileTypeBox = toAscii(4, 4).toLowerCase();
      if (fileTypeBox !== "ftyp") return false;

      const header = toAscii(8, Math.max(0, bytes.length - 8)).toLowerCase();
      return /(heic|heix|hevc|heim|heis|mif1|msf1)/.test(header);
    } catch {
      return false;
    }
  };

  const convertHeifBlobWithHeicTo = async (blob: Blob) => {
    try {
      const converterModule = await import("heic-to");
      const convertHeic = converterModule.heicTo as (args: {
        blob: Blob;
        type: string;
        quality?: number;
      }) => Promise<Blob>;
      const convertedBlob = await convertHeic({
        blob,
        type: "image/jpeg",
        quality: 0.92
      });
      if (!(convertedBlob instanceof Blob)) return null;
      const convertedDecodable = await canBrowserDecodeBlob(convertedBlob);
      return convertedDecodable ? convertedBlob : null;
    } catch {
      return null;
    }
  };

  const convertHeifBlobWithHeic2Any = async (blob: Blob) => {
    try {
      const converterModule = await import("heic2any");
      const convertHeicToAny = converterModule.default as (
        options: Record<string, unknown>
      ) => Promise<Blob | Blob[]>;
      const converted = await convertHeicToAny({
        blob,
        toType: "image/jpeg",
        quality: 0.92
      });
      const convertedBlob = Array.isArray(converted) ? converted[0] : converted;
      if (!(convertedBlob instanceof Blob)) return null;
      const convertedDecodable = await canBrowserDecodeBlob(convertedBlob);
      return convertedDecodable ? convertedBlob : null;
    } catch {
      return null;
    }
  };

  const convertBlobToJpegIfNeeded = async (blob: Blob) => {
    const alreadyDecodable = await canBrowserDecodeBlob(blob);
    if (alreadyDecodable) return blob;
    const looksLikeHeif = await blobLooksLikeHeif(blob);
    if (!looksLikeHeif) return null;

    const convertedWithHeicTo = await convertHeifBlobWithHeicTo(blob);
    if (convertedWithHeicTo) return convertedWithHeicTo;

    return await convertHeifBlobWithHeic2Any(blob);
  };

  const createCoverBlobFallback = async (rawUrl: string) => {
    if (!firebaseStorage) return false;
    const candidate = getDisplayCoverImageUrl(rawUrl);
    const normalizedCandidate = candidate.trim();
    if (!normalizedCandidate) return false;
    if (normalizedCandidate.startsWith("blob:") || normalizedCandidate.startsWith("data:")) {
      return false;
    }
    if (attemptedCoverBlobFallbackRef.current.has(normalizedCandidate)) return false;
    attemptedCoverBlobFallbackRef.current.add(normalizedCandidate);

    try {
      const candidateStoragePath =
        extractStoragePathFromValue(rawUrl) ?? extractStoragePathFromValue(normalizedCandidate);
      let blob: Blob | null = null;

      if (candidateStoragePath) {
        try {
          blob = await getBlob(ref(firebaseStorage, candidateStoragePath));
        } catch {
          blob = null;
        }
      }

      if (!blob) {
        const response = await fetch(normalizedCandidate);
        if (!response.ok) return false;
        blob = await response.blob();
      }

      if (blob.size <= 0) return false;
      if (
        blob.type.startsWith("text/") ||
        blob.type.includes("json") ||
        blob.type.includes("xml")
      ) {
        return false;
      }

      const typedBlob =
        blob.type && blob.type.startsWith("image/")
          ? blob
          : new Blob([blob], { type: inferMimeTypeFromValue(normalizedCandidate) });
      const renderableBlob = await convertBlobToJpegIfNeeded(typedBlob);
      if (!(renderableBlob instanceof Blob)) return false;
      const blobUrl = URL.createObjectURL(renderableBlob);
      createdCoverBlobUrlsRef.current.push(blobUrl);

      const normalizedRaw = rawUrl.trim();
      setBlobCoverImageUrlsByRaw((previous) => ({
        ...previous,
        [rawUrl]: blobUrl,
        [normalizedRaw]: blobUrl,
        [normalizedCandidate]: blobUrl
      }));
      return true;
    } catch {
      return false;
    }
  };

  useEffect(
    () => () => {
      clearCreatedCoverBlobUrls();
    },
    []
  );

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
    setActiveCoverIndex(0);
    attemptedCoverImageResolutionRef.current.clear();
    attemptedCoverBlobFallbackRef.current.clear();
    setResolvedCoverImageUrlsByRaw({});
    setBlobCoverImageUrlsByRaw({});
    setLoadedCoverImagesByKey({});
    setCoverImageLoadErrorsByRaw({});
    setRecoveringCoverImageByRaw({});
    clearCreatedCoverBlobUrls();
  }, [detail?.id]);

  useEffect(() => {
    if (!firebaseStorage || rawCoverImageUrls.length === 0) return;
    let isCancelled = false;

    const uniqueRawUrls = Array.from(
      new Set(
        rawCoverImageUrls
          .map((url) => url.trim())
          .filter((url) => url.length > 0)
      )
    );

    const urlsToResolve = uniqueRawUrls.filter((rawUrl) => {
      if (resolvedCoverImageUrlsByRaw[rawUrl]) return false;
      if (attemptedCoverImageResolutionRef.current.has(rawUrl)) return false;
      if (!isHttpUrl(rawUrl)) return true;
      return (
        rawUrl.includes("firebasestorage.googleapis.com") ||
        rawUrl.includes("storage.googleapis.com")
      );
    });
    if (urlsToResolve.length === 0) return;

    const resolveUrlFromStorage = async (rawUrl: string) => {
      const normalized = rawUrl.replace(/^\/+/, "");
      try {
        if (!isHttpUrl(normalized)) {
          return await getDownloadURL(ref(firebaseStorage, normalized));
        }
        if (
          normalized.includes("firebasestorage.googleapis.com") ||
          normalized.includes("storage.googleapis.com")
        ) {
          return await getDownloadURL(ref(firebaseStorage, normalized));
        }
        return normalized;
      } catch {
        return rawUrl;
      }
    };

    const resolveUrls = async () => {
      const mappedEntries = await Promise.all(
        urlsToResolve.map(async (rawUrl) => {
          attemptedCoverImageResolutionRef.current.add(rawUrl);
          const resolvedUrl = await resolveUrlFromStorage(rawUrl);
          return [rawUrl, resolvedUrl] as const;
        })
      );

      if (isCancelled) return;
      const nextMap: Record<string, string> = {};
      mappedEntries.forEach(([rawUrl, resolvedUrl]) => {
        if (!resolvedUrl) return;
        const normalizedRaw = rawUrl.trim();
        nextMap[rawUrl] = resolvedUrl;
        nextMap[normalizedRaw] = resolvedUrl;
      });

      if (Object.keys(nextMap).length > 0) {
        setResolvedCoverImageUrlsByRaw((previous) => ({
          ...previous,
          ...nextMap
        }));
      }
    };

    void resolveUrls();

    return () => {
      isCancelled = true;
    };
  }, [rawCoverImageUrls, resolvedCoverImageUrlsByRaw]);

  useEffect(() => {
    setIsInlineEditing(false);
    setInlineEditError(null);
    setInlineEditSuccess(null);
  }, [detail?.id]);

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
  const isEventHost = useMemo(() => {
    if (!detail || !user?.uid) return false;
    return detail.hostId === user.uid;
  }, [detail, user?.uid]);
  const eventStartForCancellation = detail?.startDateTime ?? detail?.eventTargetTime ?? null;
  const hasEventStarted =
    eventStartForCancellation instanceof Date &&
    eventStartForCancellation.getTime() <= Date.now();
  const sendHostTextToAttendees = useMemo(() => {
    if (!firebaseApp) return null;
    return httpsCallable<HostTextToAttendeesInput, HostTextToAttendeesResponse>(
      getFunctions(firebaseApp),
      "sendHostTextToAttendees"
    );
  }, []);
  const {
    createRefundRequest,
    loading: createRefundRequestLoading,
    error: createRefundRequestError,
    clearError: clearCreateRefundRequestError
  } = useCreateRefundRequest();

  const buildInlineEditDraft = (value: TailgateDetail): InlineEditDraft => {
    const start = value.startDateTime ?? value.eventTargetTime ?? new Date();
    return {
      eventName: value.eventName,
      description: value.description ?? "",
      eventDate: toDateInput(start),
      eventStartTime: toTimeInput(start),
      locationSummary:
        value.locationSummary ??
        resolveLocationString(value.locationRaw) ??
        "",
      ticketPrice:
        value.visibilityType === "open_paid" && typeof value.ticketPriceCents === "number"
          ? (value.ticketPriceCents / 100).toFixed(2)
          : "",
      capacity:
        typeof value.capacity === "number" && value.capacity > 0
          ? String(value.capacity)
          : ""
    };
  };

  useEffect(() => {
    if (!detail || isInlineEditing) return;
    setInlineEditDraft(buildInlineEditDraft(detail));
  }, [detail, isInlineEditing]);

  useEffect(() => {
    if (!inlineEditSuccess) return;
    const timer = setTimeout(() => setInlineEditSuccess(null), 4000);
    return () => clearTimeout(timer);
  }, [inlineEditSuccess]);

  useEffect(() => {
    setGuestInviteDraft({
      name: "",
      phone: "",
      email: ""
    });
    setRsvpPendingChoice(null);
    setRsvpError(null);
    setRsvpSuccess(null);
    setGuestInviteError(null);
    setGuestInviteSuccess(null);
  }, [detail?.id]);

  useEffect(() => {
    if (!guestInviteSuccess) return;
    const timer = setTimeout(() => setGuestInviteSuccess(null), 3000);
    return () => clearTimeout(timer);
  }, [guestInviteSuccess]);

  useEffect(() => {
    if (!rsvpSuccess) return;
    const timer = setTimeout(() => setRsvpSuccess(null), 3500);
    return () => clearTimeout(timer);
  }, [rsvpSuccess]);

  useEffect(() => {
    setIsHostBroadcastComposerOpen(false);
    setHostBroadcastMessage("");
    setHostBroadcastSending(false);
    setHostBroadcastFeedback(null);
    setIsCancelTailgateModalOpen(false);
    setCancelTailgateSubmitting(false);
    setCancelTailgateFeedback(null);
    setCancelRefundProgress(null);
  }, [detail?.id]);

  useEffect(() => {
    if (status !== "cancelled") return;
    setIsCancelTailgateModalOpen(false);
  }, [status]);

  useEffect(() => {
    setTicketQuantity(1);
    setCheckoutError(null);
    setGuestRefundTickets([]);
    setGuestRefundModalPurchaseReference(null);
    setGuestRefundReason("");
    setGuestRefundFeedback(null);
    clearCreateRefundRequestError();
  }, [detail?.id]);

  useEffect(() => {
    if (!guestRefundFeedback) return;
    const timer = setTimeout(() => setGuestRefundFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [guestRefundFeedback]);

  useEffect(() => {
    if (!detail || detail.visibilityType !== "open_paid" || isHostUser) {
      setHasConfirmedTicket(true);
      setTicketCheckState("confirmed");
      setConfirmedTicketCount(0);
      setGuestRefundTickets([]);
      return;
    }
    if (!user?.uid || !db) {
      setHasConfirmedTicket(false);
      setTicketCheckState("missing");
      setConfirmedTicketCount(0);
      setGuestRefundTickets([]);
      return;
    }

    setTicketCheckState("loading");
    let newTicketCount = 0;
    let legacyConfirmedCount = 0;
    let hasNewSnapshot = false;
    let hasLegacySnapshot = false;

    const applyTicketState = () => {
      if (!hasNewSnapshot || !hasLegacySnapshot) {
        return;
      }

      const useNewModel = newTicketCount > 0;
      if (useNewModel) {
        setHasConfirmedTicket(true);
        setTicketCheckState("confirmed");
        setConfirmedTicketCount(newTicketCount);
        return;
      }

      if (legacyConfirmedCount > 0) {
        setHasConfirmedTicket(true);
        setTicketCheckState("confirmed");
        setConfirmedTicketCount(legacyConfirmedCount);
        return;
      }
      setHasConfirmedTicket(false);
      setTicketCheckState("missing");
      setConfirmedTicketCount(0);
    };

    const eventHasStarted =
      detail.startDateTime instanceof Date && detail.startDateTime.getTime() <= Date.now();

    const newTicketsQuery = query(
      collection(db, "tickets"),
      where("tailgateId", "==", detail.id),
      where("attendeeUserId", "==", user.uid)
    );
    const legacyTicketsQuery = query(
      collection(db, "tailgateTickets"),
      where("tailgateId", "==", detail.id),
      where("userId", "==", user.uid)
    );

    const unsubscribeNew = onSnapshot(
      newTicketsQuery,
      (snapshot) => {
        const tickets = snapshot.docs
          .map((docSnap) => {
            const data = docSnap.data() as Record<string, unknown>;
            const ticketStatus = normalizeTicketLifecycleStatus(data.status);
            const quantity = Math.max(1, Math.floor(coerceNumber(data.quantity) ?? 1));
            const basePriceCents = coerceNumber(data.ticketPriceCents);
            const amountCents =
              coerceNumber(data.totalPaidCents) ??
              coerceNumber(data.amountPaidCents) ??
              coerceNumber(data.totalAmountCents) ??
              (typeof basePriceCents === "number" ? basePriceCents * quantity : undefined);

            const refundRecord = asRecord(data.refund);
            const refundRequestRecord = asRecord(data.refundRequest);
            const purchaseRecord = asRecord(data.purchase);
            const purchaseReference =
              firstString(
                data.purchaseId,
                data.ticketPurchaseId,
                data.ticketPurchaseRef,
                data.purchaseRef,
                data.orderId,
                data.checkoutSessionId,
                data.paymentIntentId,
                purchaseRecord?.id,
                purchaseRecord?.purchaseId
              ) ?? docSnap.id;
            const refundRequestStatus = normalizeRefundRequestStatus(
              firstString(
                data.refundRequestStatus,
                data.refundStatus,
                data.refundState,
                refundRecord?.status,
                refundRecord?.requestStatus,
                refundRequestRecord?.status
              )
            );

            const refundedAt = normalizeDate(
              data.refundedAt ??
                data.refundProcessedAt ??
                refundRecord?.refundedAt ??
                refundRequestRecord?.approvedAt
            );
            const isConfirmedTicket = isConfirmedPaidTicketStatus(ticketStatus);
            const isRefunded =
              isRefundedTicketStatus(ticketStatus) ||
              refundRequestStatus === "approved" ||
              refundedAt !== null;

            const nextTicket: GuestRefundTicket = {
              ticketId: docSnap.id,
              ticketCode: firstString(data.ticketCode) ?? "—",
              purchaseReference,
              purchaseNumber: firstString(
                data.purchaseNumber,
                data.orderNumber,
                data.receiptNumber,
                purchaseRecord?.purchaseNumber,
                purchaseRecord?.orderNumber
              ),
              quantity,
              amountCents,
              ticketStatus,
              refundRequestStatus,
              refundRequestId: firstString(
                data.refundRequestId,
                refundRecord?.refundRequestId,
                refundRecord?.requestId,
                refundRequestRecord?.refundRequestId,
                refundRequestRecord?.id
              ),
              guestReason: firstString(
                data.refundGuestReason,
                data.guestReason,
                refundRecord?.guestReason,
                refundRequestRecord?.guestReason
              ),
              hostDecisionReason: firstString(
                data.refundHostDecisionReason,
                data.hostDecisionReason,
                data.refundDecisionReason,
                refundRecord?.hostDecisionReason,
                refundRequestRecord?.hostDecisionReason
              ),
              isConfirmedTicket,
              isRefunded,
              isEligibleForRequest:
                isConfirmedTicket &&
                !isRefunded &&
                refundRequestStatus === null &&
                !eventHasStarted,
              createdAtMs:
                normalizeDate(data.createdAt)?.getTime() ??
                normalizeDate(data.updatedAt)?.getTime() ??
                0
            };
            return nextTicket;
          })
          .sort((left, right) => right.createdAtMs - left.createdAtMs);

        newTicketCount = tickets.filter((ticket) => ticket.isConfirmedTicket).length;
        setGuestRefundTickets(tickets);
        hasNewSnapshot = true;
        applyTicketState();
      },
      (snapshotError) => {
        console.error("Ticket lookup failed", snapshotError);
        setGuestRefundTickets([]);
        hasNewSnapshot = true;
        applyTicketState();
      }
    );
    const unsubscribeLegacy = onSnapshot(
      legacyTicketsQuery,
      (snapshot) => {
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
      unsubscribeLegacy();
    };
  }, [detail, isHostUser, user?.uid]);

  useEffect(() => {
    if (!detail || !db || !isHostUser || detail.visibilityType !== "open_paid") {
      setLiveCheckedInCount(null);
      return;
    }

    let hasNewSnapshot = false;
    let hasLegacySnapshot = false;
    let newCheckedInTotal = 0;
    let legacyCheckedInTotal = 0;

    const applyCheckedInTotal = () => {
      if (!hasNewSnapshot || !hasLegacySnapshot) return;
      const useNewModel = newCheckedInTotal > 0;
      setLiveCheckedInCount(useNewModel ? newCheckedInTotal : legacyCheckedInTotal);
    };

    const newTicketsQuery = query(
      collection(db, "tickets"),
      where("tailgateId", "==", detail.id),
      where("status", "==", "checked_in")
    );
    const legacyTicketsQuery = query(
      collection(db, "tailgateTickets"),
      where("tailgateId", "==", detail.id),
      where("status", "==", "confirmed")
    );

    const unsubscribeNew = onSnapshot(
      newTicketsQuery,
      (snapshot) => {
        newCheckedInTotal = snapshot.docs.reduce((sum, docSnap) => {
          const data = docSnap.data() as Record<string, unknown>;
          const checkedInCount = coerceNumber(data.checkedInCount);
          if (typeof checkedInCount === "number" && checkedInCount > 0) {
            return sum + Math.floor(checkedInCount);
          }
          return sum + 1;
        }, 0);
        hasNewSnapshot = true;
        applyCheckedInTotal();
      },
      (snapshotError) => {
        console.error("Host checked-in count lookup failed (new model)", snapshotError);
        hasNewSnapshot = true;
        applyCheckedInTotal();
      }
    );
    const unsubscribeLegacy = onSnapshot(
      legacyTicketsQuery,
      (snapshot) => {
        legacyCheckedInTotal = snapshot.docs.reduce((sum, docSnap) => {
          const data = docSnap.data() as Record<string, unknown>;
          const checkedInCount = coerceNumber(data.checkedInCount);
          if (typeof checkedInCount === "number" && checkedInCount > 0) {
            return sum + Math.floor(checkedInCount);
          }
          return sum;
        }, 0);
        hasLegacySnapshot = true;
        applyCheckedInTotal();
      },
      (snapshotError) => {
        console.error("Host checked-in count lookup failed (legacy model)", snapshotError);
        hasLegacySnapshot = true;
        applyCheckedInTotal();
      }
    );

    return () => {
      unsubscribeNew();
      unsubscribeLegacy();
    };
  }, [detail, isHostUser]);

  const locationRawRecord = asRecord(detail?.locationRaw);
  const locationPinRecord = asRecord(locationRawRecord?.pin);
  const exactPinLat = coerceNumber(locationPinRecord?.lat);
  const exactPinLng = coerceNumber(locationPinRecord?.lng);
  const hasExactPin = typeof exactPinLat === "number" && typeof exactPinLng === "number";
  const resolvedLocationText =
    detail?.locationSummary ?? resolveLocationString(detail?.locationRaw);
  const displayLocationLabel =
    resolvedLocationText && !isCoordinateString(resolvedLocationText)
      ? resolvedLocationText
      : undefined;
  const exactPinCoords = hasExactPin ? { lat: exactPinLat, lng: exactPinLng } : null;
  const locationCoords = exactPinCoords ?? detail?.locationCoords ?? null;
  const droppedPinLabel = locationCoords
    ? "Pin dropped by host. View exact location on map."
    : null;
  const locationLabel =
    droppedPinLabel ??
    displayLocationLabel ??
    (locationCoords ? "Pin dropped in map" : "Location not set");
  const locationDirectionQuery = locationCoords
    ? `${locationCoords.lat},${locationCoords.lng}`
    : resolvedLocationText ?? "";
  const canOpenMaps = locationDirectionQuery.trim().length > 0;
  const coverImageUrls = rawCoverImageUrls;
  const safeCoverIndex =
    coverImageUrls.length > 0
      ? Math.min(activeCoverIndex, coverImageUrls.length - 1)
      : 0;
  const activeCoverImageRaw =
    coverImageUrls[safeCoverIndex] ?? coverImageUrls[0] ?? null;
  const activeCoverImageUrl = activeCoverImageRaw
    ? getDisplayCoverImageUrl(activeCoverImageRaw)
    : null;
  const hasMultipleCoverImages = coverImageUrls.length > 1;
  const activeCoverImageErrorUrl = activeCoverImageRaw
    ? coverImageLoadErrorsByRaw[activeCoverImageRaw] ??
      coverImageLoadErrorsByRaw[activeCoverImageRaw.trim()] ??
      null
    : null;
  const activeCoverImageLoadingKey =
    activeCoverImageRaw && activeCoverImageUrl
      ? `${activeCoverImageRaw}:${activeCoverImageUrl}`
      : null;
  const activeCoverImageLoaded = activeCoverImageLoadingKey
    ? Boolean(loadedCoverImagesByKey[activeCoverImageLoadingKey])
    : false;
  const isRecoveringActiveCoverImage = activeCoverImageRaw
    ? Boolean(
        recoveringCoverImageByRaw[activeCoverImageRaw] ??
          recoveringCoverImageByRaw[activeCoverImageRaw.trim()]
      )
    : false;
  const hasActiveCoverImageLoadError = Boolean(activeCoverImageErrorUrl);
  const showActiveCoverImageLoading =
    Boolean(activeCoverImageUrl) &&
    !activeCoverImageLoaded &&
    (!hasActiveCoverImageLoadError || isRecoveringActiveCoverImage);
  const mapUrl = locationCoords
    ? buildMapEmbedUrl(locationCoords, MAPS_API_KEY)
    : null;
  const checkoutResult = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const value = params.get("checkout");
    return value === "success" || value === "cancel" ? value : null;
  }, [location.search]);
  const isEmbeddedMapPanel = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("embed") === "discover-map";
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
  const userAttendee = useMemo(() => {
    if (!detail || !user?.uid) return null;
    return detail.attendees.find((attendee) => attendee.userId === user.uid) ?? null;
  }, [detail, user?.uid]);
  const userRsvpStatus: AttendeeStatus = userAttendee?.status ?? "Pending";
  const rsvpStatusMeta = useMemo(() => {
    if (userRsvpStatus === "Attending") {
      return {
        label: "Going",
        description: "You are in. The host sees you as attending.",
        className: "tailgate-details-rsvp-status-going"
      };
    }
    if (userRsvpStatus === "Not Attending") {
      return {
        label: "Not Going",
        description: "You are marked as not attending.",
        className: "tailgate-details-rsvp-status-not-going"
      };
    }
    return {
      label: "Pending",
      description: "Choose an option so the host can plan accurately.",
      className: "tailgate-details-rsvp-status-pending"
    };
  }, [userRsvpStatus]);

  const expectationChips = useMemo(() => {
    if (!detail?.expectations) return [];
    return (Object.keys(expectationChipMap) as ExpectationKey[])
      .filter((key) => detail.expectations?.[key])
      .map((key) => expectationChipMap[key]);
  }, [detail?.expectations]);

  const ticketPriceCents = detail?.ticketPriceCents ?? 0;
  const isPaidTailgate = detail?.visibilityType === "open_paid";
  const ticketsSold = detail?.ticketsSold ?? attendeeCounts.going;
  const checkedInCountForHost = liveCheckedInCount ?? detail?.checkedInCount;
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
  const isTicketSalesClosed =
    detail?.visibilityType === "open_paid" &&
    detail.ticketSalesCloseAt instanceof Date &&
    detail.ticketSalesCloseAt.getTime() <= Date.now();
  const maxSelectableQuantity =
    capacityRemaining !== null
      ? Math.max(1, Math.min(MAX_TICKET_QUANTITY, capacityRemaining))
      : MAX_TICKET_QUANTITY;
  const showTicketPurchase =
    detail?.visibilityType === "open_paid" &&
    !isHostUser &&
    status !== "cancelled";
  const guestRefundPurchases = useMemo(() => {
    const grouped = new Map<string, GuestRefundTicket[]>();
    guestRefundTickets.forEach((ticket) => {
      const group = grouped.get(ticket.purchaseReference) ?? [];
      group.push(ticket);
      grouped.set(ticket.purchaseReference, group);
    });

    return Array.from(grouped.entries())
      .map(([purchaseReference, ticketsInPurchase]) => {
        const representativeTicket =
          ticketsInPurchase.find((ticket) => ticket.isEligibleForRequest) ?? ticketsInPurchase[0];
        const quantity = ticketsInPurchase.reduce((sum, ticket) => sum + ticket.quantity, 0);
        const hasCompleteAmount = ticketsInPurchase.every(
          (ticket) => typeof ticket.amountCents === "number"
        );
        const amountCents = hasCompleteAmount
          ? ticketsInPurchase.reduce(
              (sum, ticket) => sum + (typeof ticket.amountCents === "number" ? ticket.amountCents : 0),
              0
            )
          : undefined;
        const hasPending = ticketsInPurchase.some(
          (ticket) => ticket.refundRequestStatus === "pending"
        );
        const hasApproved = ticketsInPurchase.some(
          (ticket) => ticket.refundRequestStatus === "approved" || ticket.isRefunded
        );
        const hasDenied = ticketsInPurchase.some(
          (ticket) => ticket.refundRequestStatus === "denied"
        );
        const refundRequestStatus: RefundRequestStatus = hasPending
          ? "pending"
          : hasApproved
          ? "approved"
          : hasDenied
          ? "denied"
          : null;
        const isEligibleForRequest =
          !hasPending &&
          !hasApproved &&
          ticketsInPurchase.some((ticket) => ticket.isEligibleForRequest);
        const createdAtMs = ticketsInPurchase.reduce(
          (latest, ticket) => Math.max(latest, ticket.createdAtMs),
          0
        );

        return {
          purchaseReference,
          purchaseNumber: representativeTicket.purchaseNumber,
          representativeTicketId: representativeTicket.ticketId,
          quantity,
          amountCents,
          refundRequestStatus,
          refundRequestId:
            representativeTicket.refundRequestId ??
            ticketsInPurchase.find((ticket) => ticket.refundRequestId)?.refundRequestId,
          hostDecisionReason:
            ticketsInPurchase.find((ticket) => ticket.hostDecisionReason?.trim())?.hostDecisionReason,
          isRefunded: hasApproved,
          isEligibleForRequest,
          createdAtMs
        } as GuestRefundPurchase;
      })
      .sort((left, right) => right.createdAtMs - left.createdAtMs);
  }, [guestRefundTickets]);
  const selectedGuestRefundPurchase = useMemo(
    () =>
      guestRefundModalPurchaseReference
        ? guestRefundPurchases.find(
            (purchase) => purchase.purchaseReference === guestRefundModalPurchaseReference
          ) ?? null
        : null,
    [guestRefundModalPurchaseReference, guestRefundPurchases]
  );
  const canShowGuestRefundSection =
    showTicketPurchase && Boolean(user) && guestRefundPurchases.length > 0;
  const canPurchaseTickets =
    showTicketPurchase &&
    Boolean(user) &&
    (ticketCheckState === "missing" || ticketCheckState === "confirmed") &&
    !isSoldOut &&
    !isTicketSalesClosed;
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
    isSoldOut
      ? "This tailgate is sold out."
      : isTicketSalesClosed
      ? "Ticket sales are closed for this event."
      : !user && showTicketPurchase
      ? "Sign in to purchase tickets."
      : ticketCheckState === "loading"
      ? "Checking your ticket status..."
      : ticketCheckState === "confirmed"
      ? hasConfirmedTicket && confirmedTicketCount > 0
        ? `You already have ${confirmedTicketCount} ticket${confirmedTicketCount === 1 ? "" : "s"}.`
        : "Your tickets are confirmed."
      : "Continue to checkout to purchase tickets.";
  const timelineBaseEventTime = detail?.eventTargetTime ?? detail?.startDateTime ?? null;
  const hasTimelineSteps = timelineSteps.length > 0;
  const timelineEnabledForEvent =
    detail?.timelineEnabled === true ||
    detail?.schedulePublished === true ||
    hasTimelineSteps;
  const canViewTimeline = detail
    ? isHostUser
      ? timelineEnabledForEvent
      : detail.schedulePublished === true && timelineEnabledForEvent
    : false;
  const timelinePublishLabel = detail?.schedulePublished
    ? "Schedule is visible to attendees."
    : "Schedule is hidden from attendees.";
  const canEditCancelledEvent = status !== "cancelled";
  const canOpenCheckIn = detail?.visibilityType === "open_paid" && status !== "cancelled";
  const showGuestRsvpSection =
    detail?.visibilityType === "private" && !isHostUser && status !== "cancelled";
  const canShowWhosComingSection = detail?.visibilityType === "private";
  const canManageGuestInvites = isHostUser && detail?.visibilityType === "private";
  const hostBroadcastCharacterCount = hostBroadcastMessage.length;
  const canSendHostBroadcast =
    isEventHost &&
    hostBroadcastMessage.trim().length > 0 &&
    hostBroadcastCharacterCount <= MAX_HOST_BROADCAST_MESSAGE_LENGTH &&
    !hostBroadcastSending &&
    Boolean(sendHostTextToAttendees);
  const refundProgressMessage = useMemo(() => {
    if (!isHostUser || !isPaidTailgate || status !== "cancelled") return null;
    if (!cancelRefundProgress || cancelRefundProgress.loading) {
      return "Refund status is being updated. This may take a few minutes.";
    }
    if (cancelRefundProgress.error) {
      return "Refunds in progress. This may take a few minutes.";
    }
    if (cancelRefundProgress.totalPaid <= 0) {
      return "No paid tickets were found for refund.";
    }
    if (cancelRefundProgress.refunded >= cancelRefundProgress.totalPaid) {
      return `Refunds completed. ${cancelRefundProgress.totalPaid} ticket${
        cancelRefundProgress.totalPaid === 1 ? "" : "s"
      } refunded.`;
    }
    return `Refunds in progress. ${cancelRefundProgress.refunded} of ${
      cancelRefundProgress.totalPaid
    } ticket${cancelRefundProgress.totalPaid === 1 ? "" : "s"} refunded.`;
  }, [cancelRefundProgress, isHostUser, isPaidTailgate, status]);

  useEffect(() => {
    if (!detail || !db || !isHostUser || !isPaidTailgate || status !== "cancelled") {
      setCancelRefundProgress(null);
      return;
    }

    setCancelRefundProgress({
      loading: true,
      totalPaid: 0,
      refunded: 0,
      error: false
    });

    let hasNewSnapshot = false;
    let hasLegacySnapshot = false;
    let newErrored = false;
    let legacyErrored = false;
    let newDocCount = 0;
    let newTotalPaid = 0;
    let newRefunded = 0;
    let legacyTotalPaid = 0;
    let legacyRefunded = 0;

    const applyRefundProgress = () => {
      if (!hasNewSnapshot || !hasLegacySnapshot) return;
      const useNewModel = newDocCount > 0;
      const totalPaid = useNewModel ? newTotalPaid : legacyTotalPaid;
      const refunded = useNewModel ? newRefunded : legacyRefunded;
      const errored = useNewModel ? newErrored : legacyErrored;
      setCancelRefundProgress({
        loading: false,
        totalPaid,
        refunded,
        error: errored
      });
    };

    const newTicketsQuery = query(
      collection(db, "tickets"),
      where("tailgateId", "==", detail.id)
    );
    const legacyTicketsQuery = query(
      collection(db, "tailgateTickets"),
      where("tailgateId", "==", detail.id)
    );

    const unsubscribeNew = onSnapshot(
      newTicketsQuery,
      (snapshot) => {
        newDocCount = snapshot.size;
        newTotalPaid = 0;
        newRefunded = 0;
        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data() as Record<string, unknown>;
          const statusLabel = normalizeTicketLifecycleStatus(data.status);
          const quantity = Math.max(1, Math.floor(coerceNumber(data.quantity) ?? 1));
          const refundRecord = asRecord(data.refund);
          const refundRequestRecord = asRecord(data.refundRequest);
          const refundRequestStatus = normalizeRefundRequestStatus(
            firstString(
              data.refundRequestStatus,
              data.refundStatus,
              data.refundState,
              refundRecord?.status,
              refundRecord?.requestStatus,
              refundRequestRecord?.status
            )
          );
          const isRefunded =
            isRefundedTicketStatus(statusLabel) || refundRequestStatus === "approved";
          const isPaid = isPaidTicketStatus(statusLabel) || isRefunded;
          if (isPaid) {
            newTotalPaid += quantity;
          }
          if (isRefunded) {
            newRefunded += quantity;
          }
        });
        hasNewSnapshot = true;
        applyRefundProgress();
      },
      (snapshotError) => {
        console.error("Failed to load refund progress (new tickets)", snapshotError);
        newErrored = true;
        hasNewSnapshot = true;
        applyRefundProgress();
      }
    );

    const unsubscribeLegacy = onSnapshot(
      legacyTicketsQuery,
      (snapshot) => {
        legacyTotalPaid = 0;
        legacyRefunded = 0;
        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data() as Record<string, unknown>;
          const statusLabel = normalizeTicketLifecycleStatus(data.status);
          const quantity = Math.max(1, Math.floor(coerceNumber(data.quantity) ?? 1));
          const refundRecord = asRecord(data.refund);
          const refundRequestStatus = normalizeRefundRequestStatus(
            firstString(
              data.refundRequestStatus,
              data.refundStatus,
              data.refundState,
              refundRecord?.status,
              refundRecord?.requestStatus
            )
          );
          const paymentStatus = String(data.paymentStatus ?? "").trim().toLowerCase();
          const paidFlag = data.paid === true || paymentStatus === "paid";
          const isRefunded =
            isRefundedTicketStatus(statusLabel) || refundRequestStatus === "approved";
          const isPaid = statusLabel === "confirmed" || paidFlag || isRefunded;
          if (isPaid) {
            legacyTotalPaid += quantity;
          }
          if (isRefunded) {
            legacyRefunded += quantity;
          }
        });
        hasLegacySnapshot = true;
        applyRefundProgress();
      },
      (snapshotError) => {
        console.error("Failed to load refund progress (legacy tickets)", snapshotError);
        legacyErrored = true;
        hasLegacySnapshot = true;
        applyRefundProgress();
      }
    );

    return () => {
      unsubscribeNew();
      unsubscribeLegacy();
    };
  }, [db, detail, isHostUser, isPaidTailgate, status]);

  useEffect(() => {
    setTicketQuantity((current) =>
      Math.max(1, Math.min(current, maxSelectableQuantity))
    );
  }, [maxSelectableQuantity]);

  useEffect(() => {
    if (status !== "cancelled") return;
    if (!isInlineEditing) return;
    setIsInlineEditing(false);
    setInlineEditError("Cancelled events can't be edited.");
  }, [isInlineEditing, status]);

  const openInlineEventEditor = (scrollToSection = false) => {
    if (!detail) return;
    if (status === "cancelled") {
      setInlineEditError("Cancelled events can't be edited.");
      setInlineEditSuccess(null);
      setIsInlineEditing(false);
      return;
    }
    setInlineEditDraft(buildInlineEditDraft(detail));
    setInlineEditError(null);
    setInlineEditSuccess(null);
    setIsInlineEditing(true);
    if (scrollToSection) {
      requestAnimationFrame(() => {
        eventSnapshotSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    }
  };

  const cancelInlineEventEditor = () => {
    if (!detail) return;
    setInlineEditDraft(buildInlineEditDraft(detail));
    setInlineEditError(null);
    setIsInlineEditing(false);
  };

  const saveInlineEventDetails = async () => {
    if (!db || !id || !detail) {
      setInlineEditError("Inline editing is unavailable right now.");
      return;
    }
    if (status === "cancelled") {
      setInlineEditError("Cancelled events can't be edited.");
      return;
    }

    const nextName = inlineEditDraft.eventName.trim();
    const nextLocation = inlineEditDraft.locationSummary.trim();
    const nextDescription = inlineEditDraft.description.trim();
    if (!nextName) {
      setInlineEditError("Event name is required.");
      return;
    }
    if (!nextLocation) {
      setInlineEditError("Location is required.");
      return;
    }

    const startDateTime = combineDateAndTime(
      inlineEditDraft.eventDate,
      inlineEditDraft.eventStartTime
    );
    if (!startDateTime) {
      setInlineEditError("Set a valid event date and start time.");
      return;
    }

    const updates: Record<string, unknown> = {
      eventName: nextName,
      name: nextName,
      description: nextDescription,
      startDateTime: startDateTime,
      dateTime: startDateTime,
      eventTargetTime: startDateTime,
      locationSummary: nextLocation,
      updatedAt: new Date()
    };

    const existingLocation = asRecord(detail.locationRaw);
    updates.location = existingLocation
      ? {
          ...existingLocation,
          description: nextLocation,
          formatted: nextLocation,
          formattedAddress: nextLocation,
          address: nextLocation,
          text: nextLocation,
          name: nextLocation
        }
      : nextLocation;

    if (detail.visibilityType === "open_paid") {
      const priceCents = parsePriceToCents(inlineEditDraft.ticketPrice);
      if (!priceCents || priceCents < 2000) {
        setInlineEditError("Paid events require a ticket price of at least $20.");
        return;
      }
      updates.priceCents = priceCents;
      updates.ticketPriceCents = priceCents;

      if (inlineEditDraft.capacity.trim()) {
        const parsedCapacity = parseCapacity(inlineEditDraft.capacity);
        if (!parsedCapacity) {
          setInlineEditError("Capacity must be a whole number greater than 0.");
          return;
        }
        updates.capacity = parsedCapacity;
      } else {
        updates.capacity = null;
      }
    }

    setInlineEditSaving(true);
    setInlineEditError(null);
    try {
      await updateDoc(doc(db, "tailgateEvents", id), updates);
      setInlineEditSuccess("Event details updated.");
      setIsInlineEditing(false);
    } catch (saveError) {
      console.error("Failed to save inline event details", saveError);
      setInlineEditError("Unable to save event details. Please try again.");
    } finally {
      setInlineEditSaving(false);
    }
  };

  const updateGuestRsvp = async (nextStatus: GuestRsvpChoice) => {
    if (!detail || !id || !db || !user?.uid || isHostUser || rsvpSaving) return;
    if (userRsvpStatus === nextStatus) return;

    const eventRef = doc(db, "tailgateEvents", id);
    setRsvpSaving(true);
    setRsvpPendingChoice(nextStatus);
    setRsvpError(null);
    setRsvpSuccess(null);

    try {
      const snapshot = await getDoc(eventRef);
      if (!snapshot.exists()) {
        setRsvpError("Tailgate not found.");
        return;
      }

      const eventData = snapshot.data() as Record<string, unknown>;
      const attendeesRaw = Array.isArray(eventData.attendees)
        ? [...eventData.attendees]
        : [];
      const attendeeIndex = attendeesRaw.findIndex((entry) => {
        const attendeeRecord = asRecord(entry);
        if (!attendeeRecord) return false;
        const attendeeUserId = firstString(
          attendeeRecord.userId,
          attendeeRecord.uid,
          attendeeRecord.id
        );
        return attendeeUserId === user.uid;
      });

      const fallbackName = firstString(user.displayName, user.email) ?? "Guest";

      if (attendeeIndex >= 0) {
        const existing = asRecord(attendeesRaw[attendeeIndex]) ?? {};
        attendeesRaw[attendeeIndex] = {
          ...existing,
          id: firstString(existing.id, user.uid) ?? user.uid,
          userId:
            firstString(existing.userId, existing.uid, existing.id, user.uid) ??
            user.uid,
          name:
            firstString(
              existing.name,
              existing.displayName,
              user.displayName,
              user.email
            ) ?? fallbackName,
          displayName:
            firstString(
              existing.displayName,
              existing.name,
              user.displayName,
              user.email
            ) ?? fallbackName,
          status: nextStatus
        };
      } else {
        attendeesRaw.push({
          id: user.uid,
          userId: user.uid,
          name: fallbackName,
          displayName: fallbackName,
          status: nextStatus
        });
      }

      await updateDoc(eventRef, { attendees: attendeesRaw });
      setDetail((previous) => {
        if (!previous) return previous;
        return {
          ...previous,
          attendees: normalizeAttendees(
            attendeesRaw,
            previous.hostId,
            previous.hostName
          )
        };
      });
      setRsvpSuccess(nextStatus === "Attending" ? "RSVP updated to Going." : "RSVP updated to Not Going.");
    } catch (rsvpUpdateError) {
      console.error("Failed to update RSVP", rsvpUpdateError);
      setRsvpError("Unable to update RSVP right now.");
    } finally {
      setRsvpSaving(false);
      setRsvpPendingChoice(null);
    }
  };

  const confirmGuestRsvpUpdate = (nextStatus: GuestRsvpChoice) => {
    if (!user || rsvpSaving || userRsvpStatus === nextStatus) return;
    const nextLabel = nextStatus === "Attending" ? "Going" : "Not Going";
    void (async () => {
      const shouldContinue = await confirm({
        title: "Change RSVP?",
        message: `Are you sure you want to change your RSVP to ${nextLabel}?`,
        confirmLabel: `Yes, ${nextLabel}`,
        cancelLabel: "Keep current",
        tone: nextStatus === "Not Attending" ? "danger" : "default"
      });
      if (!shouldContinue) return;
      await updateGuestRsvp(nextStatus);
    })();
  };

  const openMaps = () => {
    if (!canOpenMaps) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      locationDirectionQuery
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const goToPreviousCoverImage = () => {
    if (!hasMultipleCoverImages) return;
    setActiveCoverIndex((current) =>
      current <= 0 ? coverImageUrls.length - 1 : current - 1
    );
  };

  const goToNextCoverImage = () => {
    if (!hasMultipleCoverImages) return;
    setActiveCoverIndex((current) =>
      current >= coverImageUrls.length - 1 ? 0 : current + 1
    );
  };

  const handleActiveCoverImageError = (rawUrl: string, renderedUrl: string) => {
    const normalizedRaw = rawUrl.trim();
    setRecoveringCoverImageByRaw((previous) => ({
      ...previous,
      [rawUrl]: true,
      [normalizedRaw]: true
    }));

    void (async () => {
      const recovered = await createCoverBlobFallback(rawUrl);
      setRecoveringCoverImageByRaw((previous) => {
        const next = { ...previous };
        delete next[rawUrl];
        delete next[normalizedRaw];
        return next;
      });

      if (recovered) {
        setCoverImageLoadErrorsByRaw((previous) => {
          const next = { ...previous };
          delete next[rawUrl];
          delete next[normalizedRaw];
          return next;
        });
        return;
      }

      setCoverImageLoadErrorsByRaw((previous) => ({
        ...previous,
        [rawUrl]: renderedUrl,
        [normalizedRaw]: renderedUrl
      }));
    })();
  };

  const handleCheckoutPress = async () => {
    if (!detail || !canPurchaseTickets || isCheckoutLoading) {
      return;
    }
    if (!user) {
      setCheckoutError("Please sign in to purchase tickets.");
      return;
    }
    if (isTicketSalesClosed) {
      setCheckoutError("Ticket sales are closed for this event.");
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
      } else if (message.includes("SALES_CLOSED")) {
        setCheckoutError("Ticket sales are closed for this event.");
      } else if (message.includes("unauthenticated")) {
        setCheckoutError("Please sign in again.");
      } else {
        setCheckoutError("Unable to start checkout. Please try again.");
      }
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const openGuestRefundModal = (purchaseReference: string) => {
    setGuestRefundModalPurchaseReference(purchaseReference);
    setGuestRefundReason("");
    setGuestRefundFeedback(null);
    clearCreateRefundRequestError();
  };

  const closeGuestRefundModal = () => {
    if (createRefundRequestLoading) return;
    setGuestRefundModalPurchaseReference(null);
    setGuestRefundReason("");
    clearCreateRefundRequestError();
  };

  const submitGuestRefundRequest = async () => {
    if (!selectedGuestRefundPurchase || createRefundRequestLoading) {
      return;
    }

    try {
      const result = await createRefundRequest({
        ticketId: selectedGuestRefundPurchase.representativeTicketId,
        guestReason: guestRefundReason.trim() || undefined
      });

      setGuestRefundTickets((previous) =>
        previous.map((ticket) =>
          ticket.purchaseReference === selectedGuestRefundPurchase.purchaseReference
            ? {
                ...ticket,
                refundRequestStatus: "pending",
                refundRequestId:
                  result?.refundRequestId ?? ticket.refundRequestId ?? `pending-${ticket.ticketId}`,
                guestReason: guestRefundReason.trim() || ticket.guestReason,
                isEligibleForRequest: false
              }
            : ticket
        )
      );
      setGuestRefundFeedback({
        tone: "success",
        text: "Refund requested • Waiting for host decision."
      });
      setGuestRefundModalPurchaseReference(null);
      setGuestRefundReason("");
      clearCreateRefundRequestError();
    } catch (requestError) {
      console.error("Failed to request refund", requestError);
      setGuestRefundFeedback({
        tone: "error",
        text: "Unable to process refund. Try again."
      });
    }
  };

  const dropLocationPin = () => {
    if (!detail || !id || !db) return;
    if (!navigator.geolocation) {
      void showDialogAlert({
        title: "Location unavailable",
        message: "Geolocation is not supported in this browser."
      });
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
          await showDialogAlert({
            title: "Pin failed",
            message: "Unable to save location pin. Try again."
          });
        } finally {
          setPinning(false);
        }
      },
      (geoError) => {
        console.error("Failed to get current location", geoError);
        void showDialogAlert({
          title: "Location access denied",
          message: "Unable to access your location."
        });
        setPinning(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const openCancelTailgateModal = () => {
    if (!isHostUser || status === "cancelled" || cancelTailgateSubmitting || hasEventStarted) return;
    setIsCancelTailgateModalOpen(true);
  };

  const closeCancelTailgateModal = () => {
    if (cancelTailgateSubmitting) return;
    setIsCancelTailgateModalOpen(false);
  };

  const cancelTailgate = async () => {
    if (!detail || !id || !db) return;
    if (!isHostUser || cancelTailgateSubmitting || status === "cancelled") return;
    if (hasEventStarted) {
      setCancelTailgateFeedback({
        tone: "error",
        text: "Events cannot be cancelled after the start time."
      });
      setIsCancelTailgateModalOpen(false);
      return;
    }

    setCancelTailgateSubmitting(true);
    setCancelTailgateFeedback(null);
    try {
      await updateDoc(doc(db, "tailgateEvents", id), {
        status: "cancelled",
        cancelledAt: serverTimestamp()
      });
      setIsCancelTailgateModalOpen(false);
      setCancelTailgateFeedback({
        tone: "success",
        text: isPaidTailgate
          ? "Tailgate cancelled. Refunds are now processing automatically."
          : "Tailgate cancelled."
      });
    } catch (cancelError) {
      console.error("Failed to cancel tailgate", cancelError);
      setCancelTailgateFeedback({
        tone: "error",
        text: "Unable to cancel event. Try again."
      });
    } finally {
      setCancelTailgateSubmitting(false);
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
    const confirmed = await confirm({
      title: "Delete timeline step?",
      message: "This timeline step will be permanently removed.",
      confirmLabel: "Delete",
      cancelLabel: "Keep step",
      tone: "danger"
    });
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

  const enableTimelineForEvent = async () => {
    if (!db || !id || !detail || enablingTimeline) return;
    setEnablingTimeline(true);
    try {
      setTimelineError(null);
      await updateDoc(doc(db, "tailgateEvents", id), {
        timelineEnabled: true,
        schedulePublished: detail.schedulePublished === true,
        updatedAt: new Date()
      });
    } catch (enableError) {
      console.error("Failed to enable timeline", enableError);
      setTimelineError("Unable to enable schedule right now.");
    } finally {
      setEnablingTimeline(false);
    }
  };

  const addGuestInvite = async () => {
    if (!db || !id || !detail) {
      setGuestInviteError("Guest invites are unavailable right now.");
      return;
    }
    if (!canManageGuestInvites) {
      setGuestInviteError("Manual invites are only available for invite-only tailgates.");
      return;
    }

    const name = guestInviteDraft.name.trim();
    const phone = formatPhoneInput(guestInviteDraft.phone);
    const phoneDigits = toPhoneDigits(phone);
    const email = guestInviteDraft.email.trim().toLowerCase();

    if (!name) {
      setGuestInviteError("Guest name is required.");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setGuestInviteError("Enter a valid email address.");
      return;
    }

    const duplicateExists = detail.attendees.some((attendee) => {
      if (attendee.status === "Host") return false;
      const attendeeName = attendee.name.trim().toLowerCase();
      const attendeeEmail = attendee.email?.trim().toLowerCase() ?? "";
      const attendeePhoneDigits = toPhoneDigits(attendee.phone ?? "");

      if (email && attendeeEmail && attendeeEmail === email) {
        return true;
      }
      if (phoneDigits && attendeePhoneDigits && attendeePhoneDigits === phoneDigits) {
        return true;
      }
      return !email && !phoneDigits && attendeeName === name.toLowerCase();
    });

    if (duplicateExists) {
      setGuestInviteError("That guest is already invited.");
      return;
    }

    const invitePayload: Record<string, unknown> = {
      id: createInviteIdentifier(),
      token: createInviteIdentifier(),
      name,
      status: "Pending",
      invitedAt: new Date().toISOString()
    };
    if (phoneDigits.length > 0) {
      invitePayload.phone = phone;
    }
    if (email) {
      invitePayload.email = email;
    }

    setGuestInviteSaving(true);
    setGuestInviteError(null);
    try {
      await updateDoc(doc(db, "tailgateEvents", id), {
        attendees: arrayUnion(invitePayload),
        updatedAt: new Date()
      });
      setGuestInviteDraft({
        name: "",
        phone: "",
        email: ""
      });
      setGuestInviteSuccess("Guest invited.");
    } catch (inviteError) {
      console.error("Failed to add guest invite", inviteError);
      setGuestInviteError("Unable to invite guest. Please try again.");
    } finally {
      setGuestInviteSaving(false);
    }
  };

  const openHostBroadcastComposer = () => {
    setIsHostBroadcastComposerOpen(true);
    setHostBroadcastFeedback(null);
  };

  const closeHostBroadcastComposer = () => {
    setIsHostBroadcastComposerOpen(false);
    setHostBroadcastFeedback(null);
  };

  const handleHostBroadcastMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const nextValue = event.target.value.slice(0, MAX_HOST_BROADCAST_MESSAGE_LENGTH);
    setHostBroadcastMessage(nextValue);
    if (hostBroadcastFeedback) {
      setHostBroadcastFeedback(null);
    }
  };

  const sendHostBroadcastMessage = async () => {
    if (!detail) return;
    if (!isEventHost) {
      setHostBroadcastFeedback({
        tone: "error",
        text: "Only the host can message attendees."
      });
      return;
    }

    const message = hostBroadcastMessage.trim();
    if (!message) {
      setHostBroadcastFeedback({
        tone: "error",
        text: "Enter a message before sending."
      });
      return;
    }
    if (message.length > MAX_HOST_BROADCAST_MESSAGE_LENGTH) {
      setHostBroadcastFeedback({
        tone: "error",
        text: `Message cannot exceed ${MAX_HOST_BROADCAST_MESSAGE_LENGTH} characters.`
      });
      return;
    }
    if (!sendHostTextToAttendees) {
      setHostBroadcastFeedback({
        tone: "error",
        text: "Messaging is unavailable right now."
      });
      return;
    }

    setHostBroadcastSending(true);
    setHostBroadcastFeedback(null);
    try {
      const result = await sendHostTextToAttendees({
        eventId: detail.id,
        message
      });
      const response = (result.data ?? {}) as HostTextToAttendeesResponse;
      const toCount = (value: unknown) => {
        const numeric = coerceNumber(value);
        if (typeof numeric !== "number" || numeric < 0) return 0;
        return Math.floor(numeric);
      };

      const attemptedCount = toCount(response.attemptedCount);
      const sentCount = toCount(response.sentCount);
      const failedCount = toCount(response.failedCount);
      const successfulPhonesCount = Array.isArray(response.successfulPhones)
        ? response.successfulPhones.filter(
            (phone): phone is string => typeof phone === "string" && phone.trim().length > 0
          ).length
        : 0;
      const sentTotal = sentCount > 0 ? sentCount : successfulPhonesCount;
      const attemptedTotal =
        attemptedCount > 0 ? attemptedCount : Math.max(sentTotal + failedCount, sentTotal);

      if (attemptedTotal === 0) {
        setHostBroadcastFeedback({
          tone: "info",
          text: "No attendee phone numbers were eligible for SMS."
        });
        setHostBroadcastMessage("");
        return;
      }

      if (sentTotal > 0 && failedCount > 0) {
        setHostBroadcastFeedback({
          tone: "success",
          text: `Sent ${sentTotal} of ${attemptedTotal} attendee texts.`
        });
        setHostBroadcastMessage("");
        return;
      }

      if (sentTotal > 0) {
        setHostBroadcastFeedback({
          tone: "success",
          text: `Message sent to ${sentTotal} attendee${sentTotal === 1 ? "" : "s"}.`
        });
        setHostBroadcastMessage("");
        return;
      }

      setHostBroadcastFeedback({
        tone: "error",
        text: "Unable to send texts right now. Please try again."
      });
    } catch (sendFailure) {
      const errorCode =
        typeof sendFailure === "object" &&
        sendFailure !== null &&
        "code" in sendFailure &&
        typeof sendFailure.code === "string"
          ? sendFailure.code
          : "";
      const errorMessage = sendFailure instanceof Error ? sendFailure.message : "";
      const combinedError = `${errorCode} ${errorMessage}`.toLowerCase();

      if (
        combinedError.includes("permission-denied") ||
        combinedError.includes("unauthenticated") ||
        combinedError.includes("not_authorized") ||
        combinedError.includes("not-host") ||
        combinedError.includes("only the event host")
      ) {
        setHostBroadcastFeedback({
          tone: "error",
          text: "Only the host can message attendees."
        });
      } else if (
        combinedError.includes("invalid-argument") ||
        combinedError.includes("message") ||
        combinedError.includes("eventid")
      ) {
        setHostBroadcastFeedback({
          tone: "error",
          text: "Please check your message and try again."
        });
      } else {
        setHostBroadcastFeedback({
          tone: "error",
          text: "Unable to send attendee text right now."
        });
      }
    } finally {
      setHostBroadcastSending(false);
    }
  };

  const cancelConfirmationMessage = isPaidTailgate
    ? "Are you sure you want to cancel? All tickets purchased for this event will be fully refunded."
    : "Are you sure you want to cancel this tailgate?";
  const canCancelTailgate = !hasEventStarted && status !== "cancelled" && !cancelTailgateSubmitting;

  const cancelTailgateModal =
    isHostUser && detail && isCancelTailgateModalOpen ? (
      <div className="create-wizard-modal-overlay" role="dialog" aria-modal="true">
        <div className="create-wizard-modal create-wizard-refund-modal tailgate-details-cancel-modal">
          <div className="create-wizard-modal-header">
            <h3>Cancel tailgate?</h3>
            <button
              type="button"
              className="ghost-button"
              onClick={closeCancelTailgateModal}
              disabled={cancelTailgateSubmitting}
            >
              Close
            </button>
          </div>
          <p className="tailgate-details-cancel-modal-copy">{cancelConfirmationMessage}</p>
          <div className="create-wizard-payout-actions">
            <button
              type="button"
              className="primary-button"
              onClick={() => void cancelTailgate()}
              disabled={!canCancelTailgate}
            >
              {cancelTailgateSubmitting ? "Cancelling..." : "Confirm cancel"}
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={closeCancelTailgateModal}
              disabled={cancelTailgateSubmitting}
            >
              Keep event
            </button>
          </div>
        </div>
      </div>
    ) : null;

  const guestRefundModal = selectedGuestRefundPurchase ? (
    <div className="create-wizard-modal-overlay" role="dialog" aria-modal="true">
      <div className="create-wizard-modal create-wizard-refund-modal">
        <div className="create-wizard-modal-header">
          <h3>Request a refund</h3>
          <button
            type="button"
            className="ghost-button"
            onClick={closeGuestRefundModal}
            disabled={createRefundRequestLoading}
          >
            Close
          </button>
        </div>
        <p className="meta-muted">
          Purchase{" "}
          {selectedGuestRefundPurchase.purchaseNumber?.trim()
            ? selectedGuestRefundPurchase.purchaseNumber
            : formatPurchaseReference(selectedGuestRefundPurchase.purchaseReference)}{" "}
          · Qty {selectedGuestRefundPurchase.quantity}
        </p>
        <p className="meta-muted">Refunds are issued for the full purchase amount only.</p>
        <label className="input-group">
          <span className="input-label">Reason (optional)</span>
          <textarea
            className="text-input tailgate-details-host-broadcast-input"
            rows={4}
            value={guestRefundReason}
            onChange={(event) => setGuestRefundReason(event.target.value)}
            placeholder="Share details for the host."
          />
        </label>
        {createRefundRequestError ? (
          <p className="tailgate-details-ticket-error">Unable to process refund. Try again.</p>
        ) : null}
        <div className="create-wizard-payout-actions">
          <button
            type="button"
            className="primary-button"
            disabled={createRefundRequestLoading}
            onClick={() => void submitGuestRefundRequest()}
          >
            {createRefundRequestLoading ? "Submitting..." : "Submit request"}
          </button>
          <button
            type="button"
            className="secondary-button"
            disabled={createRefundRequestLoading}
            onClick={closeGuestRefundModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;

  const pageContent = loading ? (
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
          {cancelTailgateFeedback ? (
            <section
              className={`tailgate-details-checkout-banner cancel-feedback${
                cancelTailgateFeedback.tone === "success"
                  ? " cancel-feedback-success"
                  : " cancel-feedback-error"
              }`}
            >
              {cancelTailgateFeedback.text}
            </section>
          ) : null}
          {refundProgressMessage ? (
            <section className="tailgate-details-checkout-banner cancel-refund-info">
              {refundProgressMessage}
            </section>
          ) : null}

          {isHostUser ? (
            <article className="tailgate-details-card tailgate-details-actions-hub">
              <div className="section-header">
                <div>
                  <h2>Host Actions</h2>
                  <p className="section-subtitle">Run your event from one place.</p>
                </div>
              </div>
              <div className="tailgate-details-action-grid">
                <button
                  className="tailgate-details-action-card is-primary"
                  onClick={() => openInlineEventEditor(true)}
                  disabled={!db || !canEditCancelledEvent}
                >
                  <strong>{isInlineEditing ? "Editing event details" : "Edit event details"}</strong>
                  <small>Update name, kickoff, pricing, and meetup details inline</small>
                </button>
                {canShowWhosComingSection ? (
                  <button className="tailgate-details-action-card" onClick={scrollToAttendees}>
                    <strong>View guest list</strong>
                    <small>Review invites and RSVPs</small>
                  </button>
                ) : null}
                <button
                  className="tailgate-details-action-card"
                  onClick={() => {
                    if (!timelineEnabledForEvent) {
                      void enableTimelineForEvent();
                      return;
                    }
                    scrollToTimeline();
                  }}
                  disabled={enablingTimeline}
                >
                  <strong>
                    {timelineEnabledForEvent
                      ? detail.schedulePublished
                        ? "Edit schedule"
                        : "Build schedule"
                      : enablingTimeline
                      ? "Adding schedule..."
                      : "Add schedule"}
                  </strong>
                  <small>
                    {timelineEnabledForEvent
                      ? detail.schedulePublished
                        ? "Fine tune your published run of show"
                        : "Map out the timeline so guests know the plan"
                      : "Optional add-on. Turn this on to build your run of show."}
                  </small>
                </button>
                {detail.visibilityType === "open_paid" ? (
                  <button
                    className="tailgate-details-action-card"
                    onClick={() => navigate(`/tailgates/${detail.id}/checkin`)}
                    disabled={!canOpenCheckIn}
                  >
                    <strong>Check-in by code</strong>
                    <small>
                      {canOpenCheckIn
                        ? "Enter ticket codes from the host list"
                        : "Check-in is unavailable for cancelled events"}
                    </small>
                  </button>
                ) : null}
                <button
                  className="tailgate-details-action-card"
                  onClick={() => navigate(`/tailgates/${detail.id}/feed`)}
                >
                  <strong>Open event feed</strong>
                  <small>Post updates and share photos with attendees</small>
                </button>
                {isEventHost ? (
                  <button
                    className={`tailgate-details-action-card${
                      isHostBroadcastComposerOpen ? " is-primary" : ""
                    }`}
                    onClick={openHostBroadcastComposer}
                  >
                    <strong>Message attendees</strong>
                    <small>Send a one-time SMS update to your attendees</small>
                  </button>
                ) : null}
                <button
                  className="tailgate-details-action-card"
                  onClick={dropLocationPin}
                  disabled={pinning}
                >
                  <strong>{pinning ? "Dropping pin..." : "Drop location pin"}</strong>
                  <small>Share exact meetup point from your current location</small>
                </button>
              </div>
              {isEventHost && isHostBroadcastComposerOpen ? (
                <div className="tailgate-details-host-broadcast">
                  <label className="input-group" htmlFor="host-broadcast-message">
                    <span className="input-label">Message</span>
                    <textarea
                      id="host-broadcast-message"
                      className="text-input tailgate-details-host-broadcast-input"
                      value={hostBroadcastMessage}
                      onChange={handleHostBroadcastMessageChange}
                      maxLength={MAX_HOST_BROADCAST_MESSAGE_LENGTH}
                      placeholder="Example: We moved to Lot C near Gate 4. See you soon."
                      rows={4}
                    />
                  </label>
                  <div className="tailgate-details-host-broadcast-actions">
                    <p className="tailgate-details-host-broadcast-counter">
                      {hostBroadcastCharacterCount}/{MAX_HOST_BROADCAST_MESSAGE_LENGTH}
                    </p>
                    <div className="tailgate-details-inline-editor-actions">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={closeHostBroadcastComposer}
                        disabled={hostBroadcastSending}
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        className="primary-button"
                        onClick={() => void sendHostBroadcastMessage()}
                        disabled={!canSendHostBroadcast}
                      >
                        {hostBroadcastSending ? "Sending..." : "Send text"}
                      </button>
                    </div>
                  </div>
                  {!sendHostTextToAttendees ? (
                    <p className="tailgate-details-ticket-error">
                      Messaging is unavailable in this environment.
                    </p>
                  ) : null}
                  {hostBroadcastFeedback?.tone === "success" ? (
                    <p className="tailgate-details-inline-editor-success">
                      {hostBroadcastFeedback.text}
                    </p>
                  ) : null}
                  {hostBroadcastFeedback?.tone === "info" ? (
                    <p className="meta-muted">{hostBroadcastFeedback.text}</p>
                  ) : null}
                  {hostBroadcastFeedback?.tone === "error" ? (
                    <p className="tailgate-details-ticket-error">{hostBroadcastFeedback.text}</p>
                  ) : null}
                </div>
              ) : null}
              <button
                className="tailgate-details-control-row danger"
                onClick={openCancelTailgateModal}
                disabled={!canCancelTailgate}
              >
                <span>
                  {status === "cancelled"
                    ? "Tailgate cancelled"
                    : hasEventStarted
                    ? "Cancellation unavailable"
                    : cancelTailgateSubmitting
                    ? "Cancelling..."
                    : "Cancel tailgate"}
                </span>
                <small>
                  {status === "cancelled"
                    ? "This event is already cancelled"
                    : hasEventStarted
                    ? "This event has already started"
                    : "Notify all guests the event is cancelled"}
                </small>
              </button>
            </article>
          ) : null}

          {activeCoverImageUrl ? (
            <article className="tailgate-details-card tailgate-details-carousel-card">
              <div className="tailgate-details-carousel-header">
                <h2>Event Photos</h2>
                <span>
                  {safeCoverIndex + 1} / {coverImageUrls.length}
                </span>
              </div>
              <div className="tailgate-details-carousel-viewport">
                {showActiveCoverImageLoading ? (
                  <span className="tailgate-details-carousel-image-loading" aria-hidden="true">
                    <span className="tailgate-details-carousel-image-spinner" />
                  </span>
                ) : null}
                {hasActiveCoverImageLoadError && !isRecoveringActiveCoverImage ? (
                  <span className="tailgate-details-carousel-image-fallback">
                    Image unavailable.{" "}
                    <a
                      href={activeCoverImageErrorUrl ?? activeCoverImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open image
                    </a>
                  </span>
                ) : null}
                <img
                  className={`tailgate-details-carousel-image${
                    showActiveCoverImageLoading ? " is-loading" : ""
                  }`}
                  src={activeCoverImageUrl}
                  alt={`${detail.eventName} cover`}
                  loading="lazy"
                  onLoad={() => {
                    if (!activeCoverImageRaw) return;
                    const normalizedRaw = activeCoverImageRaw.trim();
                    setRecoveringCoverImageByRaw((previous) => {
                      const next = { ...previous };
                      delete next[activeCoverImageRaw];
                      delete next[normalizedRaw];
                      return next;
                    });
                    if (activeCoverImageLoadingKey) {
                      setLoadedCoverImagesByKey((previous) => {
                        if (previous[activeCoverImageLoadingKey]) return previous;
                        return { ...previous, [activeCoverImageLoadingKey]: true };
                      });
                    }
                    setCoverImageLoadErrorsByRaw((previous) => {
                      const next = { ...previous };
                      delete next[activeCoverImageRaw];
                      delete next[normalizedRaw];
                      return next;
                    });
                  }}
                  onError={() => {
                    if (!activeCoverImageRaw || !activeCoverImageUrl) return;
                    handleActiveCoverImageError(activeCoverImageRaw, activeCoverImageUrl);
                  }}
                />
                {hasMultipleCoverImages ? (
                  <>
                    <button
                      type="button"
                      className="tailgate-details-carousel-nav prev"
                      onClick={goToPreviousCoverImage}
                      aria-label="Previous photo"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="tailgate-details-carousel-nav next"
                      onClick={goToNextCoverImage}
                      aria-label="Next photo"
                    >
                      ›
                    </button>
                    <div className="tailgate-details-carousel-dots" role="tablist" aria-label="Photo selector">
                      {coverImageUrls.map((url, index) => (
                        <button
                          key={`${url}-${index}`}
                          type="button"
                          className={`tailgate-details-carousel-dot${
                            safeCoverIndex === index ? " is-active" : ""
                          }`}
                          onClick={() => setActiveCoverIndex(index)}
                          aria-label={`View photo ${index + 1}`}
                          aria-selected={safeCoverIndex === index}
                        />
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </article>
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
              {canOpenMaps ? (
                <button className="primary-button" onClick={openMaps}>
                  Open maps
                </button>
              ) : null}
              <button
                className="secondary-button"
                onClick={() => navigate(`/tailgates/${detail.id}/feed`)}
              >
                Event feed
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
                {detail.visibilityType === "open_paid" ? (
                  <>
                    <div className="tailgate-details-metric-card">
                      <p>Tickets Sold</p>
                      <strong>{ticketsSold}</strong>
                    </div>
                    <div className="tailgate-details-metric-card">
                      <p>Checked In</p>
                      <strong>{checkedInCountForHost ?? "--"}</strong>
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
                ) : (
                  <>
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
                    {detail.capacity ? (
                      <div className="tailgate-details-metric-card">
                        <p>Capacity</p>
                        <strong>{detail.capacity}</strong>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </article>
          ) : null}

          <article className="tailgate-details-card" ref={eventSnapshotSectionRef}>
            <div className="section-header">
              <div>
                <h2>Event Snapshot</h2>
                <p className="section-subtitle">Essential details guests need.</p>
              </div>
              {isHostUser ? (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    isInlineEditing ? cancelInlineEventEditor() : openInlineEventEditor(false)
                  }
                  disabled={!db || inlineEditSaving || !canEditCancelledEvent}
                >
                  {isInlineEditing ? "Cancel edit" : "Edit inline"}
                </button>
              ) : null}
            </div>
            {isInlineEditing ? (
              <div className="tailgate-details-inline-editor">
                <div className="tailgate-details-inline-editor-grid">
                  <label className="input-group">
                    <span className="input-label">Event name</span>
                    <input
                      className="text-input"
                      value={inlineEditDraft.eventName}
                      onChange={(event) =>
                        setInlineEditDraft((previous) => ({
                          ...previous,
                          eventName: event.target.value
                        }))
                      }
                      placeholder="Tailgate event name"
                    />
                  </label>
                  <label className="input-group">
                    <span className="input-label">Location</span>
                    <input
                      className="text-input"
                      value={inlineEditDraft.locationSummary}
                      onChange={(event) =>
                        setInlineEditDraft((previous) => ({
                          ...previous,
                          locationSummary: event.target.value
                        }))
                      }
                      placeholder="Lot, street, city"
                    />
                  </label>
                  <label className="input-group">
                    <span className="input-label">Event date</span>
                    <input
                      className="text-input"
                      type="date"
                      value={inlineEditDraft.eventDate}
                      onChange={(event) =>
                        setInlineEditDraft((previous) => ({
                          ...previous,
                          eventDate: event.target.value
                        }))
                      }
                    />
                  </label>
                  <label className="input-group">
                    <span className="input-label">Start time</span>
                    <input
                      className="text-input"
                      type="time"
                      value={inlineEditDraft.eventStartTime}
                      onChange={(event) =>
                        setInlineEditDraft((previous) => ({
                          ...previous,
                          eventStartTime: event.target.value
                        }))
                      }
                    />
                  </label>
                  {detail.visibilityType === "open_paid" ? (
                    <>
                      <label className="input-group">
                        <span className="input-label">Ticket price (USD)</span>
                        <input
                          className="text-input"
                          value={inlineEditDraft.ticketPrice}
                          onChange={(event) =>
                            setInlineEditDraft((previous) => ({
                              ...previous,
                              ticketPrice: event.target.value.replace(/[^0-9.]/g, "")
                            }))
                          }
                          placeholder="20.00"
                          inputMode="decimal"
                        />
                      </label>
                      <label className="input-group">
                        <span className="input-label">Capacity (optional)</span>
                        <input
                          className="text-input"
                          value={inlineEditDraft.capacity}
                          onChange={(event) =>
                            setInlineEditDraft((previous) => ({
                              ...previous,
                              capacity: event.target.value.replace(/\D/g, "")
                            }))
                          }
                          placeholder="100"
                          inputMode="numeric"
                        />
                      </label>
                    </>
                  ) : null}
                </div>
                <label className="input-group">
                  <span className="input-label">Description</span>
                  <textarea
                    className="text-input tailgate-details-inline-editor-description"
                    value={inlineEditDraft.description}
                    onChange={(event) =>
                      setInlineEditDraft((previous) => ({
                        ...previous,
                        description: event.target.value
                      }))
                    }
                    placeholder="Describe your setup, parking cues, and game-day vibe."
                  />
                </label>
                {inlineEditError ? (
                  <p className="tailgate-details-ticket-error">{inlineEditError}</p>
                ) : null}
                <div className="tailgate-details-inline-editor-actions">
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => void saveInlineEventDetails()}
                    disabled={inlineEditSaving}
                  >
                    {inlineEditSaving ? "Saving..." : "Save details"}
                  </button>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={cancelInlineEventEditor}
                    disabled={inlineEditSaving}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}
            {inlineEditSuccess ? (
              <p className="tailgate-details-inline-editor-success">{inlineEditSuccess}</p>
            ) : null}
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
                {canOpenMaps ? (
                  <button className="link-button" onClick={openMaps}>
                    Open in maps
                  </button>
                ) : null}
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
            {showGuestRsvpSection ? (
              <div className="tailgate-details-rsvp-block">
                <div className="tailgate-details-ticket-row">
                  <p className="tailgate-details-ticket-title">Your RSVP</p>
                  <span className={`tailgate-details-rsvp-status ${rsvpStatusMeta.className}`}>
                    {rsvpStatusMeta.label}
                  </span>
                </div>
                <p className="tailgate-details-ticket-copy">{rsvpStatusMeta.description}</p>
                {user ? (
                  <div className="tailgate-details-rsvp-options">
                    <button
                      type="button"
                      className={`tailgate-details-rsvp-option${
                        userRsvpStatus === "Attending" ? " is-active is-going" : ""
                      }`}
                      onClick={() => confirmGuestRsvpUpdate("Attending")}
                      disabled={rsvpSaving}
                    >
                      {rsvpSaving && rsvpPendingChoice === "Attending" ? "Updating..." : "Going"}
                    </button>
                    <button
                      type="button"
                      className={`tailgate-details-rsvp-option${
                        userRsvpStatus === "Not Attending"
                          ? " is-active is-not-going"
                          : ""
                      }`}
                      onClick={() => confirmGuestRsvpUpdate("Not Attending")}
                      disabled={rsvpSaving}
                    >
                      {rsvpSaving && rsvpPendingChoice === "Not Attending"
                        ? "Updating..."
                        : "Not Going"}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                      navigate(
                        `/login?mode=login&redirect=${encodeURIComponent(
                          `/tailgates/${encodeURIComponent(detail.id)}`
                        )}`
                      )
                    }
                  >
                    Sign in to RSVP
                  </button>
                )}
                {rsvpError ? <p className="tailgate-details-ticket-error">{rsvpError}</p> : null}
                {rsvpSuccess ? (
                  <p className="tailgate-details-inline-editor-success">{rsvpSuccess}</p>
                ) : null}
              </div>
            ) : null}
            {showTicketPurchase ? (
              <div className="tailgate-details-ticket-block">
                <div className="tailgate-details-ticket-row">
                  <p className="tailgate-details-ticket-title">Tickets</p>
                  <span className="chip chip-upcoming">
                    {formatCurrencyFromCents(detail.ticketPriceCents)} per person
                  </span>
                </div>
                <p className="tailgate-details-ticket-copy">{ticketStatusMessage}</p>
                {!user && !isSoldOut && !isTicketSalesClosed ? (
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                      navigate(
                        `/login?mode=login&redirect=${encodeURIComponent(
                          `/tailgates/${encodeURIComponent(detail.id)}`
                        )}`
                      )
                    }
                  >
                    Sign in to purchase
                  </button>
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
                {canShowGuestRefundSection ? (
                  <div className="tailgate-details-refund-block">
                    <div className="tailgate-details-ticket-row">
                      <p className="tailgate-details-ticket-title">Refunds</p>
                    </div>
                    <p className="tailgate-details-refund-status-copy">
                      Refund requests apply to the full purchase. Partial refunds are unavailable.
                    </p>
                    <div className="tailgate-details-refund-list">
                      {guestRefundPurchases.map((purchase) => {
                        const refundStatusLabel =
                          purchase.refundRequestStatus === "pending"
                            ? "Pending"
                            : purchase.refundRequestStatus === "approved"
                            ? "Approved"
                            : purchase.refundRequestStatus === "denied"
                            ? "Denied"
                            : purchase.isRefunded
                            ? "Approved"
                            : "Confirmed";
                        const refundStatusChipClass =
                          purchase.refundRequestStatus === "pending"
                            ? "chip-upcoming"
                            : purchase.refundRequestStatus === "denied"
                            ? "chip-cancelled"
                            : purchase.refundRequestStatus === "approved" || purchase.isRefunded
                            ? "chip-live"
                            : "chip-outline";
                        const purchaseLabel = purchase.purchaseNumber?.trim()
                          ? purchase.purchaseNumber
                          : formatPurchaseReference(purchase.purchaseReference);
                        const purchaseAmountLabel =
                          typeof purchase.amountCents === "number"
                            ? formatCurrencyFromCents(purchase.amountCents)
                            : "Amount unavailable";
                        const purchaseDateLabel =
                          purchase.createdAtMs > 0
                            ? formatDateTime(new Date(purchase.createdAtMs))
                            : "Date unavailable";

                        return (
                          <div
                            className="tailgate-details-refund-row"
                            key={`${purchase.purchaseReference}:${purchase.representativeTicketId}`}
                          >
                            <div>
                              <p className="tailgate-details-attendee-name">
                                Purchase {purchaseLabel} · Qty {purchase.quantity}
                              </p>
                              <p className="tailgate-details-refund-purchase-meta">
                                {purchaseAmountLabel} · {purchaseDateLabel}
                              </p>
                              {purchase.refundRequestStatus === "pending" ? (
                                <p className="tailgate-details-refund-status-copy">
                                  Refund requested • Waiting for host decision.
                                </p>
                              ) : purchase.refundRequestStatus === "approved" || purchase.isRefunded ? (
                                <p className="tailgate-details-refund-status-copy">Refund approved.</p>
                              ) : purchase.refundRequestStatus === "denied" ? (
                                <p className="tailgate-details-ticket-error">
                                  Refund denied.
                                </p>
                              ) : (
                                <p className="tailgate-details-refund-status-copy">
                                  Purchase confirmed.
                                </p>
                              )}
                              {purchase.hostDecisionReason?.trim() ? (
                                <p className="tailgate-details-refund-host-note">
                                  Host note: {purchase.hostDecisionReason}
                                </p>
                              ) : null}
                            </div>
                            <div className="tailgate-details-refund-row-actions">
                              <span className={`chip ${refundStatusChipClass}`}>{refundStatusLabel}</span>
                              {purchase.isEligibleForRequest ? (
                                <button
                                  type="button"
                                  className="secondary-button"
                                  disabled={createRefundRequestLoading}
                                  onClick={() =>
                                    openGuestRefundModal(purchase.purchaseReference)
                                  }
                                >
                                  Request purchase refund
                                </button>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {guestRefundFeedback?.tone === "success" ? (
                      <p className="tailgate-details-inline-editor-success">
                        {guestRefundFeedback.text}
                      </p>
                    ) : null}
                    {guestRefundFeedback?.tone === "error" ? (
                      <p className="tailgate-details-ticket-error">{guestRefundFeedback.text}</p>
                    ) : null}
                    {createRefundRequestError ? (
                      <p className="tailgate-details-ticket-error">Unable to process refund. Try again.</p>
                    ) : null}
                  </div>
                ) : null}
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
                <p className="section-subtitle">
                  {droppedPinLabel ??
                    displayLocationLabel ??
                    (locationCoords ? "Pin dropped in map" : "Location coming soon.")}
                </p>
              </div>
            </div>
            {locationCoords ? (
              <p className="tailgate-details-map-note">
                {hasExactPin
                  ? "Exact in-lot pin shared by host."
                  : "Showing general meetup area. Host can drop the exact in-lot pin later."}
              </p>
            ) : null}
            {mapUrl ? (
              <iframe className="tailgate-details-map" src={mapUrl} title="Tailgate map preview" />
            ) : (
              <div className="tailgate-details-map-placeholder">
                {MAPS_API_KEY
                  ? "No coordinates yet. Host can drop an exact location pin from Host Controls."
                  : "Set MAPS_API_KEY to preview Google Maps for this tailgate."}
              </div>
            )}
            {canOpenMaps ? (
              <button type="button" className="secondary-button" onClick={openMaps}>
                Open in maps
              </button>
            ) : null}
          </article>

          {canShowWhosComingSection ? (
            <article className="tailgate-details-card" ref={attendeeSectionRef}>
              <div className="section-header">
                <div>
                  <h2>Who's Going</h2>
                  <p className="section-subtitle">Filter by RSVP status.</p>
                </div>
              </div>
              {isHostUser ? (
                <div className="tailgate-details-attendee-invite">
                  {canManageGuestInvites ? (
                    <>
                      <p className="tailgate-details-attendee-invite-title">Invite guest</p>
                      <p className="tailgate-details-attendee-invite-copy">
                        Add invitees directly from the event details screen.
                      </p>
                      <div className="tailgate-details-attendee-invite-grid">
                        <label className="input-group">
                          <span className="input-label">Guest name</span>
                          <input
                            className="text-input"
                            value={guestInviteDraft.name}
                            onChange={(event) =>
                              setGuestInviteDraft((previous) => ({
                                ...previous,
                                name: event.target.value
                              }))
                            }
                            placeholder="Jane Doe"
                          />
                        </label>
                        <label className="input-group">
                          <span className="input-label">Phone (optional)</span>
                          <input
                            className="text-input"
                            value={guestInviteDraft.phone}
                            onChange={(event) =>
                              setGuestInviteDraft((previous) => ({
                                ...previous,
                                phone: formatPhoneInput(event.target.value)
                              }))
                            }
                            placeholder="(555) 555-5555"
                            inputMode="tel"
                          />
                        </label>
                        <label className="input-group">
                          <span className="input-label">Email (optional)</span>
                          <input
                            className="text-input"
                            value={guestInviteDraft.email}
                            onChange={(event) =>
                              setGuestInviteDraft((previous) => ({
                                ...previous,
                                email: event.target.value
                              }))
                            }
                            placeholder="jane@example.com"
                            inputMode="email"
                          />
                        </label>
                      </div>
                      <div className="tailgate-details-attendee-invite-actions">
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => void addGuestInvite()}
                          disabled={guestInviteSaving}
                        >
                          {guestInviteSaving ? "Adding..." : "Add guest"}
                        </button>
                        {guestInviteError ? (
                          <p className="tailgate-details-ticket-error">{guestInviteError}</p>
                        ) : null}
                        {guestInviteSuccess ? (
                          <p className="tailgate-details-inline-editor-success">
                            {guestInviteSuccess}
                          </p>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <p className="meta-muted">
                      Manual guest invites are available for invite-only tailgates.
                    </p>
                  )}
                </div>
              ) : null}
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
                    const attendeeContact = [attendee.email, attendee.phone]
                      .map((value) => value?.trim())
                      .filter((value): value is string => Boolean(value))
                      .join(" · ");
                    return (
                      <div className="tailgate-details-attendee-row" key={attendee.id}>
                        <div>
                          <p className="tailgate-details-attendee-name">{attendee.name}</p>
                          {attendeeContact ? (
                            <p className="tailgate-details-attendee-meta">{attendeeContact}</p>
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
          ) : null}
        </section>
      );

  if (isEmbeddedMapPanel) {
    return (
      <main className="tailgate-details-embedded">
        {pageContent}
        {guestRefundModal}
        {cancelTailgateModal}
      </main>
    );
  }

  return (
    <AppShell header={<div className="simple-header"><h1>Tailgate Details</h1></div>}>
      {pageContent}
      {guestRefundModal}
      {cancelTailgateModal}
    </AppShell>
  );
}

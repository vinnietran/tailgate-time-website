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
import {
  IconCalendar,
  IconCheckin,
  IconDashboard,
  IconLocation,
  IconMessage,
  IconSpark,
  IconUser
} from "../components/Icons";
import { PublicTopNav } from "../components/PublicTopNav";
import { useAuth } from "../hooks/useAuth";
import { useDialog } from "../hooks/useDialog";
import {
  app as firebaseApp,
  db,
  functions as firebaseFunctions,
  storage as firebaseStorage
} from "../lib/firebase";
import { mockTailgates } from "../data/mockTailgates";
import { TailgateEvent, TailgateStatus, VisibilityType } from "../types";
import {
  buildEventSizeSummary,
  estimateHostPayout,
  getTailgateCrowdTag,
  getVisibilityLabel
} from "../utils/tailgate";
import { formatCurrencyFromCents, formatDateTime, getFirstName } from "../utils/format";

const MAPS_API_KEY = (
  import.meta.env.MAPS_API_KEY ??
  import.meta.env.VITE_MAPS_API_KEY ??
  ""
).trim();
const firebaseProjectId =
  (
    typeof import.meta.env.VITE_FIREBASE_PROJECT_ID === "string"
      ? import.meta.env.VITE_FIREBASE_PROJECT_ID
      : ""
  ).trim() ||
  ((firebaseApp?.options.projectId as string | undefined) ?? "").trim();
const submitInviteRsvpPublicUrl = firebaseProjectId
  ? `https://us-central1-${firebaseProjectId}.cloudfunctions.net/submitInviteRsvpPublic`
  : "";
const MAX_TICKET_QUANTITY = 8;
const MAX_HOST_BROADCAST_MESSAGE_LENGTH = 320;
const MAX_CONTACT_HOST_MESSAGE_LENGTH = 1200;
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const MAX_QUIZ_QUESTIONS = 10;
const DEFAULT_PLUS_LIMIT = 12;
const MAX_OPEN_FREE_PARTY_SIZE = 25;
const EMPTY_QUIZ_QUESTION_FALLBACK: QuizQuestion = {
  id: "q1",
  questionText: "",
  choices: [
    { id: "a", text: "" },
    { id: "b", text: "" },
    { id: "c", text: "" },
    { id: "d", text: "" }
  ],
  correctChoiceId: null,
  type: "multiple"
};

type AttendeeFilterKey = "All" | "Going" | "Pending" | "Not Going";
type AttendeeStatus = "Host" | "Attending" | "Pending" | "Not Attending";
type TicketCheckState = "loading" | "confirmed" | "missing";
type GuestRsvpChoice = "Attending" | "Not Attending";
type InviteRsvpResponse = "yes" | "no";
type PlusGuestDraft = {
  id: string;
  attendeeId?: string;
  name: string;
  phone: string;
};
type InviteRsvpPayload = {
  eventId: string;
  guestId?: string;
  token?: string;
  rsvpStatus: InviteRsvpResponse;
  anonymousGuestCount: number;
  additionalGuests: Array<{
    attendeeId?: string;
    name: string;
    phone: string;
  }>;
};
type TimelineStep = {
  id: string;
  title: string;
  description?: string;
  timestampStart: Date;
  timestampEnd?: Date | null;
};
type QuizChoice = {
  id: string;
  text: string;
};
type QuizQuestion = {
  id: string;
  questionText: string;
  choices: QuizChoice[];
  correctChoiceId: string | null;
  type: "multiple" | "truefalse";
};
type QuizQuestionError = {
  questionText?: string;
  choices?: Record<string, string>;
  correctChoiceId?: string;
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
  token?: string;
  userId?: string;
  name: string;
  status: AttendeeStatus;
  phone?: string;
  email?: string;
  plusGuestsAnonymousCount?: number | string;
  additionalGuestCount?: number | string;
  plusGuestsNoContactCount?: number | string;
  isAdditionalGuestInvite?: boolean;
  invitedByGuestId?: string;
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

type CoHostInviteRecord = {
  phoneNumberCanonical: string;
  phoneNumberDisplay?: string;
  invitedAt?: Date | null;
  invitedByUserId?: string | null;
};

type CoHostProfile = {
  userId: string;
  displayName: string;
  phone?: string | null;
};

type CheckoutPurchaseStatus =
  | "checkout_created"
  | "confirmed"
  | "expired"
  | "failed"
  | "refunded"
  | "cancelled"
  | null;

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

type ContactEventHostInput = {
  eventId: string;
  message: string;
};

type ContactEventHostResponse = {
  success?: boolean;
  hostName?: string;
  cooldownMs?: number;
};

type TailgateDetail = {
  id: string;
  eventName: string;
  description?: string;
  coverImageUrls: string[];
  hostId: string;
  hostName: string;
  coHostIds: string[];
  coHostInvites: CoHostInviteRecord[];
  startDateTime: Date | null;
  locationRaw: unknown;
  locationSummary?: string;
  locationCoords?: { lat: number; lng: number } | null;
  attendees: AttendeeRecord[];
  visibilityType: VisibilityType;
  allowGuestPlusOnInvite?: boolean;
  maxAdditionalGuestsPerInvite?: number;
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

function clampOpenFreePartySize(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.min(Math.floor(value), MAX_OPEN_FREE_PARTY_SIZE));
}

function nextQuizQuestionId(existing: QuizQuestion[]): string {
  const used = new Set(existing.map((question) => question.id));
  let i = 1;
  while (used.has(`q${i}`)) i += 1;
  return `q${i}`;
}

function createEmptyQuizQuestion(existing: QuizQuestion[]): QuizQuestion {
  return {
    id: nextQuizQuestionId(existing),
    questionText: "",
    choices: [
      { id: "a", text: "" },
      { id: "b", text: "" },
      { id: "c", text: "" },
      { id: "d", text: "" }
    ],
    correctChoiceId: null,
    type: "multiple"
  };
}

function normalizeQuizQuestions(raw: unknown): QuizQuestion[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((value, index) => {
      const record = asRecord(value);
      if (!record) return null;
      const id = firstString(record.id) ?? `q${index + 1}`;
      const questionText = firstString(record.questionText) ?? "";
      const type = firstString(record.type) === "truefalse" ? "truefalse" : "multiple";
      const rawChoices = Array.isArray(record.choices) ? record.choices : [];
      const choices = rawChoices
        .map((choiceValue, choiceIndex) => {
          if (typeof choiceValue === "string") {
            return {
              id: String.fromCharCode(97 + choiceIndex),
              text: choiceValue
            } as QuizChoice;
          }
          const choiceRecord = asRecord(choiceValue);
          if (!choiceRecord) return null;
          const choiceId =
            firstString(choiceRecord.id) ?? String.fromCharCode(97 + choiceIndex);
          const choiceText = firstString(choiceRecord.text) ?? "";
          return { id: choiceId, text: choiceText } as QuizChoice;
        })
        .filter((choice): choice is QuizChoice => Boolean(choice));

      const normalizedChoices =
        choices.length > 0
          ? choices
          : type === "truefalse"
          ? [
              { id: "true", text: "True" },
              { id: "false", text: "False" }
            ]
          : [
              { id: "a", text: "" },
              { id: "b", text: "" },
              { id: "c", text: "" },
              { id: "d", text: "" }
            ];
      const correctChoiceId = firstString(record.correctChoiceId) ?? null;

      return {
        id,
        questionText,
        choices: normalizedChoices,
        correctChoiceId,
        type
      } as QuizQuestion;
    })
    .filter((question): question is QuizQuestion => Boolean(question));
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

function sanitizeGuestCountInput(value: string) {
  return value.replace(/\D/g, "").slice(0, 2);
}

function normalizeInviteRsvpChoice(status?: string | null): GuestRsvpChoice {
  return normalizeStatus(status) === "Not Attending" ? "Not Attending" : "Attending";
}

function errorCodeValue(error: unknown): string {
  const raw =
    typeof (error as { code?: unknown })?.code === "string"
      ? (error as { code: string }).code
      : "";
  return raw.toLowerCase();
}

function errorMessageValue(error: unknown): string {
  return (
    (typeof (error as { message?: unknown })?.message === "string"
      ? (error as { message: string }).message
      : "") || ""
  ).toLowerCase();
}

function isUnauthenticatedError(error: unknown): boolean {
  const code = errorCodeValue(error);
  const message = errorMessageValue(error);
  return code.includes("unauthenticated") || message.includes("unauthenticated");
}

async function submitInviteRsvpViaHttp(payload: InviteRsvpPayload): Promise<void> {
  if (!submitInviteRsvpPublicUrl) {
    throw new Error("Missing Firebase project configuration for RSVP endpoint.");
  }

  const response = await fetch(submitInviteRsvpPublicUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    return;
  }

  const errorBody = (await response.json().catch(() => null)) as
    | { code?: string; message?: string }
    | null;
  const error = new Error(
    errorBody?.message || `HTTP ${response.status} saving RSVP failed.`
  ) as Error & { code?: string };
  error.code = errorBody?.code;
  throw error;
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

function resolveAnonymousPlusGuests(
  attendee: Pick<
    AttendeeRecord,
    "plusGuestsAnonymousCount" | "additionalGuestCount" | "plusGuestsNoContactCount"
  >
): number {
  const candidates = [
    attendee.plusGuestsAnonymousCount,
    attendee.additionalGuestCount,
    attendee.plusGuestsNoContactCount
  ];

  for (const value of candidates) {
    const numeric =
      typeof value === "number"
        ? value
        : typeof value === "string"
        ? Number(value)
        : Number.NaN;
    if (Number.isFinite(numeric)) {
      return Math.max(0, Math.floor(numeric));
    }
  }

  return 0;
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
    .map((entry, index): AttendeeRecord | null => {
      const record = asRecord(entry);
      if (!record) return null;

      const userId = firstString(record.userId, record.uid, record.id);
      const name = firstString(
        record.displayName,
        record.name,
        record.contact,
        record.email
      ) ?? `Guest ${index + 1}`;
      const isAdditionalGuestInvite = record.isAdditionalGuestInvite === true;
      const hasContactInfo =
        firstString(record.displayName, record.name, record.phone, record.email)?.length ?? 0;

      let status = normalizeStatus(record.status);
      if (isAdditionalGuestInvite && hasContactInfo > 0 && status !== "Not Attending") {
        status = "Attending";
      }
      if (userId && userId === hostId && !isAdditionalGuestInvite) {
        status = "Host";
      }

      const id =
        firstString(record.id, record.token) ??
        `${userId ?? "guest"}-${index}-${name}`;
      if (seen.has(id)) return null;
      seen.add(id);

      return {
        id,
        token: firstString(record.token),
        userId,
        name,
        status,
        phone: firstString(record.phone),
        email: firstString(record.email),
        plusGuestsAnonymousCount:
          coerceNumber(record.plusGuestsAnonymousCount) ??
          firstString(record.plusGuestsAnonymousCount),
        additionalGuestCount:
          coerceNumber(record.additionalGuestCount) ??
          firstString(record.additionalGuestCount),
        plusGuestsNoContactCount:
          coerceNumber(record.plusGuestsNoContactCount) ??
          firstString(record.plusGuestsNoContactCount),
        isAdditionalGuestInvite,
        invitedByGuestId: firstString(record.invitedByGuestId)
      };
    })
    .filter((attendee): attendee is AttendeeRecord => attendee !== null);

  const hostExists = attendees.some(
    (attendee) =>
      attendee.isAdditionalGuestInvite !== true &&
      (attendee.userId === hostId || attendee.status === "Host")
  );
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

  const lat =
    coerceNumber(locationCoordsRecord?.lat) ?? coerceNumber(locationRecord?.lat);
  const lng =
    coerceNumber(locationCoordsRecord?.lng) ?? coerceNumber(locationRecord?.lng);

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

function resolveExactPinCoords(locationRaw: unknown): { lat: number; lng: number } | null {
  const locationRecord = asRecord(locationRaw);
  const pin = asRecord(locationRecord?.pin) as LocationPin | null;
  const lat = coerceNumber(pin?.lat);
  const lng = coerceNumber(pin?.lng);
  if (typeof lat === "number" && typeof lng === "number") {
    return { lat, lng };
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

function resolveCoHostInvites(value: unknown): CoHostInviteRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      const record = asRecord(entry);
      if (!record) return null;
      const phoneNumberCanonical = firstString(record.phoneNumberCanonical);
      if (!phoneNumberCanonical) return null;
      return {
        phoneNumberCanonical,
        phoneNumberDisplay:
          firstString(record.phoneNumberDisplay) ?? formatPhoneInput(phoneNumberCanonical),
        invitedAt: normalizeDate(record.invitedAt),
        invitedByUserId: firstString(record.invitedByUserId) ?? null
      } as CoHostInviteRecord;
    })
    .filter((entry): entry is CoHostInviteRecord => Boolean(entry));
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
    coHostInvites: resolveCoHostInvites(data.coHostInvites),
    startDateTime,
    locationRaw: data.location,
    locationSummary:
      resolveLocationString(data.location) ??
      firstString(data.locationSummary, data.venueName),
    locationCoords: resolveLocationCoords(data.location, data.locationCoords),
    attendees: normalizeAttendees(data.attendees, hostId, hostName),
    visibilityType,
    allowGuestPlusOnInvite: data.allowGuestPlusOnInvite === true,
    maxAdditionalGuestsPerInvite: coerceNumber(data.maxAdditionalGuestsPerInvite),
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
    coHostInvites: [],
    startDateTime: event.startDateTime,
    locationRaw: event.locationSummary,
    locationSummary: event.locationSummary,
    locationCoords: null,
    attendees,
    visibilityType: event.visibilityType,
    allowGuestPlusOnInvite: false,
    maxAdditionalGuestsPerInvite: undefined,
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
  const quizSectionRef = useRef<HTMLElement | null>(null);
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
  const [rsvpDraftChoice, setRsvpDraftChoice] = useState<GuestRsvpChoice>("Attending");
  const [inviteGuestCount, setInviteGuestCount] = useState("0");
  const [invitePlusGuests, setInvitePlusGuests] = useState<PlusGuestDraft[]>([]);
  const [openFreePartySize, setOpenFreePartySize] = useState(1);
  const [pinning, setPinning] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [ticketCheckState, setTicketCheckState] = useState<TicketCheckState>("loading");
  const [hasConfirmedTicket, setHasConfirmedTicket] = useState(false);
  const [confirmedTicketCount, setConfirmedTicketCount] = useState(0);
  const [liveCheckedInCount, setLiveCheckedInCount] = useState<number | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutPurchaseStatus, setCheckoutPurchaseStatus] =
    useState<CheckoutPurchaseStatus>(null);
  const [checkoutPurchaseLoading, setCheckoutPurchaseLoading] = useState(false);
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
  const [quizLoading, setQuizLoading] = useState(true);
  const [quizSaving, setQuizSaving] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [quizSuccess, setQuizSuccess] = useState<string | null>(null);
  const [quizDocId, setQuizDocId] = useState<string | null>(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizTitleError, setQuizTitleError] = useState("");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    createEmptyQuizQuestion([])
  ]);
  const [currentQuizQuestionIndex, setCurrentQuizQuestionIndex] = useState(0);
  const [quizErrors, setQuizErrors] = useState<Record<number, QuizQuestionError>>({});
  const [quizValidationMessage, setQuizValidationMessage] = useState<string | null>(null);
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
  const [coHostPhoneDraft, setCoHostPhoneDraft] = useState("");
  const [coHostFeedback, setCoHostFeedback] = useState<HostBroadcastFeedback | null>(null);
  const [coHostMutation, setCoHostMutation] = useState<{
    id: string;
    action: "add" | "remove";
  } | null>(null);
  const [coHostProfiles, setCoHostProfiles] = useState<Record<string, CoHostProfile>>({});
  const [isContactHostComposerOpen, setIsContactHostComposerOpen] = useState(false);
  const [contactHostMessage, setContactHostMessage] = useState("");
  const [contactHostSending, setContactHostSending] = useState(false);
  const [contactHostFeedback, setContactHostFeedback] =
    useState<HostBroadcastFeedback | null>(null);
  const [isCancelTailgateModalOpen, setIsCancelTailgateModalOpen] = useState(false);
  const [cancelTailgateSubmitting, setCancelTailgateSubmitting] = useState(false);
  const [cancelTailgateFeedback, setCancelTailgateFeedback] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);
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
    const storageService = firebaseStorage;
    if (!storageService || rawCoverImageUrls.length === 0) return;
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
          return await getDownloadURL(ref(storageService, normalized));
        }
        if (
          normalized.includes("firebasestorage.googleapis.com") ||
          normalized.includes("storage.googleapis.com")
        ) {
          return await getDownloadURL(ref(storageService, normalized));
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
    if (!id) {
      setQuizLoading(false);
      setQuizError("Missing tailgate id.");
      return;
    }

    if (!detail || detail.visibilityType !== "private") {
      setQuizLoading(false);
      setQuizError(null);
      setQuizDocId(null);
      setQuizTitle("");
      setQuizTitleError("");
      setQuizQuestions([createEmptyQuizQuestion([])]);
      setCurrentQuizQuestionIndex(0);
      setQuizErrors({});
      setQuizValidationMessage(null);
      return;
    }

    if (!db) {
      setQuizLoading(false);
      setQuizError("Quiz is unavailable in this environment.");
      return;
    }

    setQuizLoading(true);
    setQuizError(null);
    const quizzesCollection = collection(db, "tailgateEvents", id, "quizzes");
    const unsubscribe = onSnapshot(
      quizzesCollection,
      (snapshot) => {
        if (snapshot.empty) {
          setQuizDocId(null);
          setQuizTitle("");
          setQuizTitleError("");
          setQuizQuestions([createEmptyQuizQuestion([])]);
          setCurrentQuizQuestionIndex(0);
          setQuizErrors({});
          setQuizValidationMessage(null);
          setQuizLoading(false);
          return;
        }

        const sortedDocs = [...snapshot.docs].sort((left, right) => {
          const leftData = left.data() as Record<string, unknown>;
          const rightData = right.data() as Record<string, unknown>;
          const leftDate =
            normalizeDate(leftData.updatedAt) ??
            normalizeDate(leftData.createdAt) ??
            new Date(0);
          const rightDate =
            normalizeDate(rightData.updatedAt) ??
            normalizeDate(rightData.createdAt) ??
            new Date(0);
          return rightDate.getTime() - leftDate.getTime();
        });
        const selectedSnapshot = sortedDocs[0];
        const selectedData = selectedSnapshot.data() as Record<string, unknown>;
        const normalizedQuestions = normalizeQuizQuestions(selectedData.questions);

        setQuizDocId(selectedSnapshot.id);
        setQuizTitle(firstString(selectedData.title) ?? "");
        setQuizTitleError("");
        setQuizQuestions(
          normalizedQuestions.length > 0 ? normalizedQuestions : [createEmptyQuizQuestion([])]
        );
        setCurrentQuizQuestionIndex(0);
        setQuizErrors({});
        setQuizValidationMessage(null);
        setQuizError(null);
        setQuizLoading(false);
      },
      (snapshotError) => {
        console.error("Failed to load quiz", snapshotError);
        setQuizLoading(false);
        setQuizError("Unable to load quiz.");
      }
    );

    return () => unsubscribe();
  }, [id, detail?.visibilityType]);

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
  const contactEventHost = useMemo(() => {
    if (!firebaseApp) return null;
    return httpsCallable<ContactEventHostInput, ContactEventHostResponse>(
      getFunctions(firebaseApp),
      "contactEventHost"
    );
  }, []);
  const addTailgateCoHost = useMemo(() => {
    if (!firebaseFunctions) return null;
    return httpsCallable(firebaseFunctions, "addTailgateCoHost");
  }, []);
  const removeTailgateCoHost = useMemo(() => {
    if (!firebaseFunctions) return null;
    return httpsCallable(firebaseFunctions, "removeTailgateCoHost");
  }, []);

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
    setCoHostPhoneDraft("");
    setCoHostFeedback(null);
    setCoHostMutation(null);
    setCoHostProfiles({});
    setIsCancelTailgateModalOpen(false);
    setCancelTailgateSubmitting(false);
    setCancelTailgateFeedback(null);
  }, [detail?.id]);

  useEffect(() => {
    if (!detail || !db) {
      setCoHostProfiles({});
      return;
    }
    const firestore = db;

    const coHostIds = detail.coHostIds.filter((value) => value !== detail.hostId);
    if (coHostIds.length === 0) {
      setCoHostProfiles({});
      return;
    }

    let cancelled = false;
    const loadProfiles = async () => {
      try {
        const entries = await Promise.all(
          coHostIds.map(async (uid) => {
            try {
              const snapshot = await getDoc(doc(firestore, "users", uid));
              const data = snapshot.exists() ? (snapshot.data() as Record<string, unknown>) : {};
              return [
                uid,
                {
                  userId: uid,
                  displayName:
                    firstString(data.displayName, data.fullName, data.name) ?? "Co-host",
                  phone: firstString(data.phoneNumber, data.phone) ?? null
                } satisfies CoHostProfile
              ] as const;
            } catch (error) {
              console.error("Failed loading co-host profile", uid, error);
              return [
                uid,
                {
                  userId: uid,
                  displayName: "Co-host",
                  phone: null
                } satisfies CoHostProfile
              ] as const;
            }
          })
        );
        if (!cancelled) {
          setCoHostProfiles(Object.fromEntries(entries));
        }
      } catch (error) {
        console.error("Failed loading co-host profiles", error);
        if (!cancelled) {
          setCoHostProfiles({});
        }
      }
    };

    void loadProfiles();
    return () => {
      cancelled = true;
    };
  }, [detail, detail?.coHostIds, detail?.hostId]);

  useEffect(() => {
    if (status !== "cancelled") return;
    setIsCancelTailgateModalOpen(false);
  }, [status]);

  useEffect(() => {
    setTicketQuantity(1);
    setCheckoutError(null);
  }, [detail?.id]);

  useEffect(() => {
    if (!detail || detail.visibilityType !== "open_paid" || isHostUser) {
      setHasConfirmedTicket(true);
      setTicketCheckState("confirmed");
      setConfirmedTicketCount(0);
      return;
    }
    if (!user?.uid || !db) {
      setHasConfirmedTicket(false);
      setTicketCheckState("missing");
      setConfirmedTicketCount(0);
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
        const tickets = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Record<string, unknown>;
          const ticketStatus = normalizeTicketLifecycleStatus(data.status);
          return {
            ticketId: docSnap.id,
            isConfirmedTicket: isConfirmedPaidTicketStatus(ticketStatus)
          };
        });

        newTicketCount = tickets.filter((ticket) => ticket.isConfirmedTicket).length;
        hasNewSnapshot = true;
        applyTicketState();
      },
      (snapshotError) => {
        console.error("Ticket lookup failed", snapshotError);
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

  const exactPinCoords = resolveExactPinCoords(detail?.locationRaw);
  const hasExactPin = Boolean(exactPinCoords);
  const resolvedLocationText =
    detail?.locationSummary ?? resolveLocationString(detail?.locationRaw);
  const displayLocationLabel =
    resolvedLocationText && !isCoordinateString(resolvedLocationText)
      ? resolvedLocationText
      : undefined;
  const generalMeetupCoords = detail?.locationCoords ?? null;
  const mapCoords = exactPinCoords ?? generalMeetupCoords;
  const locationLabel =
    displayLocationLabel ??
    (hasExactPin
      ? "Pin dropped. Tap map below to navigate."
      : mapCoords
      ? "General meetup area selected."
      : "Location not set");
  const meetUpSubtitle =
    displayLocationLabel ??
    (hasExactPin
      ? "Pin dropped. Tap map below to navigate."
      : mapCoords
      ? "General meetup area selected."
      : "Location coming soon.");
  const locationDirectionQuery = mapCoords
    ? `${mapCoords.lat},${mapCoords.lng}`
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
  const mapUrl = mapCoords
    ? buildMapEmbedUrl(mapCoords, MAPS_API_KEY)
    : null;
  const checkoutResult = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const value = params.get("checkout");
    return value === "success" || value === "cancel" ? value : null;
  }, [location.search]);
  const checkoutPurchaseId = useMemo(() => {
    const routerParams = new URLSearchParams(location.search);
    const routerValue = routerParams.get("purchaseId");
    if (typeof routerValue === "string" && routerValue.trim().length > 0) {
      return routerValue.trim();
    }
    const browserValue = new URLSearchParams(window.location.search).get("purchaseId");
    return typeof browserValue === "string" && browserValue.trim().length > 0
      ? browserValue.trim()
      : null;
  }, [location.search]);
  const isEmbeddedMapPanel = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("embed") === "discover-map";
  }, [location.search]);

  useEffect(() => {
    if (checkoutResult !== "success" || !checkoutPurchaseId || !db) {
      setCheckoutPurchaseStatus(null);
      setCheckoutPurchaseLoading(false);
      return;
    }

    setCheckoutPurchaseLoading(true);
    const purchaseRef = doc(db, "ticketPurchases", checkoutPurchaseId);
    const unsubscribe = onSnapshot(
      purchaseRef,
      (snapshot) => {
        const nextStatus = snapshot.exists()
          ? ((snapshot.data()?.status as CheckoutPurchaseStatus | undefined) ?? "checkout_created")
          : "checkout_created";
        setCheckoutPurchaseStatus(nextStatus);
        setCheckoutPurchaseLoading(false);
      },
      (snapshotError) => {
        console.error("Failed to watch checkout purchase status", snapshotError);
        setCheckoutPurchaseStatus(null);
        setCheckoutPurchaseLoading(false);
      }
    );

    return () => unsubscribe();
  }, [checkoutPurchaseId, checkoutResult]);

  const attendeeCounts = useMemo(() => {
    if (!detail) {
      return {
        all: 0,
        going: 0,
        pending: 0,
        notGoing: 0,
        nonHost: 0,
        anonymousPlusGoing: 0,
        totalHeadcount: 0,
        goingHeadcount: 0
      };
    }
    const all = detail.attendees;
    const nonHost = all.filter((attendee) => attendee.status !== "Host");
    const going = nonHost.filter((attendee) => attendee.status === "Attending");
    const anonymousPlusGoing = going.reduce(
      (sum, attendee) => sum + resolveAnonymousPlusGuests(attendee),
      0
    );
    return {
      all: all.length,
      nonHost: nonHost.length,
      going: going.length,
      pending: nonHost.filter((attendee) => attendee.status === "Pending").length,
      notGoing: nonHost.filter((attendee) => attendee.status === "Not Attending").length,
      anonymousPlusGoing,
      totalHeadcount: nonHost.length + anonymousPlusGoing,
      goingHeadcount: going.length + anonymousPlusGoing
    };
  }, [detail]);

  const filteredAttendees = useMemo(() => {
    if (!detail) return [];
    return detail.attendees.filter((attendee) => {
      if (attendeeFilter === "All") return attendee.status !== "Host";
      if (attendeeFilter === "Going") return attendee.status === "Attending";
      if (attendeeFilter === "Pending") return attendee.status === "Pending";
      if (attendeeFilter === "Not Going") return attendee.status === "Not Attending";
      return true;
    });
  }, [attendeeFilter, detail]);
  const inviteQueryGuestId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const value = params.get("guestId");
    return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
  }, [location.search]);
  const inviteQueryToken = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const value = params.get("token");
    return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
  }, [location.search]);
  const rsvpAttendee = useMemo(() => {
    if (!detail) return null;
    if (inviteQueryGuestId) {
      const inviteMatch =
        detail.attendees.find((attendee) => attendee.id === inviteQueryGuestId) ?? null;
      if (!inviteMatch) {
        return null;
      }
      if (inviteQueryToken && inviteMatch.token !== inviteQueryToken) {
        return null;
      }
      return inviteMatch;
    }
    if (!user?.uid) return null;
    return detail.attendees.find((attendee) => attendee.userId === user.uid) ?? null;
  }, [detail, inviteQueryGuestId, inviteQueryToken, user?.uid]);
  const loggedInInviteAttendee = useMemo(() => {
    if (!detail || !user?.uid) return null;
    return (
      detail.attendees.find(
        (attendee) =>
          attendee.userId === user.uid && attendee.isAdditionalGuestInvite !== true
      ) ?? null
    );
  }, [detail, user?.uid]);
  const openFreeCurrentAttendee = useMemo(() => {
    if (!detail || detail.visibilityType !== "open_free" || !user?.uid) return null;
    return (
      detail.attendees.find(
        (attendee) =>
          attendee.userId === user.uid && attendee.isAdditionalGuestInvite !== true
      ) ?? null
    );
  }, [detail, user?.uid]);
  const userRsvpStatus: AttendeeStatus = rsvpAttendee?.status ?? "Pending";
  const plusGuestLimit = useMemo(() => {
    const configured = detail?.maxAdditionalGuestsPerInvite ?? 0;
    if (typeof configured === "number" && Number.isFinite(configured) && configured > 0) {
      return Math.min(Math.floor(configured), DEFAULT_PLUS_LIMIT);
    }
    return DEFAULT_PLUS_LIMIT;
  }, [detail?.maxAdditionalGuestsPerInvite]);
  const plusGuestsEnabled =
    detail?.visibilityType === "private" &&
    detail?.allowGuestPlusOnInvite === true &&
    rsvpDraftChoice === "Attending";
  const canAddContactGuest = plusGuestsEnabled && invitePlusGuests.length < plusGuestLimit;
  const canRespondToInviteViaLink = Boolean(rsvpAttendee && inviteQueryGuestId && inviteQueryToken);
  const canContactHost = Boolean(
    detail &&
      user?.uid &&
      !isHostUser &&
      (detail.visibilityType === "open_free" ||
        detail.visibilityType === "open_paid" ||
        Boolean(loggedInInviteAttendee))
  );
  const isOpenFreeUserGoing =
    normalizeStatus(openFreeCurrentAttendee?.status) === "Attending";
  const openFreeBringLabel =
    openFreePartySize === 1 ? "Just me" : `${openFreePartySize} people total`;
  const hostDisplayName = detail?.hostName?.trim() || "Host";
  const publicHostDisplayName =
    detail?.visibilityType === "open_free" || detail?.visibilityType === "open_paid"
      ? getFirstName(hostDisplayName)
      : hostDisplayName;
  const contactHostCharacterCount = contactHostMessage.length;
  const canSendContactHost =
    canContactHost &&
    contactHostMessage.trim().length >= 10 &&
    contactHostCharacterCount <= MAX_CONTACT_HOST_MESSAGE_LENGTH &&
    !contactHostSending;
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

  useEffect(() => {
    setRsvpDraftChoice(normalizeInviteRsvpChoice(rsvpAttendee?.status));
  }, [rsvpAttendee?.status]);

  useEffect(() => {
    if (!rsvpAttendee) {
      setInviteGuestCount("0");
      setInvitePlusGuests([]);
      return;
    }

    const inviterGuestId = rsvpAttendee.id;
    if (!inviterGuestId || !detail) {
      setInvitePlusGuests([]);
      setInviteGuestCount(String(resolveAnonymousPlusGuests(rsvpAttendee)));
      return;
    }

    const existingPlusGuests = detail.attendees
      .filter(
        (attendee) =>
          attendee.isAdditionalGuestInvite === true &&
          attendee.invitedByGuestId === inviterGuestId
      )
      .map((attendee, index) => ({
        id: `${attendee.id || "existing"}-${index}`,
        attendeeId: attendee.id,
        name: attendee.name.trim(),
        phone: attendee.phone ?? ""
      }));

    const anonymousOnlyCount = resolveAnonymousPlusGuests(rsvpAttendee);
    setInvitePlusGuests(existingPlusGuests);
    setInviteGuestCount(String(anonymousOnlyCount + existingPlusGuests.length));
  }, [detail, rsvpAttendee]);

  useEffect(() => {
    if (!detail || detail.visibilityType !== "open_free") {
      setOpenFreePartySize(1);
      return;
    }
    const attendeePartySize =
      openFreeCurrentAttendee && normalizeStatus(openFreeCurrentAttendee.status) === "Attending"
        ? 1 + resolveAnonymousPlusGuests(openFreeCurrentAttendee)
        : 1;
    setOpenFreePartySize(clampOpenFreePartySize(attendeePartySize));
  }, [detail, openFreeCurrentAttendee]);

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
  const eventSizeBaseCount =
    detail?.visibilityType === "open_paid" ? confirmedPaidCount : attendeeCounts.goingHeadcount;
  const eventSizeTag = getTailgateCrowdTag(eventSizeBaseCount);
  const eventSizeSummary = detail
    ? buildEventSizeSummary({
        visibilityType: detail.visibilityType,
        confirmedCount: eventSizeBaseCount,
        ticketPriceCents: detail.ticketPriceCents
      })
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
  const showOpenFreeRsvpSection =
    detail?.visibilityType === "open_free" && !isHostUser && status !== "cancelled";
  const canShowWhosComingSection = detail?.visibilityType === "private";
  const canManageGuestInvites = isHostUser && detail?.visibilityType === "private";
  const canManageQuiz = isHostUser && detail?.visibilityType === "private";
  const currentQuizQuestion =
    quizQuestions[currentQuizQuestionIndex] ?? EMPTY_QUIZ_QUESTION_FALLBACK;
  const currentQuizErrors = quizErrors[currentQuizQuestionIndex] ?? {};
  const existingQuizQuestionCount = quizQuestions.filter(
    (question) => question.questionText.trim() !== ""
  ).length;
  const hostBroadcastCharacterCount = hostBroadcastMessage.length;
  const canSendHostBroadcast =
    isHostUser &&
    hostBroadcastMessage.trim().length > 0 &&
    hostBroadcastCharacterCount <= MAX_HOST_BROADCAST_MESSAGE_LENGTH &&
    !hostBroadcastSending &&
    Boolean(sendHostTextToAttendees);
  const canManageCoHosts =
    isEventHost && detail?.visibilityType === "open_paid" && status !== "cancelled";
  const activeCoHostIds = detail?.coHostIds.filter((value) => value !== detail.hostId) ?? [];
  const pendingCoHostInvites = detail?.coHostInvites ?? [];
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
    if (!detail || !id || !db || isHostUser || rsvpSaving) return;

    const inviteAttendee = rsvpAttendee;
    const useInviteRsvpFlow =
      detail.visibilityType === "private" &&
      Boolean(inviteAttendee?.id) &&
      (Boolean(user?.uid) || Boolean(inviteAttendee?.token));
    const canFallbackToDirectUpdate = Boolean(user?.uid);

    if (!useInviteRsvpFlow && !canFallbackToDirectUpdate) {
      setRsvpError("Sign in or open your invite link to RSVP.");
      return;
    }
    if (userRsvpStatus === nextStatus && !useInviteRsvpFlow) return;

    const eventRef = doc(db, "tailgateEvents", id);
    setRsvpSaving(true);
    setRsvpPendingChoice(nextStatus);
    setRsvpError(null);
    setRsvpSuccess(null);

    try {
      if (useInviteRsvpFlow && inviteAttendee) {
        const incompleteGuest = invitePlusGuests.find((guest) => {
          const phoneDigits = toPhoneDigits(guest.phone);
          return phoneDigits.length > 0 && phoneDigits.length < 10;
        });
        if (incompleteGuest) {
          setRsvpError("Enter a full 10-digit phone number for each guest contact.");
          return;
        }

        const totalGuestsRequested = Math.max(0, Number(inviteGuestCount || "0") || 0);
        const payloadGuests = nextStatus === "Attending"
          ? invitePlusGuests
              .map((guest) => ({
                attendeeId: guest.attendeeId,
                name: guest.name.trim(),
                phone: formatPhoneInput(guest.phone).trim()
              }))
              .filter((guest) => toPhoneDigits(guest.phone).length === 10)
          : [];
        const payload: InviteRsvpPayload = {
          eventId: id,
          guestId: inviteAttendee.id,
          token: inviteAttendee.token,
          rsvpStatus: nextStatus === "Attending" ? "yes" : "no",
          anonymousGuestCount:
            nextStatus === "Attending"
              ? Math.max(totalGuestsRequested - payloadGuests.length, 0)
              : 0,
          additionalGuests: payloadGuests
        };

        if (user?.uid) {
          if (!firebaseFunctions) {
            throw new Error("Firebase functions are unavailable.");
          }
          const submitInviteRsvp = httpsCallable(firebaseFunctions, "submitInviteRsvp");
          try {
            await submitInviteRsvp(payload);
          } catch (callableError) {
            if (inviteAttendee.id && inviteAttendee.token && isUnauthenticatedError(callableError)) {
              await submitInviteRsvpViaHttp(payload);
            } else {
              throw callableError;
            }
          }
        } else {
          await submitInviteRsvpViaHttp(payload);
        }

        const refreshedSnapshot = await getDoc(eventRef);
        if (!refreshedSnapshot.exists()) {
          setRsvpError("Tailgate not found.");
          return;
        }
        const refreshedData = refreshedSnapshot.data() as Record<string, unknown>;
        setDetail((previous) => {
          if (!previous) return previous;
          return {
            ...previous,
            attendees: normalizeAttendees(
              refreshedData.attendees,
              previous.hostId,
              previous.hostName
            )
          };
        });
      } else {
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
          return attendeeUserId === user?.uid;
        });

        const fallbackName = firstString(user?.displayName, user?.email) ?? "Guest";

        if (attendeeIndex >= 0) {
          const existing = asRecord(attendeesRaw[attendeeIndex]) ?? {};
          attendeesRaw[attendeeIndex] = {
            ...existing,
            id: firstString(existing.id, user?.uid) ?? user?.uid,
            userId:
              firstString(existing.userId, existing.uid, existing.id, user?.uid) ??
              user?.uid,
            name:
              firstString(
                existing.name,
                existing.displayName,
                user?.displayName,
                user?.email
              ) ?? fallbackName,
            displayName:
              firstString(
                existing.displayName,
                existing.name,
                user?.displayName,
                user?.email
              ) ?? fallbackName,
            status: nextStatus
          };
        } else if (user?.uid) {
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
      }

      setRsvpDraftChoice(nextStatus);
      setRsvpSuccess(nextStatus === "Attending" ? "RSVP updated to Going." : "RSVP updated to Not Going.");
    } catch (rsvpUpdateError) {
      console.error("Failed to update RSVP", rsvpUpdateError);
      const code = errorCodeValue(rsvpUpdateError);
      if (code.includes("not-found")) {
        setRsvpError("Invite not found.");
      } else if (code.includes("permission-denied")) {
        setRsvpError("This invite is not valid.");
      } else if (code.includes("unauthenticated")) {
        setRsvpError("Sign in or use your invite link to RSVP.");
      } else {
        setRsvpError("Unable to update RSVP right now.");
      }
    } finally {
      setRsvpSaving(false);
      setRsvpPendingChoice(null);
    }
  };

  const handleOpenFreePartySizeChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    if (!digitsOnly) {
      setOpenFreePartySize(1);
      return;
    }
    setOpenFreePartySize(clampOpenFreePartySize(Number(digitsOnly)));
  };

  const adjustOpenFreePartySize = (delta: number) => {
    setOpenFreePartySize((previous) => clampOpenFreePartySize(previous + delta));
  };

  const saveOpenFreeRsvp = async () => {
    if (!detail || !id || !db || detail.visibilityType !== "open_free" || isHostUser) return;
    if (!user?.uid) {
      navigate(
        `/login?mode=login&redirect=${encodeURIComponent(`${location.pathname}${location.search}`)}`
      );
      return;
    }

    const safePartySize = clampOpenFreePartySize(openFreePartySize);
    const plusGuestCount = Math.max(0, safePartySize - 1);

    setRsvpSaving(true);
    setRsvpPendingChoice("Attending");
    setRsvpError(null);
    setRsvpSuccess(null);

    try {
      if (!firebaseFunctions) {
        throw new Error("Firebase functions are unavailable.");
      }

      const submitAuthenticatedEventRsvp = httpsCallable<
        { eventId: string; rsvpStatus: "yes" | "no"; anonymousGuestCount: number },
        { ok?: boolean; status?: string }
      >(firebaseFunctions, "submitAuthenticatedEventRsvp");

      await submitAuthenticatedEventRsvp({
        eventId: id,
        rsvpStatus: "yes",
        anonymousGuestCount: plusGuestCount
      });

      const refreshedSnapshot = await getDoc(doc(db, "tailgateEvents", id));
      if (refreshedSnapshot.exists()) {
        const refreshedData = refreshedSnapshot.data() as Record<string, unknown>;
        setDetail((previous) => {
          if (!previous) return previous;
          return {
            ...previous,
            attendees: normalizeAttendees(
              refreshedData.attendees,
              previous.hostId,
              previous.hostName
            )
          };
        });
      }

      setRsvpSuccess(isOpenFreeUserGoing ? "Your group size was updated." : "You're on the list.");
    } catch (error) {
      console.error("Failed to save open free RSVP", error);
      setRsvpError("Unable to save RSVP right now.");
    } finally {
      setRsvpSaving(false);
      setRsvpPendingChoice(null);
    }
  };

  const openMaps = () => {
    if (!canOpenMaps) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      locationDirectionQuery
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const copyEventShareLink = () => {
    const shareUrl = `${window.location.origin}/#/tailgates/${detail?.id ?? id ?? ""}`;
    navigator.clipboard?.writeText(shareUrl);
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
      const purchaseIdPlaceholder = "{purchaseId}";
      const returnBaseUrl = `${window.location.origin}${window.location.pathname}`;
      const successUrl = `${returnBaseUrl}?purchaseId=${encodeURIComponent(
        purchaseIdPlaceholder
      )}#/tailgates/${encodeURIComponent(detail.id)}?checkout=success&purchaseId=${encodeURIComponent(
        purchaseIdPlaceholder
      )}`;
      const cancelUrl = `${returnBaseUrl}?purchaseId=${encodeURIComponent(
        purchaseIdPlaceholder
      )}#/tailgates/${encodeURIComponent(detail.id)}?checkout=cancel&purchaseId=${encodeURIComponent(
        purchaseIdPlaceholder
      )}`;
      const createSession = httpsCallable(
        firebaseFunctions,
        "createTailgateCheckoutSession"
      );
      const result = await createSession({
        tailgateId: detail.id,
        quantity: sanitizedQuantity,
        channel: "web",
        successUrl,
        cancelUrl
      });
      const data = result.data as {
        purchaseId?: string | null;
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

  const dropLocationPin = () => {
    if (!detail || !id || !db) return;
    const firestore = db;
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
          await updateDoc(doc(firestore, "tailgateEvents", id), {
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

  const scrollToQuiz = () => {
    quizSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const updateQuizQuestionText = (text: string) => {
    setQuizQuestions((previous) => {
      const next = [...previous];
      const target = next[currentQuizQuestionIndex];
      if (!target) return previous;
      next[currentQuizQuestionIndex] = {
        ...target,
        questionText: text
      };
      return next;
    });

    setQuizErrors((previous) => {
      const next = { ...previous };
      const current = next[currentQuizQuestionIndex];
      if (!current?.questionText || !text.trim()) return previous;
      const updated: QuizQuestionError = { ...current };
      delete updated.questionText;
      if (!updated.choices && !updated.correctChoiceId) {
        delete next[currentQuizQuestionIndex];
      } else {
        next[currentQuizQuestionIndex] = updated;
      }
      return next;
    });
    setQuizValidationMessage(null);
    setQuizError(null);
    setQuizSuccess(null);
  };

  const updateQuizChoiceText = (choiceId: string, text: string) => {
    setQuizQuestions((previous) => {
      const next = [...previous];
      const target = next[currentQuizQuestionIndex];
      if (!target) return previous;
      next[currentQuizQuestionIndex] = {
        ...target,
        choices: target.choices.map((choice) =>
          choice.id === choiceId
            ? {
                ...choice,
                text
              }
            : choice
        )
      };
      return next;
    });

    setQuizErrors((previous) => {
      const next = { ...previous };
      const current = next[currentQuizQuestionIndex];
      const choiceErrors = current?.choices;
      if (!choiceErrors?.[choiceId] || !text.trim()) return previous;
      const updatedChoiceErrors = { ...choiceErrors };
      delete updatedChoiceErrors[choiceId];
      const updated: QuizQuestionError = {
        ...current,
        choices: Object.keys(updatedChoiceErrors).length > 0 ? updatedChoiceErrors : undefined
      };
      if (!updated.questionText && !updated.correctChoiceId && !updated.choices) {
        delete next[currentQuizQuestionIndex];
      } else {
        next[currentQuizQuestionIndex] = updated;
      }
      return next;
    });
    setQuizValidationMessage(null);
    setQuizError(null);
    setQuizSuccess(null);
  };

  const setQuizCorrectChoice = (choiceId: string) => {
    setQuizQuestions((previous) => {
      const next = [...previous];
      const target = next[currentQuizQuestionIndex];
      if (!target) return previous;
      next[currentQuizQuestionIndex] = {
        ...target,
        correctChoiceId: choiceId
      };
      return next;
    });

    setQuizErrors((previous) => {
      const next = { ...previous };
      const current = next[currentQuizQuestionIndex];
      if (!current?.correctChoiceId) return previous;
      const updated: QuizQuestionError = { ...current };
      delete updated.correctChoiceId;
      if (!updated.questionText && !updated.choices) {
        delete next[currentQuizQuestionIndex];
      } else {
        next[currentQuizQuestionIndex] = updated;
      }
      return next;
    });
    setQuizValidationMessage(null);
    setQuizError(null);
    setQuizSuccess(null);
  };

  const isQuizQuestionComplete = (question: QuizQuestion): boolean => {
    if (!question.questionText.trim()) return false;
    if (question.choices.some((choice) => !choice.text.trim())) return false;
    if (!question.correctChoiceId) return false;
    return true;
  };

  const setQuizQuestionType = (type: "multiple" | "truefalse") => {
    setQuizQuestions((previous) => {
      const next = [...previous];
      const target = next[currentQuizQuestionIndex];
      if (!target) return previous;
      next[currentQuizQuestionIndex] = {
        ...target,
        type,
        choices:
          type === "truefalse"
            ? [
                { id: "true", text: "True" },
                { id: "false", text: "False" }
              ]
            : [
                { id: "a", text: "" },
                { id: "b", text: "" },
                { id: "c", text: "" },
                { id: "d", text: "" }
              ],
        correctChoiceId: type === "truefalse" ? "true" : null
      };
      return next;
    });
    setQuizErrors((previous) => {
      const next = { ...previous };
      delete next[currentQuizQuestionIndex];
      return next;
    });
    setQuizValidationMessage(null);
    setQuizError(null);
    setQuizSuccess(null);
  };

  const handleAddQuizQuestion = () => {
    if (quizQuestions.length >= MAX_QUIZ_QUESTIONS) {
      setQuizValidationMessage(`Maximum of ${MAX_QUIZ_QUESTIONS} questions allowed.`);
      return;
    }
    const newQuestion = createEmptyQuizQuestion(quizQuestions);
    setQuizQuestions((previous) => [...previous, newQuestion]);
    setCurrentQuizQuestionIndex(quizQuestions.length);
    setQuizValidationMessage(null);
    setQuizError(null);
    setQuizSuccess(null);
  };

  const handleDeleteCurrentQuizQuestion = () => {
    if (quizQuestions.length === 1) {
      setQuizQuestions([createEmptyQuizQuestion([])]);
      setCurrentQuizQuestionIndex(0);
      setQuizErrors({});
      setQuizValidationMessage(null);
      setQuizError(null);
      return;
    }

    const deleteIndex = currentQuizQuestionIndex;
    const nextQuestions = quizQuestions.filter((_, index) => index !== deleteIndex);
    setQuizQuestions(nextQuestions);
    setQuizErrors((previous) => {
      const next: Record<number, QuizQuestionError> = {};
      Object.entries(previous).forEach(([indexKey, value]) => {
        const index = Number(indexKey);
        if (index < deleteIndex) {
          next[index] = value;
        } else if (index > deleteIndex) {
          next[index - 1] = value;
        }
      });
      return next;
    });
    setCurrentQuizQuestionIndex(
      deleteIndex >= nextQuestions.length ? nextQuestions.length - 1 : deleteIndex
    );
    setQuizValidationMessage(null);
    setQuizError(null);
    setQuizSuccess(null);
  };

  const validateQuizDraft = (): boolean => {
    let valid = true;
    const nextErrors: Record<number, QuizQuestionError> = {};
    const normalizedTitle = quizTitle.trim();
    setQuizValidationMessage(null);
    setQuizError(null);

    if (!normalizedTitle) {
      setQuizTitleError("Quiz name is required.");
      valid = false;
    } else {
      setQuizTitleError("");
    }

    const filledQuestions = quizQuestions.filter(
      (question) => question.questionText.trim() !== ""
    );

    if (filledQuestions.length === 0) {
      setQuizValidationMessage("Please add at least one question.");
      setQuizErrors({});
      return false;
    }

    if (filledQuestions.length > MAX_QUIZ_QUESTIONS) {
      setQuizValidationMessage(`Maximum of ${MAX_QUIZ_QUESTIONS} questions allowed.`);
      setQuizErrors({});
      return false;
    }

    filledQuestions.forEach((question, questionOrder) => {
      const questionIndex = quizQuestions.findIndex((value) => value.id === question.id);
      if (questionIndex < 0) return;

      if (!question.questionText.trim()) {
        nextErrors[questionIndex] = {
          ...(nextErrors[questionIndex] ?? {}),
          questionText: `Question ${questionOrder + 1} text is required.`
        };
        valid = false;
      }

      const choiceErrors: Record<string, string> = {};
      question.choices.forEach((choice) => {
        if (!choice.text.trim()) {
          choiceErrors[choice.id] = `Choice ${choice.id.toUpperCase()} is required.`;
          valid = false;
        }
      });
      if (Object.keys(choiceErrors).length > 0) {
        nextErrors[questionIndex] = {
          ...(nextErrors[questionIndex] ?? {}),
          choices: choiceErrors
        };
      }

      if (!question.correctChoiceId) {
        nextErrors[questionIndex] = {
          ...(nextErrors[questionIndex] ?? {}),
          correctChoiceId: `Please select a correct answer for question ${questionOrder + 1}.`
        };
        valid = false;
      }
    });

    setQuizErrors(nextErrors);
    return valid;
  };

  const saveQuiz = async () => {
    if (!db || !id || !detail) {
      setQuizError("Quiz is unavailable right now.");
      return;
    }
    if (!user?.uid) {
      setQuizError("Sign in to save quiz changes.");
      return;
    }
    if (!canManageQuiz) {
      setQuizError("Quiz management is available for hosts of invite-only events.");
      return;
    }
    if (!validateQuizDraft()) {
      setQuizError("Complete quiz details before saving.");
      return;
    }

    const normalizedQuestions = quizQuestions
      .filter((question) => question.questionText.trim() !== "")
      .map((question) => ({
        id: question.id,
        questionText: question.questionText.trim(),
        choices: question.choices.map((choice) => ({
          id: choice.id,
          text: choice.text.trim()
        })),
        correctChoiceId: question.correctChoiceId,
        type: question.type
      }));

    const payload = {
      eventId: id,
      title: quizTitle.trim(),
      questions: normalizedQuestions,
      createdBy: user.uid,
      updatedAt: new Date()
    };

    setQuizSaving(true);
    setQuizError(null);
    setQuizSuccess(null);
    try {
      if (quizDocId) {
        await updateDoc(doc(db, "tailgateEvents", id, "quizzes", quizDocId), payload);
      } else {
        await addDoc(collection(db, "tailgateEvents", id, "quizzes"), {
          ...payload,
          createdAt: new Date()
        });
      }

      await updateDoc(doc(db, "tailgateEvents", id), {
        quiz: {
          title: quizTitle.trim(),
          questions: normalizedQuestions
        },
        updatedAt: new Date()
      });
      setQuizSuccess(quizDocId ? "Quiz updated." : "Quiz saved.");
    } catch (saveError) {
      console.error("Failed to save quiz", saveError);
      setQuizError("Unable to save quiz.");
    } finally {
      setQuizSaving(false);
    }
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

  const handleContactHostMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const nextValue = event.target.value.slice(0, MAX_CONTACT_HOST_MESSAGE_LENGTH);
    setContactHostMessage(nextValue);
    if (contactHostFeedback) {
      setContactHostFeedback(null);
    }
  };

  const openContactHostComposer = () => {
    setIsContactHostComposerOpen(true);
    setContactHostFeedback(null);
  };

  const closeContactHostComposer = () => {
    setIsContactHostComposerOpen(false);
    setContactHostFeedback(null);
    setContactHostMessage("");
  };

  const sendHostBroadcastMessage = async () => {
    if (!detail) return;
    if (!isHostUser) {
      setHostBroadcastFeedback({
        tone: "error",
        text: "Only the host or a co-host can message attendees."
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
          text: "Only the host or a co-host can message attendees."
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

  const addCoHostByPhone = async () => {
    if (!detail) return;
    if (!isEventHost) {
      setCoHostFeedback({
        tone: "error",
        text: "Only the host can manage co-hosts."
      });
      return;
    }
    if (!addTailgateCoHost) {
      setCoHostFeedback({
        tone: "error",
        text: "Co-host tools are unavailable in this environment."
      });
      return;
    }

    const phone = formatPhoneInput(coHostPhoneDraft);
    const digits = toPhoneDigits(phone);
    if (digits.length !== 10) {
      setCoHostFeedback({
        tone: "error",
        text: "Enter a valid 10-digit phone number."
      });
      return;
    }

    setCoHostMutation({ id: digits, action: "add" });
    setCoHostFeedback(null);
    try {
      const result = await addTailgateCoHost({
        tailgateId: detail.id,
        phoneNumber: phone
      });
      const response = (result.data ?? {}) as {
        accountLinked?: boolean;
        textSent?: boolean;
      };
      setCoHostPhoneDraft("");
      setCoHostFeedback({
        tone: "success",
        text: response.accountLinked
          ? response.textSent === false
            ? "Co-host added. Text delivery was unavailable."
            : "Co-host added and text sent."
          : response.textSent === false
          ? "Pending co-host added. They need a TailgateTime account on this number."
          : "Co-host text sent. They need a TailgateTime account on this number to access tools."
      });
    } catch (error) {
      const message = errorMessageValue(error);
      if (message.includes("not_authorized")) {
        setCoHostFeedback({ tone: "error", text: "Only the host can manage co-hosts." });
      } else if (message.includes("invalid_phone")) {
        setCoHostFeedback({ tone: "error", text: "Enter a valid 10-digit phone number." });
      } else if (message.includes("invalid_cohost")) {
        setCoHostFeedback({ tone: "error", text: "You can't add the host as a co-host." });
      } else if (message.includes("cohost_exists")) {
        setCoHostFeedback({ tone: "error", text: "That co-host is already added." });
      } else {
        setCoHostFeedback({ tone: "error", text: "Unable to add co-host right now." });
      }
    } finally {
      setCoHostMutation(null);
    }
  };

  const removeCoHostEntry = async (params: { userId?: string; phoneNumber?: string }) => {
    if (!detail) return;
    if (!isEventHost) {
      setCoHostFeedback({
        tone: "error",
        text: "Only the host can manage co-hosts."
      });
      return;
    }
    if (!removeTailgateCoHost) {
      setCoHostFeedback({
        tone: "error",
        text: "Co-host tools are unavailable in this environment."
      });
      return;
    }

    const mutationId = params.userId ?? params.phoneNumber ?? "";
    if (!mutationId) {
      return;
    }

    setCoHostMutation({ id: mutationId, action: "remove" });
    setCoHostFeedback(null);
    try {
      await removeTailgateCoHost({
        tailgateId: detail.id,
        ...(params.userId ? { coHostUserId: params.userId } : {}),
        ...(params.phoneNumber ? { phoneNumber: params.phoneNumber } : {})
      });
      setCoHostFeedback({
        tone: "success",
        text: params.userId ? "Co-host removed." : "Pending co-host removed."
      });
    } catch (error) {
      const message = errorMessageValue(error);
      if (message.includes("not_authorized")) {
        setCoHostFeedback({ tone: "error", text: "Only the host can manage co-hosts." });
      } else {
        setCoHostFeedback({ tone: "error", text: "Unable to remove co-host right now." });
      }
    } finally {
      setCoHostMutation(null);
    }
  };

  const submitContactHostMessage = async () => {
    if (!detail) return;
    if (!user?.uid) {
      setContactHostFeedback({
        tone: "error",
        text: "Sign in to contact the host."
      });
      return;
    }
    if (!canContactHost) {
      setContactHostFeedback({
        tone: "error",
        text:
          detail.visibilityType === "private"
            ? "Only invited guests can contact this host."
            : "Contacting this host is unavailable."
      });
      return;
    }

    const message = contactHostMessage.trim();
    if (message.length < 10) {
      setContactHostFeedback({
        tone: "error",
        text: "Enter a message with a little more detail before sending."
      });
      return;
    }
    if (message.length > MAX_CONTACT_HOST_MESSAGE_LENGTH) {
      setContactHostFeedback({
        tone: "error",
        text: `Message cannot exceed ${MAX_CONTACT_HOST_MESSAGE_LENGTH} characters.`
      });
      return;
    }
    if (!contactEventHost) {
      setContactHostFeedback({
        tone: "error",
        text: "Host email is unavailable in this environment."
      });
      return;
    }

    setContactHostSending(true);
    setContactHostFeedback(null);
    try {
      const result = await contactEventHost({
        eventId: detail.id,
        message
      });
      const response = (result.data ?? {}) as ContactEventHostResponse;
      setIsContactHostComposerOpen(false);
      setContactHostFeedback({
        tone: "success",
        text: `Email sent to ${
          detail?.visibilityType === "open_free" || detail?.visibilityType === "open_paid"
            ? getFirstName(response.hostName || hostDisplayName)
            : response.hostName || hostDisplayName
        }.`
      });
      setContactHostMessage("");
    } catch (error) {
      const messageText =
        error instanceof Error && error.message
          ? error.message
          : "Unable to contact the host right now.";
      setContactHostFeedback({
        tone: "error",
        text: messageText
      });
    } finally {
      setContactHostSending(false);
    }
  };

  const cancelConfirmationMessage = isPaidTailgate
    ? "Are you sure you want to cancel this paid tailgate?"
    : "Are you sure you want to cancel this tailgate?";
  const canCancelTailgate = !hasEventStarted && status !== "cancelled" && !cancelTailgateSubmitting;

  const cancelTailgateModal =
    isHostUser && detail && isCancelTailgateModalOpen ? (
      <div className="create-wizard-modal-overlay" role="dialog" aria-modal="true">
        <div className="create-wizard-modal tailgate-details-cancel-modal">
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
        <section className={`tailgate-details-stack${isHostUser ? " tailgate-host-command-layout" : ""}`}>
          {checkoutResult === "success" ? (
            <section
              className={`tailgate-details-checkout-banner${
                checkoutPurchaseStatus === "confirmed"
                  ? " success"
                  : checkoutPurchaseStatus === "failed" ||
                    checkoutPurchaseStatus === "expired" ||
                    checkoutPurchaseStatus === "cancelled" ||
                    checkoutPurchaseStatus === "refunded"
                  ? " cancel-feedback-error"
                  : ""
              }`}
            >
              {checkoutPurchaseStatus === "confirmed"
                ? "Purchase confirmed. Your tickets are ready."
                : checkoutPurchaseStatus === "failed"
                ? "Payment failed before ticket confirmation. Please try again."
                : checkoutPurchaseStatus === "expired"
                ? "Checkout expired before payment completed."
                : checkoutPurchaseStatus === "cancelled"
                ? "This purchase was cancelled."
                : checkoutPurchaseStatus === "refunded"
                ? "This purchase is no longer active."
                : checkoutPurchaseLoading
                ? "Processing payment and confirming your tickets..."
                : "Payment received. Ticket confirmation may take a moment."}
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
          {activeCoverImageUrl ? (
            <article
              className={`tailgate-details-card tailgate-details-carousel-card${
                isHostUser ? " tailgate-host-dashboard-card tailgate-host-media-card tailgate-host-full-span" : ""
              }`}
            >
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

          {isHostUser ? (
            <article
              className="tailgate-details-hero tailgate-command-center"
              ref={eventSnapshotSectionRef}
            >
              <div className="tailgate-command-center-top">
                <section className="tailgate-command-panel tailgate-command-center-overview">
                  <div className="tailgate-details-hero-top">
                    <div>
                      <p className="tailgate-details-eyebrow">Event command center</p>
                      <h2>{detail.eventName}</h2>
                      <p className="tailgate-details-subtitle">
                        {detail.startDateTime ? formatDateTime(detail.startDateTime) : "Date TBD"}
                      </p>
                    </div>
                    <div className="tailgate-details-status-wrap">
                      <span className="chip chip-outline">
                        {getVisibilityLabel(detail.visibilityType)}
                      </span>
                      {status ? <span className={`chip chip-status chip-${status}`}>{status}</span> : null}
                    </div>
                  </div>
                  <p className="tailgate-details-meta">
                    <strong>Location:</strong> {locationLabel}
                  </p>
                  <div className="tailgate-details-hero-utility-row">
                    <div className="tailgate-details-hero-host">
                      <span className="tailgate-details-hero-host-label">Hosted by</span>
                      <strong>{hostDisplayName}</strong>
                    </div>
                    <div className="tailgate-command-utility-actions">
                      {canOpenMaps ? (
                        <button className="primary-button" onClick={openMaps}>
                          Open maps
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => navigate(`/tailgates/${detail.id}/feed`)}
                      >
                        Open feed
                      </button>
                      <button type="button" className="secondary-button" onClick={copyEventShareLink}>
                        Copy share link
                      </button>
                    </div>
                  </div>
                </section>

                <aside className="tailgate-command-panel tailgate-command-center-stats">
                  <p className="tailgate-command-kicker">Live numbers</p>
                  <h3>At a glance</h3>
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
                          <strong>{attendeeCounts.totalHeadcount}</strong>
                        </div>
                        <div className="tailgate-details-metric-card">
                          <p>Going</p>
                          <strong>{attendeeCounts.goingHeadcount}</strong>
                        </div>
                        <div className="tailgate-details-metric-card">
                          <p>Pending</p>
                          <strong>{attendeeCounts.pending}</strong>
                        </div>
                        <div className="tailgate-details-metric-card">
                          <p>Not Going</p>
                          <strong>{attendeeCounts.notGoing}</strong>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="tailgate-command-status-row">
                    <span className="chip chip-outline">
                      {timelineEnabledForEvent
                        ? detail.schedulePublished
                          ? "Schedule live"
                          : "Schedule drafted"
                        : "Schedule off"}
                    </span>
                    <span className="chip chip-outline">{mapCoords ? "Map ready" : "No live pin"}</span>
                  </div>
                </aside>
              </div>

              <div className="tailgate-command-center-grid">
                <section className="tailgate-command-panel">
                  <div className="section-header">
                    <div>
                      <h2>Run The Event</h2>
                      <p className="section-subtitle">
                        Operations, guest management, and live event controls.
                      </p>
                    </div>
                  </div>
                  <div className="tailgate-command-action-grid">
                    <button
                      type="button"
                      className="tailgate-command-action-card is-primary"
                      onClick={() => openInlineEventEditor(true)}
                      disabled={!db || !canEditCancelledEvent}
                    >
                      <span className="tailgate-command-action-icon" aria-hidden="true">
                        <IconSpark size={16} />
                      </span>
                      <span className="tailgate-command-action-copy">
                        <strong>{isInlineEditing ? "Editing event" : "Edit event"}</strong>
                        <small>Update title, kickoff, pricing, and host notes.</small>
                      </span>
                    </button>
                    {detail.visibilityType === "open_paid" ? (
                      <button
                        type="button"
                        className="tailgate-command-action-card"
                        onClick={() => navigate(`/tailgates/${detail.id}/checkin`)}
                        disabled={!canOpenCheckIn}
                      >
                        <span className="tailgate-command-action-icon" aria-hidden="true">
                          <IconCheckin size={16} />
                        </span>
                        <span className="tailgate-command-action-copy">
                          <strong>Check-in</strong>
                          <small>Handle arrivals and ticket validation.</small>
                        </span>
                      </button>
                    ) : canShowWhosComingSection ? (
                      <button
                        type="button"
                        className="tailgate-command-action-card"
                        onClick={scrollToAttendees}
                      >
                        <span className="tailgate-command-action-icon" aria-hidden="true">
                          <IconUser size={16} />
                        </span>
                        <span className="tailgate-command-action-copy">
                          <strong>Guest list</strong>
                          <small>Review invites, RSVPs, and attendance trends.</small>
                        </span>
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="tailgate-command-action-card"
                      onClick={() => {
                        if (!timelineEnabledForEvent) {
                          void enableTimelineForEvent();
                          return;
                        }
                        scrollToTimeline();
                      }}
                      disabled={enablingTimeline}
                    >
                      <span className="tailgate-command-action-icon" aria-hidden="true">
                        <IconCalendar size={16} />
                      </span>
                      <span className="tailgate-command-action-copy">
                        <strong>
                          {timelineEnabledForEvent
                            ? detail.schedulePublished
                              ? "Edit schedule"
                              : "Build schedule"
                            : enablingTimeline
                            ? "Adding schedule..."
                            : "Add schedule"}
                        </strong>
                        <small>Shape the run of show guests will follow.</small>
                      </span>
                    </button>
                    {detail.visibilityType === "private" ? (
                      <button
                        type="button"
                        className="tailgate-command-action-card"
                        onClick={scrollToQuiz}
                      >
                        <span className="tailgate-command-action-icon" aria-hidden="true">
                          <IconDashboard size={16} />
                        </span>
                        <span className="tailgate-command-action-copy">
                          <strong>{quizDocId ? "Edit quiz" : "Add quiz"}</strong>
                          <small>Create private trivia and pregame engagement.</small>
                        </span>
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="tailgate-command-action-card"
                      onClick={() => navigate(`/tailgates/${detail.id}/feed`)}
                    >
                      <span className="tailgate-command-action-icon" aria-hidden="true">
                        <IconDashboard size={16} />
                      </span>
                      <span className="tailgate-command-action-copy">
                        <strong>Event feed</strong>
                        <small>Post updates and keep everyone synced in real time.</small>
                      </span>
                    </button>
                    {isHostUser ? (
                      <button
                        type="button"
                        className={`tailgate-command-action-card${
                          isHostBroadcastComposerOpen ? " is-primary" : ""
                        }`}
                        onClick={
                          isHostBroadcastComposerOpen
                            ? closeHostBroadcastComposer
                            : openHostBroadcastComposer
                        }
                      >
                        <span className="tailgate-command-action-icon" aria-hidden="true">
                          <IconMessage size={16} />
                        </span>
                        <span className="tailgate-command-action-copy">
                          <strong>
                            {isHostBroadcastComposerOpen
                              ? "Close message composer"
                              : "Message attendees"}
                          </strong>
                          <small>Send a one-time SMS update to everyone attending.</small>
                        </span>
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="tailgate-command-action-card"
                      onClick={dropLocationPin}
                      disabled={pinning}
                    >
                      <span className="tailgate-command-action-icon" aria-hidden="true">
                        <IconLocation size={16} />
                      </span>
                      <span className="tailgate-command-action-copy">
                        <strong>{pinning ? "Dropping pin..." : "Pin location"}</strong>
                        <small>Share the exact meetup point from your current location.</small>
                      </span>
                    </button>
                  </div>
                  {isHostUser && isHostBroadcastComposerOpen ? (
                    <div className="tailgate-details-host-broadcast tailgate-details-host-contact">
                      <label className="input-group" htmlFor="host-broadcast-message">
                        <span className="input-label">Text attendees</span>
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
                  {canManageCoHosts || activeCoHostIds.length > 0 || pendingCoHostInvites.length > 0 ? (
                    <div className="tailgate-command-subsection">
                      <div className="tailgate-command-cohost-header">
                        <div>
                          <h3>Co-hosts</h3>
                          <p>
                            {activeCoHostIds.length > 0 || pendingCoHostInvites.length > 0
                              ? `${activeCoHostIds.length} active${
                                  pendingCoHostInvites.length > 0
                                    ? ` · ${pendingCoHostInvites.length} pending`
                                    : ""
                                }`
                              : "No co-hosts yet"}
                          </p>
                        </div>
                      </div>
                      {activeCoHostIds.length === 0 && pendingCoHostInvites.length === 0 ? (
                        <p className="tailgate-command-cohost-empty">
                          Add co-hosts by phone so they can help manage the event and check in
                          tickets.
                        </p>
                      ) : null}
                      {activeCoHostIds.length > 0 ? (
                        <div className="tailgate-command-cohost-list">
                          {activeCoHostIds.map((uid) => {
                            const profile = coHostProfiles[uid];
                            const displayName = profile?.displayName?.trim() || "Co-host";
                            return (
                              <div key={uid} className="tailgate-command-cohost-row">
                                <div className="tailgate-command-cohost-avatar" aria-hidden="true">
                                  {displayName.charAt(0).toUpperCase()}
                                </div>
                                <div className="tailgate-command-cohost-copy">
                                  <strong>{displayName}</strong>
                                  <span>{profile?.phone?.trim() || "TailgateTime account linked"}</span>
                                </div>
                                {canManageCoHosts ? (
                                  <button
                                    type="button"
                                    className="tailgate-command-cohost-remove"
                                    onClick={() => void removeCoHostEntry({ userId: uid })}
                                    disabled={
                                      coHostMutation?.id === uid &&
                                      coHostMutation.action === "remove"
                                    }
                                  >
                                    {coHostMutation?.id === uid &&
                                    coHostMutation.action === "remove"
                                      ? "Removing..."
                                      : "Remove"}
                                  </button>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      ) : null}
                      {pendingCoHostInvites.length > 0 ? (
                        <div className="tailgate-command-cohost-list">
                          {pendingCoHostInvites.map((invite) => (
                            <div
                              key={invite.phoneNumberCanonical}
                              className="tailgate-command-cohost-row is-pending"
                            >
                              <div className="tailgate-command-cohost-avatar" aria-hidden="true">
                                ?
                              </div>
                              <div className="tailgate-command-cohost-copy">
                                <strong>
                                  {invite.phoneNumberDisplay ||
                                    formatPhoneInput(invite.phoneNumberCanonical)}
                                </strong>
                                <span>
                                  Create a TailgateTime account with this phone number to get
                                  access.
                                </span>
                              </div>
                              {canManageCoHosts ? (
                                <button
                                  type="button"
                                  className="tailgate-command-cohost-remove"
                                  onClick={() =>
                                    void removeCoHostEntry({
                                      phoneNumber: invite.phoneNumberCanonical
                                    })
                                  }
                                  disabled={
                                    coHostMutation?.id === invite.phoneNumberCanonical &&
                                    coHostMutation.action === "remove"
                                  }
                                >
                                  {coHostMutation?.id === invite.phoneNumberCanonical &&
                                  coHostMutation.action === "remove"
                                    ? "Removing..."
                                    : "Remove"}
                                </button>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : null}
                      {canManageCoHosts ? (
                        <div className="tailgate-command-cohost-compose">
                          <div className="tailgate-command-cohost-compose-copy">
                            <h4>Add by phone</h4>
                            <p>
                              <strong>{hostDisplayName}</strong> has added you as a co-host for{" "}
                              <strong>{detail.eventName}</strong>. You can now assist with checking
                              in guest tickets.
                            </p>
                            <p>
                              If this phone number is not tied to a TailgateTime account yet, they
                              will need to sign up with the same number before access is granted.
                            </p>
                          </div>
                          <div className="tailgate-command-cohost-compose-row">
                            <input
                              className="text-input"
                              type="tel"
                              inputMode="tel"
                              value={coHostPhoneDraft}
                              onChange={(event) =>
                                setCoHostPhoneDraft(formatPhoneInput(event.target.value))
                              }
                              placeholder="(555) 555-5555"
                              disabled={Boolean(coHostMutation)}
                            />
                            <button
                              type="button"
                              className="primary-button"
                              onClick={() => void addCoHostByPhone()}
                              disabled={
                                toPhoneDigits(coHostPhoneDraft).length !== 10 ||
                                (coHostMutation?.id === toPhoneDigits(coHostPhoneDraft) &&
                                  coHostMutation.action === "add")
                              }
                            >
                              {coHostMutation?.id === toPhoneDigits(coHostPhoneDraft) &&
                              coHostMutation.action === "add"
                                ? "Sending..."
                                : "Text co-host"}
                            </button>
                          </div>
                        </div>
                      ) : null}
                      {coHostFeedback?.tone === "success" ? (
                        <p className="tailgate-details-inline-editor-success">{coHostFeedback.text}</p>
                      ) : null}
                      {coHostFeedback?.tone === "info" ? (
                        <p className="meta-muted">{coHostFeedback.text}</p>
                      ) : null}
                      {coHostFeedback?.tone === "error" ? (
                        <p className="tailgate-details-ticket-error">{coHostFeedback.text}</p>
                      ) : null}
                    </div>
                  ) : null}
                  <button
                    type="button"
                    className="tailgate-command-danger-button"
                    onClick={openCancelTailgateModal}
                    disabled={!canCancelTailgate}
                  >
                    {status === "cancelled"
                      ? "Tailgate cancelled"
                      : hasEventStarted
                      ? "Cancellation unavailable"
                      : cancelTailgateSubmitting
                      ? "Cancelling..."
                      : "Cancel tailgate"}
                  </button>
                </section>

                <section className="tailgate-command-panel">
                  <div className="section-header">
                    <div>
                      <h2>Event Brief</h2>
                      <p className="section-subtitle">
                        Core details, host-facing setup, and what guests will see.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() =>
                        isInlineEditing ? cancelInlineEventEditor() : openInlineEventEditor(false)
                      }
                      disabled={!db || inlineEditSaving || !canEditCancelledEvent}
                    >
                      {isInlineEditing ? "Cancel edit" : "Edit details"}
                    </button>
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
                  <div className="tailgate-details-info-grid tailgate-command-info-grid">
                    <div className="tailgate-details-info-card">
                      <p>When</p>
                      <strong>
                        {detail.startDateTime ? detail.startDateTime.toLocaleDateString() : "TBD"}
                      </strong>
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
                        <span>
                          {detail.capacity ? `${detail.capacity} max guests` : "No capacity limit"}
                        </span>
                      )}
                    </div>
                    <div className="tailgate-details-info-card">
                      <p>Event Size</p>
                      <strong>{eventSizeTag}</strong>
                      <span>{eventSizeSummary}</span>
                    </div>
                  </div>
                  {detail.cancelledAt ? (
                    <p className="tailgate-details-cancel-note">
                      Cancelled on {detail.cancelledAt.toLocaleString()}
                    </p>
                  ) : null}
                </section>
              </div>
            </article>
          ) : (
            <article className="tailgate-details-hero">
              <div className="tailgate-details-hero-top">
                <div>
                  <p className="tailgate-details-eyebrow">Tailgate details</p>
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
              <div className="tailgate-details-hero-host">
                <span className="tailgate-details-hero-host-label">Hosted by</span>
                <strong>{publicHostDisplayName}</strong>
              </div>
              <div className="tailgate-details-hero-actions">
                {canOpenMaps ? (
                  <button className="primary-button" onClick={openMaps}>
                    Open maps
                  </button>
                ) : null}
                {canContactHost ? (
                  <button
                    className="secondary-button"
                    onClick={
                      isContactHostComposerOpen
                        ? closeContactHostComposer
                        : openContactHostComposer
                    }
                  >
                    {isContactHostComposerOpen ? "Close contact" : "Contact host"}
                  </button>
                ) : null}
                <button
                  className="secondary-button"
                  onClick={() => navigate(`/tailgates/${detail.id}/feed`)}
                >
                  Event feed
                </button>
                <button className="secondary-button" onClick={copyEventShareLink}>
                  Copy share link
                </button>
              </div>
              {canContactHost && isContactHostComposerOpen ? (
                <div className="tailgate-details-host-broadcast tailgate-details-host-contact">
                  <label className="input-group" htmlFor="contact-host-message">
                    <span className="input-label">Email to {publicHostDisplayName}</span>
                    <textarea
                      id="contact-host-message"
                      className="text-input tailgate-details-host-broadcast-input"
                      value={contactHostMessage}
                      onChange={handleContactHostMessageChange}
                      maxLength={MAX_CONTACT_HOST_MESSAGE_LENGTH}
                      placeholder="Ask the host a question about parking, timing, what to bring, or anything else event-related."
                      rows={4}
                    />
                  </label>
                  <div className="tailgate-details-host-broadcast-actions">
                    <p className="tailgate-details-host-broadcast-counter">
                      {contactHostCharacterCount}/{MAX_CONTACT_HOST_MESSAGE_LENGTH}
                    </p>
                    <div className="tailgate-details-inline-editor-actions">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={closeContactHostComposer}
                        disabled={contactHostSending}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="primary-button"
                        onClick={() => void submitContactHostMessage()}
                        disabled={!canSendContactHost}
                      >
                        {contactHostSending ? "Sending..." : "Send email"}
                      </button>
                    </div>
                  </div>
                  <p className="meta-muted">
                    Messages are limited to signed-in guests and rate-limited to reduce spam.
                  </p>
                </div>
              ) : null}
              {contactHostFeedback?.tone === "success" ? (
                <p className="tailgate-details-inline-editor-success">
                  {contactHostFeedback.text}
                </p>
              ) : null}
              {contactHostFeedback?.tone === "error" ? (
                <p className="tailgate-details-ticket-error">{contactHostFeedback.text}</p>
              ) : null}
              {detail.cancelledAt ? (
                <p className="tailgate-details-cancel-note">
                  Cancelled on {detail.cancelledAt.toLocaleString()}
                </p>
              ) : null}
            </article>
          )}

          {!isHostUser ? (
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
              <div className="tailgate-details-info-card">
                <p>Event Size</p>
                <strong>{eventSizeTag}</strong>
                <span>{eventSizeSummary}</span>
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
                {user || canRespondToInviteViaLink ? (
                  <>
                    <div className="tailgate-details-rsvp-options">
                      <button
                        type="button"
                        className={`tailgate-details-rsvp-option${
                          rsvpDraftChoice === "Attending" ? " is-active is-going" : ""
                        }`}
                        onClick={() => setRsvpDraftChoice("Attending")}
                        disabled={rsvpSaving}
                      >
                        Going
                      </button>
                      <button
                        type="button"
                        className={`tailgate-details-rsvp-option${
                          rsvpDraftChoice === "Not Attending"
                            ? " is-active is-not-going"
                            : ""
                        }`}
                        onClick={() => setRsvpDraftChoice("Not Attending")}
                        disabled={rsvpSaving}
                      >
                        Not Going
                      </button>
                    </div>
                    {detail.allowGuestPlusOnInvite !== true ? (
                      <p className="tailgate-details-ticket-copy app-note">
                        This invite does not include guest +1 permissions.
                      </p>
                    ) : null}
                    {plusGuestsEnabled ? (
                      <div className="tailgate-details-plus-guests">
                        <div className="tailgate-details-ticket-row">
                          <p className="tailgate-details-ticket-title">Guests you&rsquo;re bringing</p>
                          <span className="tailgate-details-plus-limit">Limit: {plusGuestLimit}</span>
                        </div>
                        <p className="tailgate-details-ticket-copy">
                          Enter your total guests. Guests with contact info count first, and the
                          rest stay anonymous.
                        </p>
                        <label className="input-label" htmlFor="rsvp-guest-count">
                          Total guests you are bringing
                        </label>
                        <input
                          id="rsvp-guest-count"
                          className="tailgate-details-plus-input"
                          inputMode="numeric"
                          value={inviteGuestCount}
                          onChange={(event) =>
                            setInviteGuestCount(sanitizeGuestCountInput(event.target.value))
                          }
                          placeholder="0"
                          disabled={rsvpSaving}
                        />
                        <div className="tailgate-details-plus-list">
                          {invitePlusGuests.map((guest, index) => (
                            <div className="tailgate-details-plus-card" key={guest.id}>
                              <div className="tailgate-details-ticket-row">
                                <p className="tailgate-details-ticket-title">Guest #{index + 1}</p>
                                <button
                                  type="button"
                                  className="ghost-button"
                                  onClick={() =>
                                    setInvitePlusGuests((previous) =>
                                      previous.filter((entry) => entry.id !== guest.id)
                                    )
                                  }
                                  disabled={rsvpSaving}
                                >
                                  Remove
                                </button>
                              </div>
                              <div className="tailgate-details-plus-grid">
                                <label>
                                  <span className="input-label">Name</span>
                                  <input
                                    className="tailgate-details-plus-input"
                                    value={guest.name}
                                    onChange={(event) =>
                                      setInvitePlusGuests((previous) =>
                                        previous.map((entry) =>
                                          entry.id === guest.id
                                            ? { ...entry, name: event.target.value }
                                            : entry
                                        )
                                      )
                                    }
                                    placeholder="Name (optional)"
                                    disabled={rsvpSaving}
                                  />
                                </label>
                                <label>
                                  <span className="input-label">Phone</span>
                                  <input
                                    className="tailgate-details-plus-input"
                                    inputMode="tel"
                                    value={guest.phone}
                                    onChange={(event) =>
                                      setInvitePlusGuests((previous) =>
                                        previous.map((entry) =>
                                          entry.id === guest.id
                                            ? {
                                                ...entry,
                                                phone: formatPhoneInput(event.target.value)
                                              }
                                            : entry
                                        )
                                      )
                                    }
                                    placeholder="Phone (required to link)"
                                    disabled={rsvpSaving}
                                  />
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          className="secondary-button tailgate-details-plus-add"
                          onClick={() =>
                            setInvitePlusGuests((previous) => [
                              ...previous,
                              {
                                id: `${Date.now()}-${previous.length}`,
                                attendeeId: undefined,
                                name: "",
                                phone: ""
                              }
                            ])
                          }
                          disabled={!canAddContactGuest || rsvpSaving}
                        >
                          Add guest contact
                        </button>
                      </div>
                    ) : null}
                    <button
                      type="button"
                      className="primary-button tailgate-details-rsvp-save"
                      onClick={() => void updateGuestRsvp(rsvpDraftChoice)}
                      disabled={rsvpSaving}
                    >
                      {rsvpSaving
                        ? rsvpPendingChoice === "Not Attending"
                          ? "Saving not going..."
                          : "Saving RSVP..."
                        : "Save RSVP"}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                      navigate(
                        `/login?mode=login&redirect=${encodeURIComponent(
                          `${location.pathname}${location.search}`
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
            {showOpenFreeRsvpSection ? (
              <div className="tailgate-details-rsvp-block">
                <div className="tailgate-details-ticket-row">
                  <p className="tailgate-details-ticket-title">Join this tailgate</p>
                  <span
                    className={`tailgate-details-rsvp-status ${
                      isOpenFreeUserGoing
                        ? "tailgate-details-rsvp-status-going"
                        : "tailgate-details-rsvp-status-pending"
                    }`}
                  >
                    {isOpenFreeUserGoing ? "You're in" : "Open RSVP"}
                  </span>
                </div>
                <p className="tailgate-details-ticket-copy">
                  Let the host know how many are coming with your group.
                </p>
                {user ? (
                  <>
                    <div className="tailgate-details-open-free-qty">
                      <p className="input-label">How many are coming?</p>
                      <div className="tailgate-details-open-free-qty-row">
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => adjustOpenFreePartySize(-1)}
                          disabled={openFreePartySize <= 1 || rsvpSaving}
                        >
                          -
                        </button>
                        <input
                          className="text-input tailgate-details-open-free-input"
                          inputMode="numeric"
                          value={String(openFreePartySize)}
                          onChange={(event) => handleOpenFreePartySizeChange(event.target.value)}
                          disabled={rsvpSaving}
                        />
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => adjustOpenFreePartySize(1)}
                          disabled={
                            openFreePartySize >= MAX_OPEN_FREE_PARTY_SIZE || rsvpSaving
                          }
                        >
                          +
                        </button>
                      </div>
                      <p className="tailgate-details-ticket-total">{openFreeBringLabel}</p>
                    </div>
                    <button
                      type="button"
                      className="primary-button tailgate-details-rsvp-save"
                      onClick={() => void saveOpenFreeRsvp()}
                      disabled={rsvpSaving}
                    >
                      {rsvpSaving
                        ? "Saving..."
                        : isOpenFreeUserGoing
                        ? "Update my count"
                        : "I'm coming"}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                      navigate(
                        `/login?mode=login&redirect=${encodeURIComponent(
                          `${location.pathname}${location.search}`
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
              </div>
            ) : null}
          </article>
          ) : null}

          <article
            className={`tailgate-details-card${
              isHostUser ? " tailgate-host-dashboard-card tailgate-host-expectations-card" : ""
            }`}
          >
            <div className="section-header">
              <div>
                <h2>What To Expect</h2>
                <p className="section-subtitle">
                  {isHostUser
                    ? "What guests should understand before they arrive."
                    : "Host-set expectations for guests."}
                </p>
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
            <article
              className={`tailgate-details-card${
                isHostUser ? " tailgate-host-dashboard-card tailgate-host-ops-card" : ""
              }`}
              ref={timelineSectionRef}
            >
              <div className="section-header">
                <div>
                  <h2>Timeline</h2>
                  <p className="section-subtitle">
                    {isHostUser
                      ? "Build, edit, and publish the run of show."
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

          {canManageQuiz ? (
            <article
              className="tailgate-details-card tailgate-host-dashboard-card tailgate-host-quiz-card tailgate-host-full-span"
              ref={quizSectionRef}
            >
              <div className="section-header">
                <div>
                  <h2>Quiz</h2>
                  <p className="section-subtitle">
                    Build or edit trivia for this invite-only tailgate.
                  </p>
                </div>
              </div>
              {quizLoading ? (
                <p className="meta-muted">Loading quiz...</p>
              ) : (
                <div className="tailgate-quiz-host-tools">
                  <label className="input-group">
                    <span className="input-label">Quiz name</span>
                    <input
                      className="text-input"
                      value={quizTitle}
                      onChange={(event) => {
                        setQuizTitle(event.target.value);
                        if (quizTitleError && event.target.value.trim()) {
                          setQuizTitleError("");
                        }
                        setQuizValidationMessage(null);
                        setQuizError(null);
                        setQuizSuccess(null);
                      }}
                      placeholder="Ex: Steelers Pregame Trivia"
                    />
                  </label>
                  {quizTitleError ? (
                    <p className="tailgate-details-ticket-error">{quizTitleError}</p>
                  ) : null}
                  {quizValidationMessage ? (
                    <p className="tailgate-details-ticket-error">{quizValidationMessage}</p>
                  ) : null}
                  {quizError ? (
                    <p className="tailgate-details-ticket-error">{quizError}</p>
                  ) : null}
                  {quizSuccess ? (
                    <p className="tailgate-details-inline-editor-success">{quizSuccess}</p>
                  ) : null}

                  <div className="create-wizard-quiz-chip-row">
                    {quizQuestions.map((question, index) => {
                      const active = currentQuizQuestionIndex === index;
                      const hasError = Boolean(quizErrors[index]);
                      const complete = isQuizQuestionComplete(question);
                      return (
                        <button
                          key={question.id}
                          type="button"
                          className={`create-wizard-quiz-chip ${active ? "active" : ""} ${
                            hasError ? "error" : ""
                          }`}
                          onClick={() => setCurrentQuizQuestionIndex(index)}
                        >
                          <span>Q{index + 1}</span>
                          {hasError ? (
                            <span className="create-wizard-quiz-chip-status">!</span>
                          ) : null}
                          {!hasError && complete ? (
                            <span className="create-wizard-quiz-chip-status">✓</span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  <div className="tailgate-quiz-editor">
                    <div className="tailgate-quiz-editor-actions">
                      {quizQuestions.length > 1 ? (
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={handleDeleteCurrentQuizQuestion}
                          disabled={quizSaving}
                        >
                          Delete question
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={handleAddQuizQuestion}
                        disabled={quizQuestions.length >= MAX_QUIZ_QUESTIONS || quizSaving}
                      >
                        Add question
                      </button>
                    </div>

                    <div className="create-wizard-quiz-type-toggle">
                      <button
                        type="button"
                        className={`secondary-button ${
                          currentQuizQuestion.type === "multiple" ? "active" : ""
                        }`}
                        onClick={() => setQuizQuestionType("multiple")}
                        disabled={quizSaving}
                      >
                        Multiple Choice
                      </button>
                      <button
                        type="button"
                        className={`secondary-button ${
                          currentQuizQuestion.type === "truefalse" ? "active" : ""
                        }`}
                        onClick={() => setQuizQuestionType("truefalse")}
                        disabled={quizSaving}
                      >
                        True / False
                      </button>
                    </div>

                    <label className="input-group">
                      <span className="input-label">Question text</span>
                      <textarea
                        className="text-input tailgate-timeline-description-input"
                        value={currentQuizQuestion.questionText}
                        onChange={(event) => updateQuizQuestionText(event.target.value)}
                        placeholder="Ask something fun..."
                        disabled={quizSaving}
                      />
                    </label>
                    {currentQuizErrors.questionText ? (
                      <p className="tailgate-details-ticket-error">
                        {currentQuizErrors.questionText}
                      </p>
                    ) : null}

                    <p className="input-label create-wizard-choice-label">Choices</p>
                    <div className="create-wizard-choice-grid">
                      {currentQuizQuestion.choices.map((choice) => (
                        <div
                          key={choice.id}
                          className="create-wizard-choice-row create-wizard-quiz-choice-row"
                        >
                          <button
                            type="button"
                            className={`create-wizard-choice-radio ${
                              currentQuizQuestion.correctChoiceId === choice.id ? "active" : ""
                            }`}
                            onClick={() => setQuizCorrectChoice(choice.id)}
                            disabled={quizSaving}
                          >
                            {currentQuizQuestion.type === "truefalse"
                              ? choice.text.charAt(0).toUpperCase()
                              : choice.id.toUpperCase()}
                          </button>
                          <input
                            className="text-input create-wizard-input"
                            value={choice.text}
                            onChange={(event) =>
                              updateQuizChoiceText(choice.id, event.target.value)
                            }
                            placeholder={`Choice ${choice.id.toUpperCase()}`}
                            disabled={
                              currentQuizQuestion.type === "truefalse" || quizSaving
                            }
                          />
                        </div>
                      ))}
                    </div>
                    {currentQuizErrors.correctChoiceId ? (
                      <p className="tailgate-details-ticket-error">
                        {currentQuizErrors.correctChoiceId}
                      </p>
                    ) : null}
                    {currentQuizErrors.choices
                      ? Object.entries(currentQuizErrors.choices).map(([choiceId, message]) => (
                          <p
                            key={`${choiceId}-${message}`}
                            className="tailgate-details-ticket-error"
                          >
                            {message}
                          </p>
                        ))
                      : null}

                    <div className="create-wizard-quiz-preview">
                      <p className="input-label">Preview</p>
                      <p className="create-wizard-quiz-preview-question">
                        {currentQuizQuestion.questionText.trim()
                          ? currentQuizQuestion.questionText
                          : "Start typing your question to see the preview."}
                      </p>
                      <div className="create-wizard-quiz-preview-choices">
                        {currentQuizQuestion.choices.map((choice) => (
                          <div
                            key={`preview-${choice.id}`}
                            className={`create-wizard-quiz-preview-choice ${
                              currentQuizQuestion.correctChoiceId === choice.id ? "correct" : ""
                            }`}
                          >
                            {choice.text || "Choice text"}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="tailgate-quiz-editor-actions">
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => void saveQuiz()}
                      disabled={quizSaving}
                    >
                      {quizSaving ? "Saving..." : quizDocId ? "Update quiz" : "Save quiz"}
                    </button>
                    <span className="meta-muted">
                      {existingQuizQuestionCount} question
                      {existingQuizQuestionCount === 1 ? "" : "s"} ready
                    </span>
                  </div>
                </div>
              )}
            </article>
          ) : null}

          <article
            className={`tailgate-details-card${
              isHostUser ? " tailgate-host-dashboard-card tailgate-host-map-card" : ""
            }`}
          >
            <div className="section-header">
              <div>
                <h2>Meet-up Spot</h2>
                <p className="section-subtitle">
                  {isHostUser ? "Map, parking context, and exact pin placement." : meetUpSubtitle}
                </p>
              </div>
            </div>
            {mapCoords ? (
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
            <article
              className={`tailgate-details-card${
                isHostUser ? " tailgate-host-dashboard-card tailgate-host-attendees-card" : ""
              }`}
              ref={attendeeSectionRef}
            >
              <div className="section-header">
                <div>
                  <h2>{isHostUser ? "Guest List" : "Who's Going"}</h2>
                  <p className="section-subtitle">
                    {isHostUser ? "Invites, RSVPs, and attendance control." : "Filter by RSVP status."}
                  </p>
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
                  { key: "All", label: `All (${attendeeCounts.totalHeadcount})` },
                  { key: "Going", label: `Going (${attendeeCounts.goingHeadcount})` },
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
                    const anonymousPlusCount = resolveAnonymousPlusGuests(attendee);
                    const attendeeMeta = [
                      attendee.email,
                      attendee.phone,
                      anonymousPlusCount > 0
                        ? `+${anonymousPlusCount} guest${anonymousPlusCount === 1 ? "" : "s"}`
                        : null
                    ]
                      .map((value) => value?.trim())
                      .filter((value): value is string => Boolean(value))
                      .join(" · ");
                    return (
                      <div className="tailgate-details-attendee-row" key={attendee.id}>
                        <div>
                          <p className="tailgate-details-attendee-name">{attendee.name}</p>
                          {attendeeMeta ? (
                            <p className="tailgate-details-attendee-meta">{attendeeMeta}</p>
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
        {cancelTailgateModal}
      </main>
    );
  }

  if (!user) {
    return (
      <>
        <PublicTopNav />
        <main className="tailgate-details-public-shell">
          {pageContent}
          {cancelTailgateModal}
        </main>
      </>
    );
  }

  return (
    <AppShell header={<div className="simple-header"><h1>Tailgate Details</h1></div>}>
      {pageContent}
      {cancelTailgateModal}
    </AppShell>
  );
}

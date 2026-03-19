import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { IconLocation } from "../components/Icons";
import { useAuth } from "../hooks/useAuth";
import { usePlacesAutocomplete } from "../hooks/usePlacesAutocomplete";
import { db, functions as firebaseFunctions, storage } from "../lib/firebase";
import { VisibilityType } from "../types";
import {
  EARLY_ADOPTER_MIN_TICKETS_SOLD,
  EARLY_ADOPTER_PLATFORM_FEE_PERCENT,
  resolveHostPlatformFeeSummary,
  STANDARD_PLATFORM_FEE_PERCENT
} from "../utils/platformFees";
import { estimateHostPayout } from "../utils/tailgate";

type WizardStep = {
  key: "type" | "details" | "location" | "invite" | "review";
  title: string;
  subtitle: string;
};

type Guest = {
  id: string;
  name: string;
  phone: string;
};

type ExpectationKey =
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

type Expectations = Record<ExpectationKey, boolean>;

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

type TimelineDraftStep = {
  id: string;
  title: string;
  description: string;
  startTime: string;
  durationHours: number;
  durationMinutes: number;
  durationSeconds: number;
};

type LatLng = {
  lat: number;
  lng: number;
};

type LocationTerm = {
  value: string;
  offset?: number;
};

type LocationRecord = {
  description?: string;
  formatted?: string;
  formattedAddress?: string;
  address?: string;
  text?: string;
  shortAddress?: string;
  name?: string;
  mainText?: string;
  secondaryText?: string;
  placeId?: string;
  reference?: string;
  types?: string[];
  terms?: LocationTerm[];
  lat?: number;
  lng?: number;
  addressComponents?: Array<Record<string, unknown>>;
};

type StripeConnectStatus = "not_started" | "pending" | "complete" | "restricted";
type CoverImageDraft = {
  id: string;
  file: File;
  previewUrl: string;
};

const wizardSteps: WizardStep[] = [
  { key: "type", title: "Step 1", subtitle: "Tailgate Type" },
  { key: "details", title: "Step 2", subtitle: "Event Details" },
  { key: "location", title: "Step 3", subtitle: "Event Location" },
  { key: "invite", title: "Step 4", subtitle: "Invite Friends" },
  { key: "review", title: "Step 5", subtitle: "Review and Create" }
];

const visibilityOptions: Array<{
  key: VisibilityType;
  label: string;
  description: string;
}> = [
  { key: "private", label: "Invite Only", description: "Only invited guests can join." },
  { key: "open_free", label: "Open (Free)", description: "Discoverable and free to join." },
  { key: "open_paid", label: "Open (Paid)", description: "Discoverable with paid tickets." }
];

const expectationGroups: Array<{
  key: string;
  title: string;
  description: string;
  options: Array<{ key: ExpectationKey; label: string }>;
}> = [
  {
    key: "music",
    title: "Sound",
    description: "Set the game-day soundtrack guests can expect.",
    options: [
      { key: "musicLiveDj", label: "Live DJ booth" },
      { key: "musicGameDayPlaylist", label: "Curated game-day playlist" },
      { key: "musicBandSet", label: "Live band set" },
      { key: "musicCountryHits", label: "Country hits" },
      { key: "musicHipHopHits", label: "Hip-hop / throwbacks" },
      { key: "musicNoPreference", label: "Low-key audio vibe" }
    ]
  },
  {
    key: "drinks",
    title: "Drinks",
    description: "Tell guests what the bar setup looks like.",
    options: [
      { key: "drinkByob", label: "Bring-your-own welcome" },
      { key: "drinkWaterSoda", label: "Water + soft drinks stocked" },
      { key: "drinkBeerSelection", label: "Beer lineup ready" },
      { key: "drinkCraftCocktails", label: "Mixed cocktails available" },
      { key: "drinkPremiumSpirits", label: "Premium spirits" },
      { key: "drinkDryFriendly", label: "Dry / non-alcohol focus" }
    ]
  },
  {
    key: "amenities",
    title: "Setup",
    description: "Highlight comfort extras and host equipment.",
    options: [
      { key: "amenityLawnGames", label: "Lawn games" },
      { key: "amenityTvWall", label: "TV / game screen" },
      { key: "amenityShadedSetup", label: "Shade tents / canopy" },
      { key: "amenityPowerAccess", label: "Power + charging access" },
      { key: "amenityFamilyZone", label: "Family-friendly zone" },
      { key: "amenityClimateControl", label: "Fans / heaters on-site" }
    ]
  }
];

const expectationOptions = expectationGroups.flatMap((group) => group.options);

const expectationsDefaults: Expectations = {
  musicLiveDj: false,
  musicGameDayPlaylist: false,
  musicBandSet: false,
  musicCountryHits: false,
  musicHipHopHits: false,
  musicNoPreference: false,
  drinkByob: false,
  drinkWaterSoda: false,
  drinkBeerSelection: false,
  drinkCraftCocktails: false,
  drinkPremiumSpirits: false,
  drinkDryFriendly: false,
  amenityLawnGames: false,
  amenityTvWall: false,
  amenityShadedSetup: false,
  amenityPowerAccess: false,
  amenityFamilyZone: false,
  amenityClimateControl: false
};

const seededContacts: Guest[] = [
  { id: "c-anna", name: "Anna Haro", phone: "555-522-8243" },
  { id: "c-daniel", name: "Daniel Higgins Jr.", phone: "555-478-7672" },
  { id: "c-david", name: "David Taylor", phone: "555-610-6679" },
  { id: "c-hank", name: "Hank M. Zakroff", phone: "(555) 766-4823" },
  { id: "c-john", name: "John Appleseed", phone: "888-555-5512" },
  { id: "c-kate", name: "Kate Bell", phone: "(555) 564-8583" }
];

const minTicketPriceCents = 2500;
const CONNECT_RETURN_URL =
  import.meta.env.VITE_CONNECT_RETURN_URL ?? "https://tailgate-time.com/connect-return";
const CONNECT_REFRESH_URL =
  import.meta.env.VITE_CONNECT_REFRESH_URL ?? "https://tailgate-time.com/connect-refresh";
const MAPS_API_KEY = (
  import.meta.env.MAPS_API_KEY ??
  import.meta.env.VITE_MAPS_API_KEY ??
  ""
).trim();
const MAX_COVER_IMAGES = 5;
const MAX_COVER_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_QUIZ_QUESTIONS = 10;
const PROMO_CUTOFF_DISPLAY = "10/1/2026";
const emptyQuizQuestionFallback: QuizQuestion = {
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

function formatPhone(text: string) {
  const digits = text.replace(/\D/g, "").slice(0, 10);
  const part1 = digits.slice(0, 3);
  const part2 = digits.slice(3, 6);
  const part3 = digits.slice(6, 10);

  if (digits.length <= 3) return part1;
  if (digits.length <= 6) return `(${part1}) ${part2}`;
  return `(${part1}) ${part2}-${part3}`;
}

function parsePriceToCents(value: string) {
  const normalized = value.replace(/[^0-9.]/g, "");
  if (!normalized) return null;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return null;
  return Math.round(parsed * 100);
}

function formatUsdFromCents(valueCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(valueCents / 100);
}

function parseCapacity(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value.trim());
  if (!Number.isFinite(parsed) || parsed < 1) return null;
  return Math.floor(parsed);
}

function parseTicketSalesCutoffDays(value: string) {
  if (!value.trim()) return 0;
  const parsed = Number(value.trim());
  if (!Number.isFinite(parsed)) return null;
  if (parsed < 0 || parsed > 365) return null;
  return Math.floor(parsed);
}

function parseGuestPlusLimit(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value.trim());
  if (!Number.isFinite(parsed) || parsed < 1) return null;
  return Math.min(Math.floor(parsed), 12);
}

function createLocalId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function parseDurationPart(value: string) {
  if (!value.trim()) return 0;
  const parsed = Number(value.replace(/\D/g, ""));
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.floor(parsed));
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

function sanitizeStorageFileName(fileName: string) {
  const trimmed = fileName.trim().toLowerCase();
  const split = trimmed.split(".");
  const extension = split.length > 1 ? split.pop() : undefined;
  const safeExtension = extension?.replace(/[^a-z0-9]/g, "") || "jpg";
  return safeExtension;
}

async function uploadCoverImagesForTailgate(
  hostUserId: string,
  coverImageDrafts: CoverImageDraft[]
) {
  const storageService = storage;
  if (!storageService || coverImageDrafts.length === 0) {
    return [] as string[];
  }

  const createdAt = Date.now();
  return Promise.all(
    coverImageDrafts.map(async (draft, index) => {
      const extension = sanitizeStorageFileName(draft.file.name);
      const imageRef = ref(
        storageService,
        `tailgateCovers/${hostUserId}/${createdAt}-${index}-${createLocalId()}.${extension}`
      );
      await uploadBytes(imageRef, draft.file, {
        contentType: draft.file.type || "image/jpeg"
      });
      return getDownloadURL(imageRef);
    })
  );
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

function toStartDateTime(eventDate: string, eventTime: string) {
  const [yearRaw, monthRaw, dayRaw] = eventDate.split("-");
  const [hoursRaw, minutesRaw] = eventTime.split(":");
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

function toEndDateTime(eventDate: string, eventTime: string, eventEndTime: string) {
  const start = toStartDateTime(eventDate, eventTime);
  if (!start) return null;

  const [hoursRaw, minutesRaw] = eventEndTime.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);
  if (![hours, minutes].every((value) => Number.isFinite(value))) {
    return null;
  }

  const end = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
    hours,
    minutes,
    0,
    0
  );
  if (Number.isNaN(end.getTime())) return null;

  if (end <= start) {
    end.setDate(end.getDate() + 1);
  }

  return end;
}

function resolveLocationLabel(raw: unknown): string {
  if (!raw) return "";
  if (typeof raw === "string") {
    return raw.trim();
  }
  if (typeof raw === "object") {
    const record = raw as LocationRecord;
    const candidates = [
      record.formatted,
      record.formattedAddress,
      record.description,
      record.address,
      record.text,
      record.name,
      record.shortAddress
    ];
    const match = candidates.find(
      (value) => typeof value === "string" && value.trim().length > 0
    );
    if (match) return match.trim();
    if (typeof record.lat === "number" && typeof record.lng === "number") {
      return `${record.lat}, ${record.lng}`;
    }
  }
  return "";
}

function buildLocationPayload(
  record: LocationRecord | null,
  fallbackLabel: string,
  coords: LatLng | null
): LocationRecord | string {
  const trimmedFallback = fallbackLabel.trim();
  if (!record) {
    return trimmedFallback;
  }

  const baseLabel =
    record.description ??
    record.formatted ??
    record.formattedAddress ??
    record.name ??
    record.text ??
    trimmedFallback;

  const payload: LocationRecord = {
    description: record.description ?? baseLabel,
    formatted: record.formatted ?? record.formattedAddress ?? baseLabel,
    formattedAddress: record.formattedAddress ?? record.formatted ?? baseLabel,
    address: record.address ?? record.formattedAddress ?? baseLabel,
    text: record.text ?? baseLabel,
    shortAddress: record.shortAddress ?? record.secondaryText,
    name: record.name ?? record.mainText ?? baseLabel,
    mainText: record.mainText,
    secondaryText: record.secondaryText,
    placeId: record.placeId,
    reference: record.reference,
    types: record.types,
    terms: record.terms,
    addressComponents: record.addressComponents
  };

  const resolvedLat = coords?.lat ?? record.lat;
  const resolvedLng = coords?.lng ?? record.lng;
  if (typeof resolvedLat === "number") {
    payload.lat = resolvedLat;
  }
  if (typeof resolvedLng === "number") {
    payload.lng = resolvedLng;
  }

  (Object.keys(payload) as Array<keyof LocationRecord>).forEach((key) => {
    const value = payload[key];
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim().length === 0) ||
      (Array.isArray(value) && value.length === 0)
    ) {
      delete payload[key];
    }
  });

  return payload;
}

function requiresDiscoverableLocation(visibilityType: VisibilityType) {
  return visibilityType === "open_free" || visibilityType === "open_paid";
}

const OPEN_TAILGATE_LOCATION_ERROR =
  "Open tailgates need a location that can be placed on the map so they appear in Discover.";

function buildMapEmbedUrl(
  coords: LatLng,
  mapsApiKey: string,
  locationLabel?: string
): string | null {
  if (!mapsApiKey) return null;
  const query = `${coords.lat},${coords.lng}`;
  const url = new URL("https://www.google.com/maps/embed/v1/place");
  url.searchParams.set("key", mapsApiKey);
  if (locationLabel?.trim()) {
    url.searchParams.set("q", `${query} (${locationLabel.trim()})`);
  } else {
    url.searchParams.set("q", query);
  }
  url.searchParams.set("zoom", "14");
  return url.toString();
}

function resolveStripeConnectStatus(data: Record<string, unknown> | null): StripeConnectStatus {
  const raw = data?.stripeConnectStatus;
  if (raw === "pending" || raw === "complete" || raw === "restricted") {
    return raw;
  }
  return "not_started";
}

function isPayoutReady(data: Record<string, unknown> | null) {
  if (!data) return false;
  return (
    typeof data.stripeConnectAccountId === "string" &&
    data.stripeConnectAccountId.length > 0 &&
    data.stripeConnectStatus === "complete" &&
    data.payoutsEnabled === true
  );
}

export default function CreateTailgateWizard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stepIndex, setStepIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [payoutReady, setPayoutReady] = useState(false);
  const [connectStatus, setConnectStatus] = useState<StripeConnectStatus>("not_started");
  const [hostPlatformFeePercent, setHostPlatformFeePercent] = useState(
    STANDARD_PLATFORM_FEE_PERCENT
  );
  const [hostPromoEndsAtMs, setHostPromoEndsAtMs] = useState<number | null>(null);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [paidFeeModalOpen, setPaidFeeModalOpen] = useState(false);
  const [payoutSetupLoading, setPayoutSetupLoading] = useState(false);
  const [payoutSetupError, setPayoutSetupError] = useState<string | null>(null);

  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");

  const [locationSummary, setLocationSummary] = useState("");
  const [locationRecord, setLocationRecord] = useState<LocationRecord | null>(null);
  const [locationCoords, setLocationCoords] = useState<LatLng | null>(null);
  const [resolvingLocation, setResolvingLocation] = useState(false);
  const [locationInputFocused, setLocationInputFocused] = useState(false);

  const [visibilityType, setVisibilityType] = useState<VisibilityType>("private");
  const [priceInput, setPriceInput] = useState("");
  const [capacityInput, setCapacityInput] = useState("");
  const [ticketSalesCutoffDaysInput, setTicketSalesCutoffDaysInput] = useState("0");
  const [expectations, setExpectations] = useState<Expectations>(expectationsDefaults);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [allowGuestPlusOnInvite, setAllowGuestPlusOnInvite] = useState(false);
  const [maxAdditionalGuestsPerInvite, setMaxAdditionalGuestsPerInvite] = useState("2");
  const [contactSearch, setContactSearch] = useState("");
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

  const [manualGuestName, setManualGuestName] = useState("");
  const [manualGuestPhone, setManualGuestPhone] = useState("");

  const [quizTitle, setQuizTitle] = useState("");
  const [quizTitleError, setQuizTitleError] = useState("");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    createEmptyQuizQuestion([])
  ]);
  const [currentQuizQuestionIndex, setCurrentQuizQuestionIndex] = useState(0);
  const [quizErrors, setQuizErrors] = useState<Record<number, QuizQuestionError>>({});
  const [quizValidationMessage, setQuizValidationMessage] = useState<string | null>(null);
  const [quizEnabled, setQuizEnabled] = useState(false);
  const [timelineEnabled, setTimelineEnabled] = useState(false);
  const [timelineSteps, setTimelineSteps] = useState<TimelineDraftStep[]>([]);
  const [timelineTitle, setTimelineTitle] = useState("");
  const [timelineDescription, setTimelineDescription] = useState("");
  const [timelineStartTime, setTimelineStartTime] = useState("09:00");
  const [timelineDurationHours, setTimelineDurationHours] = useState("0");
  const [timelineDurationMinutes, setTimelineDurationMinutes] = useState("0");
  const [timelineDurationSeconds, setTimelineDurationSeconds] = useState("0");
  const [editingTimelineId, setEditingTimelineId] = useState<string | null>(null);
  const [coverImageDrafts, setCoverImageDrafts] = useState<CoverImageDraft[]>([]);
  const coverImageInputRef = useRef<HTMLInputElement | null>(null);
  const coverImageDraftsRef = useRef<CoverImageDraft[]>([]);
  const reconcileHostPromoEligibility = useMemo(
    () =>
      firebaseFunctions
        ? httpsCallable(firebaseFunctions, "reconcileHostEarlyAdopterPromoEligibility")
        : null,
    []
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const guestInvitesEnabled = visibilityType === "private";
  const quizCreationAllowed = visibilityType === "private";
  const ticketPriceCents = useMemo(() => parsePriceToCents(priceInput), [priceInput]);
  const ticketCapacity = useMemo(() => parseCapacity(capacityInput), [capacityInput]);
  const hostPlatformFeeRate = hostPlatformFeePercent / 100;

  const filteredContacts = useMemo(() => {
    const query = contactSearch.trim().toLowerCase();
    if (!query) return seededContacts;
    return seededContacts.filter((contact) =>
      `${contact.name} ${contact.phone}`.toLowerCase().includes(query)
    );
  }, [contactSearch]);

  const pricingInvalid = useMemo(() => {
    if (visibilityType !== "open_paid") return false;
    return !ticketPriceCents || ticketPriceCents < minTicketPriceCents;
  }, [ticketPriceCents, visibilityType]);

  const capacityInvalid = useMemo(() => {
    if (visibilityType !== "open_paid") return false;
    if (!capacityInput.trim()) return false;
    return parseCapacity(capacityInput) === null;
  }, [capacityInput, visibilityType]);

  const ticketSalesCutoffInvalid = useMemo(() => {
    if (visibilityType !== "open_paid") return false;
    return parseTicketSalesCutoffDays(ticketSalesCutoffDaysInput) === null;
  }, [ticketSalesCutoffDaysInput, visibilityType]);

  const progressLabel = `${stepIndex + 1} / ${wizardSteps.length}`;
  const stepSubtitle =
    stepIndex === 3
      ? guestInvitesEnabled
        ? "Invite Friends + Add-ons"
        : "Optional Add-ons"
      : wizardSteps[stepIndex].subtitle;
  const mapUrl = locationCoords
    ? buildMapEmbedUrl(locationCoords, MAPS_API_KEY, locationSummary)
    : null;
  const selectedVisibility = visibilityOptions.find((option) => option.key === visibilityType);
  const currentQuizQuestion =
    quizQuestions[currentQuizQuestionIndex] ?? emptyQuizQuestionFallback;
  const currentQuizErrors = quizErrors[currentQuizQuestionIndex] ?? {};
  const paidTicketEstimate = useMemo(() => {
    if (visibilityType !== "open_paid") return null;
    if (!ticketPriceCents || ticketPriceCents < minTicketPriceCents) return null;

    const estimate = estimateHostPayout({
      ticketsSold: 1,
      ticketPriceCents,
      platformFeeRate: hostPlatformFeeRate,
      stripeFeePercent: 0,
      stripeFeeFixed: 0
    });
    const totalFee = Math.round(estimate.platformFee);
    const selloutEstimate =
      ticketCapacity && ticketCapacity > 0
        ? estimateHostPayout({
            ticketsSold: ticketCapacity,
            ticketPriceCents,
            platformFeeRate: hostPlatformFeeRate,
            stripeFeePercent: 0,
            stripeFeeFixed: 0
          })
        : null;
    const selloutGross = selloutEstimate ? Math.round(selloutEstimate.gross) : null;
    const selloutTotalFee = selloutEstimate ? Math.round(selloutEstimate.platformFee) : null;

    return {
      totalFee,
      payout: Math.round(estimate.payout),
      selloutGross,
      selloutTotalFee
    };
  }, [hostPlatformFeeRate, ticketCapacity, ticketPriceCents, visibilityType]);
  const hostPromoEndsLabel = useMemo(() => {
    if (!hostPromoEndsAtMs) {
      return null;
    }
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(hostPromoEndsAtMs));
  }, [hostPromoEndsAtMs]);
  const filledQuizQuestions = quizQuestions.filter(
    (question) => question.questionText.trim() !== ""
  );
  const {
    suggestions: locationSuggestions,
    loading: locationSuggestionsLoading,
    resolveSuggestion: resolveLocationSuggestion,
    clearSuggestions: clearLocationSuggestions
  } = usePlacesAutocomplete({
    mapsApiKey: MAPS_API_KEY,
    value: locationSummary,
    enabled: stepIndex === 2
  });

  const refreshPayoutStatus = useCallback(async (): Promise<boolean> => {
    if (!user?.uid || !db) {
      setPayoutReady(false);
      setConnectStatus("not_started");
      setHostPlatformFeePercent(STANDARD_PLATFORM_FEE_PERCENT);
      setHostPromoEndsAtMs(null);
      return false;
    }

    try {
      try {
        if (reconcileHostPromoEligibility) {
          await reconcileHostPromoEligibility({});
        }
      } catch (promoError) {
        console.warn("[CreateTailgateWizard] Failed to reconcile promo eligibility", promoError);
      }
      const userSnap = await getDoc(doc(db, "users", user.uid));
      const data = userSnap.exists() ? (userSnap.data() as Record<string, unknown>) : null;
      const ready = isPayoutReady(data);
      const feeSummary = resolveHostPlatformFeeSummary(data);
      setPayoutReady(ready);
      setConnectStatus(resolveStripeConnectStatus(data));
      setHostPlatformFeePercent(feeSummary.feePercent);
      setHostPromoEndsAtMs(feeSummary.promoEndsAtMs);
      return ready;
    } catch (error) {
      console.error("Failed to refresh Stripe payout status", error);
      setPayoutReady(false);
      setConnectStatus("not_started");
      setHostPlatformFeePercent(STANDARD_PLATFORM_FEE_PERCENT);
      setHostPromoEndsAtMs(null);
      return false;
    }
  }, [reconcileHostPromoEligibility, user?.uid]);

  useEffect(() => {
    void refreshPayoutStatus();
  }, [refreshPayoutStatus]);

  useEffect(() => {
    const onFocus = () => {
      void refreshPayoutStatus();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refreshPayoutStatus]);

  useEffect(() => {
    if (!editingTimelineId && timelineSteps.length === 0 && eventTime) {
      setTimelineStartTime(eventTime);
    }
  }, [editingTimelineId, eventTime, timelineSteps.length]);

  useEffect(() => {
    if (quizCreationAllowed) return;
    if (!quizEnabled) return;
    setQuizEnabled(false);
    setQuizTitleError("");
    setQuizErrors({});
    setQuizValidationMessage(null);
    setErrors((prev) => {
      if (!prev.quizEnabled) return prev;
      const next = { ...prev };
      delete next.quizEnabled;
      return next;
    });
  }, [quizCreationAllowed, quizEnabled]);

  useEffect(() => {
    coverImageDraftsRef.current = coverImageDrafts;
  }, [coverImageDrafts]);

  useEffect(() => {
    return () => {
      coverImageDraftsRef.current.forEach((draft) => {
        URL.revokeObjectURL(draft.previewUrl);
      });
    };
  }, []);

  const resolveAddressToCoords = async () => {
    const query = locationSummary.trim();
    if (!query) return null;
    if (!MAPS_API_KEY) return null;
    setResolvingLocation(true);
    try {
      const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
      url.searchParams.set("address", query);
      url.searchParams.set("key", MAPS_API_KEY);

      const response = await fetch(url.toString(), {
        headers: {
          Accept: "application/json"
        }
      });
      if (!response.ok) return null;
      const payload = (await response.json()) as {
        status?: string;
        results?: Array<{
          formatted_address?: string;
          place_id?: string;
          address_components?: Array<Record<string, unknown>>;
          geometry?: { location?: { lat?: number; lng?: number } };
        }>;
      };
      if (payload.status !== "OK") return null;
      const first = payload.results?.[0];
      const lat = first?.geometry?.location?.lat;
      const lng = first?.geometry?.location?.lng;
      if (
        typeof lat !== "number" ||
        !Number.isFinite(lat) ||
        typeof lng !== "number" ||
        !Number.isFinite(lng)
      ) {
        return null;
      }
      const label = first?.formatted_address ?? query;
      const next: LatLng = { lat, lng };
      setLocationCoords(next);
      setLocationRecord((prev) =>
        prev
          ? {
              ...prev,
              formatted: prev.formatted ?? label,
              formattedAddress: prev.formattedAddress ?? label,
              address: prev.address ?? label,
              text: prev.text ?? label,
              description: prev.description ?? label,
              name: prev.name ?? label,
              placeId: prev.placeId ?? first?.place_id,
              addressComponents: prev.addressComponents ?? first?.address_components,
              lat: next.lat,
              lng: next.lng
            }
          : {
              description: label,
              formatted: label,
              formattedAddress: label,
              address: label,
              text: label,
              name: label,
              placeId: first?.place_id,
              addressComponents: first?.address_components,
              lat: next.lat,
              lng: next.lng
            }
      );
      setLocationSummary(label);
      clearFieldError("locationSummary");
      clearLocationSuggestions();
      return next;
    } catch (error) {
      console.error("Failed to resolve address", error);
      return null;
    } finally {
      setResolvingLocation(false);
    }
  };

  const handleSelectLocationSuggestion = async (
    place: {
      placeId: string;
      description: string;
      primaryText: string;
      secondaryText?: string;
      reference?: string;
      types?: string[];
      terms?: Array<{ value: string; offset?: number }>;
    }
  ) => {
    setResolvingLocation(true);
    try {
      const resolved = await resolveLocationSuggestion(place);
      const locationPayload: LocationRecord = {
        description: place.description,
        formatted: resolved?.formattedAddress ?? place.description,
        formattedAddress: resolved?.formattedAddress,
        address: resolved?.formattedAddress ?? place.description,
        text: place.description,
        shortAddress: place.secondaryText,
        name: resolved?.name ?? place.primaryText,
        mainText: place.primaryText,
        secondaryText: place.secondaryText,
        placeId: place.placeId,
        reference: place.reference,
        types: place.types,
        terms: place.terms,
        addressComponents: resolved?.addressComponents,
        lat: resolved?.lat,
        lng: resolved?.lng
      };
      setLocationRecord(locationPayload);

      if (!resolved) {
        setLocationSummary(place.description);
        setLocationCoords(null);
        return;
      }

      setLocationSummary(resolved.label);
      setLocationCoords({ lat: resolved.lat, lng: resolved.lng });
      clearFieldError("locationSummary");
      clearLocationSuggestions();
      setLocationInputFocused(false);
    } finally {
      setResolvingLocation(false);
    }
  };

  const clearFieldError = (key: string) => {
    if (!errors[key]) return;
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const clearQuizValidation = () => {
    setQuizTitleError("");
    setQuizErrors({});
    setQuizValidationMessage(null);
    clearFieldError("quizEnabled");
  };

  const applyVisibilitySelection = (next: VisibilityType) => {
    if (next !== "private") {
      setGuests([]);
      setSelectedContactIds([]);
      setContactModalOpen(false);
      setManualGuestName("");
      setManualGuestPhone("");
      clearFieldError("manualGuestName");
      clearFieldError("manualGuestPhone");
      clearFieldError("guestPlusLimit");
      setQuizEnabled(false);
      clearQuizValidation();
    }
    if (next !== "open_paid") {
      setTicketSalesCutoffDaysInput("0");
      clearFieldError("ticketSalesCutoffDaysInput");
    }
    setVisibilityType(next);
  };

  const updateQuizQuestionText = (text: string) => {
    setQuizQuestions((prev) => {
      const next = [...prev];
      const target = next[currentQuizQuestionIndex];
      if (!target) return prev;
      next[currentQuizQuestionIndex] = {
        ...target,
        questionText: text
      };
      return next;
    });

    setQuizErrors((prev) => {
      const next = { ...prev };
      const current = next[currentQuizQuestionIndex];
      if (!current?.questionText || !text.trim()) return prev;
      const updated: QuizQuestionError = { ...current };
      delete updated.questionText;
      if (Object.keys(updated).length === 0) {
        delete next[currentQuizQuestionIndex];
      } else {
        next[currentQuizQuestionIndex] = updated;
      }
      return next;
    });
    setQuizValidationMessage(null);
  };

  const updateQuizChoiceText = (choiceId: string, text: string) => {
    setQuizQuestions((prev) => {
      const next = [...prev];
      const target = next[currentQuizQuestionIndex];
      if (!target) return prev;
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

    setQuizErrors((prev) => {
      const next = { ...prev };
      const current = next[currentQuizQuestionIndex];
      const choiceErrors = current?.choices;
      if (!choiceErrors?.[choiceId] || !text.trim()) return prev;
      const updatedChoiceErrors = { ...choiceErrors };
      delete updatedChoiceErrors[choiceId];
      const updated: QuizQuestionError = {
        ...current,
        choices: Object.keys(updatedChoiceErrors).length > 0 ? updatedChoiceErrors : undefined
      };
      if (!updated.choices && !updated.correctChoiceId && !updated.questionText) {
        delete next[currentQuizQuestionIndex];
      } else {
        next[currentQuizQuestionIndex] = updated;
      }
      return next;
    });
    setQuizValidationMessage(null);
  };

  const setQuizCorrectChoice = (choiceId: string) => {
    setQuizQuestions((prev) => {
      const next = [...prev];
      const target = next[currentQuizQuestionIndex];
      if (!target) return prev;
      next[currentQuizQuestionIndex] = {
        ...target,
        correctChoiceId: choiceId
      };
      return next;
    });

    setQuizErrors((prev) => {
      const next = { ...prev };
      const current = next[currentQuizQuestionIndex];
      if (!current?.correctChoiceId) return prev;
      const updated: QuizQuestionError = { ...current };
      delete updated.correctChoiceId;
      if (!updated.choices && !updated.questionText) {
        delete next[currentQuizQuestionIndex];
      } else {
        next[currentQuizQuestionIndex] = updated;
      }
      return next;
    });
    setQuizValidationMessage(null);
  };

  const isQuizQuestionComplete = (question: QuizQuestion): boolean => {
    if (!question.questionText.trim()) return false;
    if (question.choices.some((choice) => !choice.text.trim())) return false;
    if (!question.correctChoiceId) return false;
    return true;
  };

  const setQuizQuestionType = (type: "multiple" | "truefalse") => {
    setQuizQuestions((prev) => {
      const next = [...prev];
      const target = next[currentQuizQuestionIndex];
      if (!target) return prev;
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
    setQuizErrors((prev) => {
      const next = { ...prev };
      delete next[currentQuizQuestionIndex];
      return next;
    });
    setQuizValidationMessage(null);
  };

  const handleAddQuizQuestion = () => {
    if (quizQuestions.length >= MAX_QUIZ_QUESTIONS) {
      setQuizValidationMessage(`Maximum of ${MAX_QUIZ_QUESTIONS} questions allowed.`);
      return;
    }
    const newQuestion = createEmptyQuizQuestion(quizQuestions);
    setQuizQuestions((prev) => [...prev, newQuestion]);
    setCurrentQuizQuestionIndex(quizQuestions.length);
    setQuizValidationMessage(null);
  };

  const handleDeleteCurrentQuizQuestion = () => {
    if (quizQuestions.length === 1) {
      setQuizQuestions([createEmptyQuizQuestion([])]);
      setCurrentQuizQuestionIndex(0);
      setQuizErrors({});
      setQuizValidationMessage(null);
      return;
    }

    const deleteIndex = currentQuizQuestionIndex;
    const nextQuestions = quizQuestions.filter((_, index) => index !== deleteIndex);
    setQuizQuestions(nextQuestions);
    setQuizErrors((prev) => {
      const next: Record<number, QuizQuestionError> = {};
      Object.entries(prev).forEach(([indexKey, value]) => {
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
  };

  const validateQuiz = (): boolean => {
    let valid = true;
    const nextErrors: Record<number, QuizQuestionError> = {};
    const normalizedTitle = quizTitle.trim();

    setQuizValidationMessage(null);

    if (!normalizedTitle) {
      setQuizTitleError("Quiz name is required.");
      valid = false;
    } else {
      setQuizTitleError("");
    }

    const filledQuestions = quizQuestions.filter((question) => question.questionText.trim() !== "");

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

  const removeCoverImageDraft = (draftId: string) => {
    setCoverImageDrafts((prev) => {
      const removed = prev.find((draft) => draft.id === draftId);
      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return prev.filter((draft) => draft.id !== draftId);
    });
    clearFieldError("coverImageFiles");
  };

  const handleCoverImagesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (selectedFiles.length === 0) return;

    if (coverImageDrafts.length >= MAX_COVER_IMAGES) {
      setErrors((prev) => ({
        ...prev,
        coverImageFiles: `You can upload up to ${MAX_COVER_IMAGES} cover photos.`
      }));
      return;
    }

    const availableSlots = MAX_COVER_IMAGES - coverImageDrafts.length;
    const validImageFiles = selectedFiles.filter((file) => file.type.startsWith("image/"));
    const oversizedFiles = validImageFiles.filter(
      (file) => file.size > MAX_COVER_IMAGE_SIZE_BYTES
    );
    const acceptedFiles = validImageFiles
      .filter((file) => file.size <= MAX_COVER_IMAGE_SIZE_BYTES)
      .slice(0, availableSlots);

    if (acceptedFiles.length > 0) {
      const nextDrafts = acceptedFiles.map((file) => ({
        id: createLocalId(),
        file,
        previewUrl: URL.createObjectURL(file)
      }));
      setCoverImageDrafts((prev) => [...prev, ...nextDrafts]);
    }

    const rejectedFileCount = selectedFiles.length - validImageFiles.length;
    const skippedForLimitCount = Math.max(
      0,
      validImageFiles.length - oversizedFiles.length - acceptedFiles.length
    );
    if (rejectedFileCount > 0 || oversizedFiles.length > 0 || skippedForLimitCount > 0) {
      const messageParts: string[] = [];
      if (rejectedFileCount > 0) {
        messageParts.push("Only image files are allowed.");
      }
      if (oversizedFiles.length > 0) {
        messageParts.push("Each photo must be 10MB or less.");
      }
      if (skippedForLimitCount > 0) {
        messageParts.push(`You can upload up to ${MAX_COVER_IMAGES} cover photos.`);
      }
      setErrors((prev) => ({
        ...prev,
        coverImageFiles: messageParts.join(" ")
      }));
      return;
    }

    clearFieldError("coverImageFiles");
  };

  const handleVisibilitySelect = (next: VisibilityType) => {
    clearFieldError("visibilityType");
    if (next === "open_paid" && !payoutReady && visibilityType !== "open_paid") {
      setPayoutSetupError(null);
      setPayoutModalOpen(true);
      return;
    }
    if (next === "open_paid" && visibilityType !== "open_paid") {
      setPaidFeeModalOpen(true);
      return;
    }
    applyVisibilitySelection(next);
  };

  const acknowledgePaidFee = () => {
    setPaidFeeModalOpen(false);
    applyVisibilitySelection("open_paid");
  };

  const handlePayoutSetup = async () => {
    if (!user?.uid) {
      setPayoutSetupError("You must be logged in to set up payouts.");
      return;
    }
    if (!firebaseFunctions) {
      setPayoutSetupError("Functions are not configured in this environment.");
      return;
    }

    setPayoutSetupLoading(true);
    setPayoutSetupError(null);
    try {
      const createLink = httpsCallable(firebaseFunctions, "createConnectOnboardingLink");
      const result = await createLink({
        returnUrl: CONNECT_RETURN_URL,
        refreshUrl: CONNECT_REFRESH_URL
      });
      const url = (result.data as { url?: string } | null)?.url;
      if (!url || typeof url !== "string") {
        throw new Error("Missing onboarding URL");
      }
      const newTab = window.open(url, "_blank", "noopener,noreferrer");
      if (!newTab) {
        window.location.assign(url);
      }
    } catch (error) {
      console.error("Failed to start Stripe onboarding", error);
      setPayoutSetupError("Unable to start payout setup. Try again.");
      setPayoutSetupLoading(false);
    }
  };

  const validateStep = (index: number) => {
    const nextErrors: Record<string, string> = {};

    if (index === 0) {
      if (visibilityType === "open_paid" && !payoutReady) {
        nextErrors.visibilityType = "Set up payouts to host paid tailgates.";
      }
      if (visibilityType === "open_paid") {
        const cents = parsePriceToCents(priceInput);
        if (!cents || cents < minTicketPriceCents) {
          nextErrors.priceInput = "Minimum price is $25.00";
        }
        if (capacityInput.trim() && parseCapacity(capacityInput) === null) {
          nextErrors.capacityInput = "Capacity must be at least 1.";
        }
        if (parseTicketSalesCutoffDays(ticketSalesCutoffDaysInput) === null) {
          nextErrors.ticketSalesCutoffDaysInput = "Use a whole number from 0 to 365.";
        }
      }
    }

    if (index === 1) {
      if (!eventName.trim()) nextErrors.eventName = "Event name is required.";
      if (!eventDate) nextErrors.eventDate = "Date is required.";
      if (!eventTime) nextErrors.eventTime = "Time is required.";
      if (!eventEndTime) nextErrors.eventEndTime = "End time is required.";
      if (!eventDescription.trim()) nextErrors.eventDescription = "Description is required.";
      if (eventDate && eventTime && eventEndTime) {
        const endDateTime = toEndDateTime(eventDate, eventTime, eventEndTime);
        if (!endDateTime) {
          nextErrors.eventEndTime = "End time is invalid.";
        }
      }
    }

    if (index === 2) {
      if (!locationSummary.trim()) nextErrors.locationSummary = "Location is required.";
    }

    if (index === 3) {
      if (visibilityType === "private" && allowGuestPlusOnInvite) {
        const parsedLimit = parseGuestPlusLimit(maxAdditionalGuestsPerInvite);
        if (!parsedLimit) {
          nextErrors.guestPlusLimit = "Enter at least 1 additional guest.";
        }
      }
      clearFieldError("quizEnabled");
      if (quizEnabled) {
        if (!quizCreationAllowed) {
          nextErrors.quizEnabled = "Quiz creation is available for invite-only events.";
        } else if (!validateQuiz()) {
          nextErrors.quizEnabled = "Complete quiz details before continuing.";
        }
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...nextErrors }));
      return false;
    }

    return true;
  };

  const handleNext = async () => {
    setSuccessMessage(null);
    if (!validateStep(stepIndex)) return;

    if (stepIndex === 2 && !locationCoords) {
      const resolvedCoords = await resolveAddressToCoords();
      if (requiresDiscoverableLocation(visibilityType) && !resolvedCoords) {
        setErrors((prev) => ({
          ...prev,
          locationSummary: OPEN_TAILGATE_LOCATION_ERROR
        }));
        return;
      }
    }

    setStepIndex((current) => Math.min(current + 1, wizardSteps.length - 1));
  };

  const handleBack = () => {
    setSuccessMessage(null);
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const resetTimelineForm = useCallback(() => {
    setEditingTimelineId(null);
    setTimelineTitle("");
    setTimelineDescription("");
    setTimelineStartTime(eventTime || "09:00");
    setTimelineDurationHours("0");
    setTimelineDurationMinutes("0");
    setTimelineDurationSeconds("0");
    clearFieldError("timelineTitle");
    clearFieldError("timelineStartTime");
  }, [eventTime, errors]);

  const handleSaveTimelineStep = () => {
    const nextTitle = timelineTitle.trim();
    const nextStartTime = timelineStartTime.trim();
    const durationHours = parseDurationPart(timelineDurationHours);
    const durationMinutes = parseDurationPart(timelineDurationMinutes);
    const durationSeconds = parseDurationPart(timelineDurationSeconds);
    const nextErrors: Record<string, string> = {};

    if (!nextTitle) {
      nextErrors.timelineTitle = "Timeline step title is required.";
    }
    if (!/^\d{2}:\d{2}$/.test(nextStartTime)) {
      nextErrors.timelineStartTime = "Start time is required.";
    }

    const startDateTime = toStartDateTime(eventDate, eventTime);
    if (!startDateTime) {
      nextErrors.timelineStartTime = "Set event date/time before adding timeline steps.";
    } else if (
      !buildTimelineWindow(
        startDateTime,
        nextStartTime,
        durationHours,
        durationMinutes,
        durationSeconds
      )
    ) {
      nextErrors.timelineStartTime = "Timeline start time is invalid.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...nextErrors }));
      return;
    }

    const nextStep: TimelineDraftStep = {
      id: editingTimelineId ?? createLocalId(),
      title: nextTitle,
      description: timelineDescription.trim(),
      startTime: nextStartTime,
      durationHours,
      durationMinutes,
      durationSeconds
    };

    setTimelineSteps((prev) => {
      const next = editingTimelineId
        ? prev.map((step) => (step.id === editingTimelineId ? nextStep : step))
        : [...prev, nextStep];
      return next.sort((left, right) => left.startTime.localeCompare(right.startTime));
    });
    resetTimelineForm();
  };

  const editTimelineStep = (step: TimelineDraftStep) => {
    setEditingTimelineId(step.id);
    setTimelineTitle(step.title);
    setTimelineDescription(step.description);
    setTimelineStartTime(step.startTime);
    setTimelineDurationHours(String(step.durationHours));
    setTimelineDurationMinutes(String(step.durationMinutes));
    setTimelineDurationSeconds(String(step.durationSeconds));
    clearFieldError("timelineTitle");
    clearFieldError("timelineStartTime");
  };

  const removeTimelineStep = (timelineId: string) => {
    setTimelineSteps((prev) => prev.filter((step) => step.id !== timelineId));
    if (editingTimelineId === timelineId) {
      resetTimelineForm();
    }
  };

  const addManualGuest = () => {
    const name = manualGuestName.trim();
    const phone = manualGuestPhone.trim();
    const nextErrors: Record<string, string> = {};

    if (!name) nextErrors.manualGuestName = "Guest name is required.";
    if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(phone)) {
      nextErrors.manualGuestPhone = "Use format (555) 555-5555.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...nextErrors }));
      return;
    }

    setGuests((prev) => [...prev, { id: createLocalId(), name, phone }]);
    setManualGuestName("");
    setManualGuestPhone("");
    clearFieldError("manualGuestName");
    clearFieldError("manualGuestPhone");
  };

  const removeGuest = (id: string) => {
    setGuests((prev) => prev.filter((guest) => guest.id !== id));
  };

  const toggleContactSelection = (id: string) => {
    setSelectedContactIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
    );
  };

  const applySelectedContacts = () => {
    const selected = seededContacts.filter((contact) => selectedContactIds.includes(contact.id));
    setGuests((prev) => {
      const map = new Map(prev.map((guest) => [guest.phone, guest]));
      selected.forEach((contact) => {
        map.set(contact.phone, { id: contact.id, name: contact.name, phone: contact.phone });
      });
      return Array.from(map.values());
    });
    setContactModalOpen(false);
  };

  const handleCreateTailgate = async () => {
    const stepValidity = [0, 1, 2, 3].map((index) => validateStep(index));
    const firstInvalidStep = stepValidity.findIndex((isValid) => !isValid);
    if (firstInvalidStep !== -1) {
      setStepIndex(firstInvalidStep);
      return;
    }

    if (!user?.uid) {
      setErrors((prev) => ({ ...prev, submit: "You must be logged in to create a tailgate." }));
      return;
    }

    const startDateTime = toStartDateTime(eventDate, eventTime);
    if (!startDateTime) {
      setErrors((prev) => ({ ...prev, submit: "Date/time is invalid." }));
      return;
    }
    const endDateTime = toEndDateTime(eventDate, eventTime, eventEndTime);
    if (!endDateTime) {
      setErrors((prev) => ({ ...prev, submit: "End time is invalid." }));
      return;
    }

    setSaving(true);
    clearFieldError("submit");

    if (visibilityType === "open_paid") {
      const ready = await refreshPayoutStatus();
      if (!ready) {
        setPayoutSetupError("Set up payouts to create a paid tailgate.");
        setPayoutModalOpen(true);
        setSaving(false);
        return;
      }
    }

    let resolvedCoords = locationCoords;
    if (!resolvedCoords && locationSummary.trim()) {
      resolvedCoords = await resolveAddressToCoords();
    }
    if (requiresDiscoverableLocation(visibilityType) && !resolvedCoords) {
      setErrors((prev) => ({
        ...prev,
        locationSummary: OPEN_TAILGATE_LOCATION_ERROR
      }));
      setSaving(false);
      return;
    }

    const priceCents = ticketPriceCents;
    const capacity = ticketCapacity;
    const trimmedLocation = locationSummary.trim();
    const locationPayload = buildLocationPayload(locationRecord, trimmedLocation, resolvedCoords);
    const normalizedLocationSummary = resolveLocationLabel(locationPayload) || trimmedLocation;
    const normalizedQuizQuestions = filledQuizQuestions.map((question) => ({
      id: question.id,
      questionText: question.questionText.trim(),
      choices: question.choices.map((choice) => ({
        id: choice.id,
        text: choice.text.trim()
      })),
      correctChoiceId: question.correctChoiceId,
      type: question.type
    }));
    const quizUsed =
      quizEnabled &&
      quizTitle.trim().length > 0 &&
      normalizedQuizQuestions.length > 0;
    let uploadedCoverImageUrls: string[] = [];

    if (coverImageDrafts.length > 0 && db) {
      if (!storage) {
        setErrors((prev) => ({
          ...prev,
          submit: "Image upload is unavailable right now."
        }));
        setSaving(false);
        return;
      }

      try {
        uploadedCoverImageUrls = await uploadCoverImagesForTailgate(user.uid, coverImageDrafts);
      } catch (uploadError) {
        console.error("Failed to upload cover images", uploadError);
        setErrors((prev) => ({
          ...prev,
          submit: "Unable to upload cover photos. Please try again."
        }));
        setSaving(false);
        return;
      }
    } else if (coverImageDrafts.length > 0 && !db) {
      console.warn("Cover images were selected, but Firestore is not configured.");
    }

    const payload: Record<string, unknown> = {
      eventName: eventName.trim(),
      name: eventName.trim(),
      description: eventDescription.trim(),
      visibilityType,
      hasEventFeed: true,
      startDateTime,
      endDateTime,
      dateTime: startDateTime,
      eventEndTime,
      locationSummary: normalizedLocationSummary,
      location: locationPayload,
      locationCoords: resolvedCoords,
      expectations,
      attendees: guestInvitesEnabled
        ? guests.map((guest) => ({
            id: createLocalId(),
            token: createLocalId(),
            name: guest.name,
            phone: guest.phone,
            status: "Pending"
          }))
        : [],
      hostUserId: user.uid,
      hostId: user.uid,
      hostName: user.displayName ?? "",
      hostEmail: user.email ?? "",
      eventTargetTime: startDateTime,
      timelineEnabled,
      schedulePublished: false,
      status: "upcoming",
      metadata: {
        createdViaWebsite: true,
        createdPlatform: "website"
      },
      createdAt: new Date()
    };

    if (visibilityType === "private") {
      const parsedPlusLimit = parseGuestPlusLimit(maxAdditionalGuestsPerInvite);
      payload.allowGuestPlusOnInvite = allowGuestPlusOnInvite;
      payload.maxAdditionalGuestsPerInvite = allowGuestPlusOnInvite
        ? parsedPlusLimit ?? 1
        : 0;
    }

    if (uploadedCoverImageUrls.length > 0) {
      const primaryCover = uploadedCoverImageUrls[0];
      payload.coverImageUrl = primaryCover;
      payload.coverPhotoUrl = primaryCover;
      payload.imageUrl = primaryCover;
      payload.coverImageUrls = uploadedCoverImageUrls;
      payload.cover = {
        url: primaryCover,
        imageUrl: primaryCover,
        downloadUrl: primaryCover
      };
      payload.media = {
        coverImageUrl: primaryCover,
        coverImageUrls: uploadedCoverImageUrls,
        imageUrl: primaryCover
      };
    }

    if (visibilityType === "open_paid") {
      const ticketSalesCloseDaysBefore = parseTicketSalesCutoffDays(ticketSalesCutoffDaysInput) ?? 0;
      const ticketSalesCloseAt = new Date(
        startDateTime.getTime() - ticketSalesCloseDaysBefore * 24 * 60 * 60 * 1000
      );
      payload.priceCents = priceCents;
      payload.ticketPriceCents = priceCents;
      payload.currency = "USD";
      payload.capacity = capacity;
      payload.visibilityRequiresPayment = true;
      payload.ticketSalesCloseDaysBefore = ticketSalesCloseDaysBefore;
      payload.ticketSalesCutoffDays = ticketSalesCloseDaysBefore;
      payload.ticketSalesCloseAt = ticketSalesCloseAt;
    }

    if (quizUsed) {
      payload.quiz = {
        title: quizTitle.trim(),
        questions: normalizedQuizQuestions
      };
    }

    try {
      let newId = `mock-${createLocalId()}`;
      if (db) {
        const created = await addDoc(collection(db, "tailgateEvents"), payload);
        newId = created.id;

        if (quizUsed) {
          await addDoc(collection(db, "tailgateEvents", newId, "quizzes"), {
            eventId: newId,
            title: quizTitle.trim(),
            questions: normalizedQuizQuestions,
            createdBy: user.uid,
            createdAt: new Date()
          });
        }

        if (timelineEnabled && timelineSteps.length > 0) {
          const scheduleCollection = collection(db, "tailgateEvents", newId, "schedule");
          await Promise.all(
            timelineSteps.map((step) => {
              const window = buildTimelineWindow(
                startDateTime,
                step.startTime,
                step.durationHours,
                step.durationMinutes,
                step.durationSeconds
              );
              if (!window) return Promise.resolve();

              return addDoc(scheduleCollection, {
                title: step.title,
                description: step.description,
                timestampStart: window.start,
                timestampEnd: window.end,
                createdAt: new Date()
              });
            })
          );
          await updateDoc(doc(db, "tailgateEvents", newId), {
            schedulePublished: false
          });
        }
      } else {
        console.warn("Firestore is not configured; tailgate saved locally only.");
      }
      setSuccessMessage("Tailgate created successfully.");
      navigate(`/tailgates/${newId}`);
    } catch (error) {
      console.error("Failed to create tailgate", error);
      setErrors((prev) => ({ ...prev, submit: "Unable to create tailgate. Try again." }));
    } finally {
      setSaving(false);
    }
  };

  const renderStepDetails = () => (
    <section className="create-wizard-stack">
      <div className="create-wizard-card">
        <div className="create-wizard-card-header">
          <h2>Step 2: Event Details</h2>
        </div>

        <label className="input-label" htmlFor="event-name">Tailgate Event Name</label>
        <input
          id="event-name"
          className="text-input create-wizard-input"
          value={eventName}
          onChange={(event) => {
            setEventName(event.target.value);
            clearFieldError("eventName");
          }}
          placeholder="Football Tailgate Home Opener"
        />
        {errors.eventName ? <p className="create-wizard-error">{errors.eventName}</p> : null}

        <div className="create-wizard-date-time">
          <div>
            <label className="input-label" htmlFor="event-date">Date</label>
            <input
              id="event-date"
              className="text-input create-wizard-input"
              type="date"
              value={eventDate}
              onChange={(event) => {
                setEventDate(event.target.value);
                clearFieldError("eventDate");
              }}
            />
            {errors.eventDate ? <p className="create-wizard-error">{errors.eventDate}</p> : null}
          </div>
          <div>
            <label className="input-label" htmlFor="event-time">Start Time</label>
            <input
              id="event-time"
              className="text-input create-wizard-input"
              type="time"
              value={eventTime}
              onChange={(event) => {
                setEventTime(event.target.value);
                clearFieldError("eventTime");
              }}
            />
            {errors.eventTime ? <p className="create-wizard-error">{errors.eventTime}</p> : null}
          </div>
          <div>
            <label className="input-label" htmlFor="event-end-time">End Time</label>
            <input
              id="event-end-time"
              className="text-input create-wizard-input"
              type="time"
              value={eventEndTime}
              onChange={(event) => {
                setEventEndTime(event.target.value);
                clearFieldError("eventEndTime");
              }}
            />
            {errors.eventEndTime ? <p className="create-wizard-error">{errors.eventEndTime}</p> : null}
          </div>
        </div>

        <label className="input-label" htmlFor="event-description">Description</label>
        <textarea
          id="event-description"
          className="text-input create-wizard-input create-wizard-textarea"
          value={eventDescription}
          onChange={(event) => {
            setEventDescription(event.target.value);
            clearFieldError("eventDescription");
          }}
          placeholder="Come out to tailgate and get ready for our team to win the home opener!"
        />
        {errors.eventDescription ? (
          <p className="create-wizard-error">{errors.eventDescription}</p>
        ) : null}

        <div className="create-wizard-cover-upload">
          <div className="create-wizard-cover-upload-header">
            <div>
              <p className="input-label">Cover Photos</p>
              <p className="meta-muted">
                Upload up to {MAX_COVER_IMAGES}. The first photo becomes the default cover.
              </p>
            </div>
            <button
              type="button"
              className="secondary-button"
              onClick={() => coverImageInputRef.current?.click()}
              disabled={coverImageDrafts.length >= MAX_COVER_IMAGES}
            >
              {coverImageDrafts.length >= MAX_COVER_IMAGES ? "Max reached" : "Add photos"}
            </button>
          </div>
          <input
            ref={coverImageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="create-wizard-cover-upload-input"
            onChange={handleCoverImagesSelected}
          />
          {errors.coverImageFiles ? (
            <p className="create-wizard-error">{errors.coverImageFiles}</p>
          ) : null}
          {coverImageDrafts.length > 0 ? (
            <div className="create-wizard-cover-grid">
              {coverImageDrafts.map((draft, index) => (
                <figure key={draft.id} className="create-wizard-cover-item">
                  <img src={draft.previewUrl} alt={`Cover ${index + 1}`} />
                  <figcaption>
                    <span>{index === 0 ? "Primary" : `Photo ${index + 1}`}</span>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => removeCoverImageDraft(draft.id)}
                    >
                      Remove
                    </button>
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <p className="meta-muted">No cover photos selected yet.</p>
          )}
        </div>
      </div>

      <div className="create-wizard-card">
        <div className="create-wizard-card-header">
          <h2>Tailgate Details</h2>
        </div>
        <p className="create-wizard-detail-copy">
          Paint the full tailgate vibe. Choose all options that match what guests will see.
        </p>
        <div className="create-wizard-detail-groups">
          {expectationGroups.map((group) => (
            <div key={group.key} className="create-wizard-detail-group">
              <div className="create-wizard-detail-group-header">
                <h3>{group.title}</h3>
                <p>{group.description}</p>
              </div>
              <div className="create-wizard-chip-grid">
                {group.options.map((option) => {
                  const active = expectations[option.key];
                  return (
                    <button
                      type="button"
                      key={option.key}
                      className={`create-wizard-chip ${active ? "active" : ""}`}
                      onClick={() =>
                        setExpectations((prev) => ({
                          ...prev,
                          [option.key]: !prev[option.key]
                        }))
                      }
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderStepLocation = () => (
    <section className="create-wizard-card">
      <div className="create-wizard-card-header">
        <h2>Step 3: Event Location</h2>
      </div>

      <label className="input-label" htmlFor="location-summary">Location</label>
      <div className="create-wizard-input-with-icon">
        <input
          id="location-summary"
          className="text-input create-wizard-input"
          value={locationSummary}
          placeholder="Cameron Stadium, Garland Street, Bangor, Maine, USA"
          onChange={(event) => {
            setLocationSummary(event.target.value);
            setLocationRecord(null);
            setLocationCoords(null);
            clearFieldError("locationSummary");
            setLocationInputFocused(true);
          }}
          onFocus={() => setLocationInputFocused(true)}
          onBlur={() => {
            window.setTimeout(() => setLocationInputFocused(false), 120);
          }}
        />
        <IconLocation />
        {locationInputFocused && locationSummary.trim() && MAPS_API_KEY ? (
          <div className="places-suggestions create-wizard-places-suggestions">
            {locationSuggestionsLoading ? (
              <p className="places-suggestion-state">Searching places...</p>
            ) : locationSuggestions.length > 0 ? (
              locationSuggestions.map((place) => (
                <button
                  type="button"
                  key={place.placeId}
                  className="places-suggestion-button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    void handleSelectLocationSuggestion(place);
                  }}
                >
                  <span className="places-suggestion-primary">{place.primaryText}</span>
                  {place.secondaryText ? (
                    <span className="places-suggestion-secondary">{place.secondaryText}</span>
                  ) : null}
                </button>
              ))
            ) : (
              <p className="places-suggestion-state">No place matches found.</p>
            )}
          </div>
        ) : null}
      </div>
      {errors.locationSummary ? (
        <p className="create-wizard-error">{errors.locationSummary}</p>
      ) : null}
      {requiresDiscoverableLocation(visibilityType) ? (
        <p className="create-wizard-helper">
          Open tailgates need a mapped location to appear in Discover on web and app.
        </p>
      ) : null}

      <div className="create-wizard-map-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={() => {
            void resolveAddressToCoords();
          }}
          disabled={resolvingLocation || !locationSummary.trim() || !MAPS_API_KEY}
        >
          {resolvingLocation ? "Finding map..." : "Find on map"}
        </button>
      </div>

      <div className="create-wizard-map-card">
        {mapUrl ? (
          <iframe
            title="Tailgate location preview"
            className="create-wizard-map-iframe"
            src={mapUrl}
          />
        ) : (
          <div className="create-wizard-map-placeholder">
            {MAPS_API_KEY
              ? 'Enter a location and click "Find on map" to preview the pin.'
              : "Set MAPS_API_KEY to preview Google Maps."}
          </div>
        )}
      </div>
    </section>
  );

  const renderStepType = () => (
    <section className="create-wizard-stack">
      <div className="create-wizard-card">
        <div className="create-wizard-card-header">
          <h2>Step 1: Tailgate Type</h2>
        </div>
        <div className="create-wizard-radio-list">
          {visibilityOptions.map((option) => (
            <label key={option.key} className="create-wizard-radio-row">
              <input
                type="radio"
                checked={visibilityType === option.key}
                onChange={() => handleVisibilitySelect(option.key)}
              />
              <span>
                <strong>{option.label}</strong>
                <span className="create-wizard-radio-help">{option.description}</span>
                {option.key === "open_paid" && !payoutReady ? (
                  <span className="create-wizard-radio-warning">Requires payout setup</span>
                ) : null}
              </span>
            </label>
          ))}
        </div>
        {errors.visibilityType ? (
          <p className="create-wizard-error">{errors.visibilityType}</p>
        ) : null}
        {visibilityType === "open_paid" ? (
          <p className="create-wizard-connect-status">
            Payout status: {connectStatus.replace("_", " ")}
          </p>
        ) : null}

        {visibilityType === "open_paid" ? (
          <div className="create-wizard-inline-grid">
            <div>
              <label className="input-label" htmlFor="ticket-price">Ticket Price (USD)</label>
              <div className="create-wizard-input-with-prefix">
                <span className="create-wizard-input-prefix" aria-hidden="true">$</span>
                <input
                  id="ticket-price"
                  className="text-input create-wizard-input"
                  value={priceInput}
                  onChange={(event) => {
                    setPriceInput(event.target.value.replace(/[^0-9.]/g, ""));
                    clearFieldError("priceInput");
                  }}
                  placeholder="25.00"
                  inputMode="decimal"
                />
              </div>
              {errors.priceInput || pricingInvalid ? (
                <p className="create-wizard-error">
                  {errors.priceInput ?? "Minimum price is $25.00"}
                </p>
              ) : null}
            </div>
              <div>
                <label className="input-label" htmlFor="ticket-capacity">Capacity (optional)</label>
                <input
                id="ticket-capacity"
                className="text-input create-wizard-input"
                value={capacityInput}
                onChange={(event) => {
                  setCapacityInput(event.target.value.replace(/\D/g, ""));
                  clearFieldError("capacityInput");
                }}
                placeholder="100"
              />
              {errors.capacityInput || capacityInvalid ? (
                <p className="create-wizard-error">
                  {errors.capacityInput ?? "Capacity must be at least 1."}
                </p>
                ) : null}
              </div>
              <div>
                <label className="input-label" htmlFor="ticket-sales-cutoff-days">
                  Stop selling tickets (days before)
                </label>
                <input
                  id="ticket-sales-cutoff-days"
                  className="text-input create-wizard-input"
                  value={ticketSalesCutoffDaysInput}
                  onChange={(event) => {
                    setTicketSalesCutoffDaysInput(event.target.value.replace(/\D/g, ""));
                    clearFieldError("ticketSalesCutoffDaysInput");
                  }}
                  placeholder="0"
                  inputMode="numeric"
                />
                <p className="meta-muted">Set to 0 to allow sales until event start.</p>
                {errors.ticketSalesCutoffDaysInput || ticketSalesCutoffInvalid ? (
                  <p className="create-wizard-error">
                    {errors.ticketSalesCutoffDaysInput ?? "Use a whole number from 0 to 365."}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

        {visibilityType === "open_paid" ? renderPaidTicketSummaryCard() : null}
      </div>

    </section>
  );

  function renderPaidTicketSummaryCard() {
    return (
      <div className="create-wizard-fee-card">
        <div className="create-wizard-fee-header">
          <div>
            <h3>Platform fee: {hostPlatformFeePercent}%</h3>
            <p>
              TailgateTime's fee includes transaction processing, payout handling, and payment
              support for each paid ticket.
            </p>
          </div>
          <button
            type="button"
            className="link-button create-wizard-fee-link"
            onClick={() => setPaidFeeModalOpen(true)}
          >
            Fee details
          </button>
        </div>
        {paidTicketEstimate ? (
          <div className="create-wizard-fee-grid">
            <div>
              <span>Ticket price</span>
              <strong>{formatUsdFromCents(ticketPriceCents ?? 0)}</strong>
            </div>
            <div>
              <span>TailgateTime fee est.</span>
              <strong>{formatUsdFromCents(paidTicketEstimate.totalFee)}</strong>
            </div>
            <div>
              <span>Host gets est.</span>
              <strong>{formatUsdFromCents(paidTicketEstimate.payout)}</strong>
            </div>
          </div>
        ) : (
          <p className="create-wizard-fee-empty">
            Enter a valid ticket price to preview the fee breakdown.
          </p>
        )}
        {paidTicketEstimate?.selloutGross && paidTicketEstimate.selloutTotalFee !== null ? (
          <p className="create-wizard-fee-footnote">
            At capacity, gross sales would be{" "}
            <strong>{formatUsdFromCents(paidTicketEstimate.selloutGross)}</strong> and the
            TailgateTime fee would be{" "}
            <strong>{formatUsdFromCents(paidTicketEstimate.selloutTotalFee)}</strong>.
          </p>
        ) : null}
      </div>
    );
  }

  const renderStepInvite = () => (
    <section className="create-wizard-stack">
      {guestInvitesEnabled ? (
        <div className="create-wizard-card">
          <div className="create-wizard-card-header">
            <h2>Step 4: Invite Friends</h2>
            <button
              type="button"
              className="secondary-button"
              onClick={() => setContactModalOpen(true)}
            >
              Add Guests
            </button>
          </div>

          <div className="create-wizard-guest-plus-card">
            <label className="create-wizard-switch-row create-wizard-switch-row-block">
              <input
                type="checkbox"
                checked={allowGuestPlusOnInvite}
                onChange={(event) => {
                  setAllowGuestPlusOnInvite(event.target.checked);
                  clearFieldError("guestPlusLimit");
                }}
              />
              <span>
                <strong>Allow guests to bring guests</strong>
                <small>Let each invitee RSVP with additional people.</small>
              </span>
            </label>

            {allowGuestPlusOnInvite ? (
              <div className="create-wizard-guest-plus-limit">
                <label className="input-label" htmlFor="guest-plus-limit">
                  Max additional guests per invite
                </label>
                <input
                  id="guest-plus-limit"
                  className="text-input create-wizard-input"
                  inputMode="numeric"
                  value={maxAdditionalGuestsPerInvite}
                  onChange={(event) => {
                    setMaxAdditionalGuestsPerInvite(
                      event.target.value.replace(/[^0-9]/g, "").slice(0, 2)
                    );
                    clearFieldError("guestPlusLimit");
                  }}
                  placeholder="2"
                />
                {errors.guestPlusLimit ? (
                  <p className="create-wizard-error">{errors.guestPlusLimit}</p>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="create-wizard-inline-grid">
            <div>
              <label className="input-label" htmlFor="manual-guest-name">Guest Name</label>
              <input
                id="manual-guest-name"
                className="text-input create-wizard-input"
                value={manualGuestName}
                onChange={(event) => {
                  setManualGuestName(event.target.value);
                  clearFieldError("manualGuestName");
                }}
                placeholder="Guest name"
              />
              {errors.manualGuestName ? (
                <p className="create-wizard-error">{errors.manualGuestName}</p>
              ) : null}
            </div>
            <div>
              <label className="input-label" htmlFor="manual-guest-phone">Guest Phone</label>
              <input
                id="manual-guest-phone"
                className="text-input create-wizard-input"
                value={manualGuestPhone}
                onChange={(event) => {
                  setManualGuestPhone(formatPhone(event.target.value));
                  clearFieldError("manualGuestPhone");
                }}
                placeholder="(555) 555-5555"
              />
              {errors.manualGuestPhone ? (
                <p className="create-wizard-error">{errors.manualGuestPhone}</p>
              ) : null}
            </div>
          </div>

          <div className="create-wizard-inline-actions">
            <button type="button" className="primary-button" onClick={addManualGuest}>
              Add guest
            </button>
          </div>

          <div className="create-wizard-guest-list">
            {guests.length === 0 ? (
              <p className="meta-muted">No guests invited yet.</p>
            ) : (
              guests.map((guest) => (
                <div className="create-wizard-guest-row" key={guest.id}>
                  <div>
                    <p className="create-wizard-guest-name">{guest.name}</p>
                    <p className="create-wizard-guest-phone">{guest.phone}</p>
                  </div>
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => removeGuest(guest.id)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="create-wizard-card">
          <div className="create-wizard-card-header">
            <h2>Step 4: Optional Add-ons</h2>
          </div>
          <p className="meta-muted">
            Open tailgates do not support manual guest invites.
          </p>
        </div>
      )}

      <div className="create-wizard-card">
        <div className="create-wizard-card-header">
          <h2>Optional Add-ons</h2>
        </div>
        <p className="section-subtitle">
          Select what to include. Leave these off and continue if you do not need them.
        </p>
        <label className="create-wizard-switch-row">
          <input
            type="checkbox"
            checked={timelineEnabled}
            onChange={(event) => {
              const checked = event.target.checked;
              setTimelineEnabled(checked);
              if (!checked) {
                resetTimelineForm();
              }
            }}
          />
          <span>Include timeline</span>
        </label>
        {quizCreationAllowed ? (
          <label className="create-wizard-switch-row">
            <input
              type="checkbox"
              checked={quizEnabled}
              onChange={(event) => {
                const checked = event.target.checked;
                setQuizEnabled(checked);
                clearQuizValidation();
              }}
            />
            <span>Include quiz</span>
          </label>
        ) : null}
        {errors.quizEnabled ? <p className="create-wizard-error">{errors.quizEnabled}</p> : null}
      </div>

      {timelineEnabled ? (
        <div className="create-wizard-card">
          <div className="create-wizard-card-header">
            <h2>Timeline</h2>
          </div>
          <p className="section-subtitle">
            Build a run-of-show for attendees. You can publish it later from event details.
          </p>
          <div className="create-wizard-inline-grid">
            <div>
              <label className="input-label" htmlFor="timeline-title">Step Title</label>
              <input
                id="timeline-title"
                className="text-input create-wizard-input"
                value={timelineTitle}
                onChange={(event) => {
                  setTimelineTitle(event.target.value);
                  clearFieldError("timelineTitle");
                }}
                placeholder="Grill setup"
              />
              {errors.timelineTitle ? (
                <p className="create-wizard-error">{errors.timelineTitle}</p>
              ) : null}
            </div>
            <div>
              <label className="input-label" htmlFor="timeline-start-time">Start Time</label>
              <input
                id="timeline-start-time"
                className="text-input create-wizard-input"
                type="time"
                value={timelineStartTime}
                onChange={(event) => {
                  setTimelineStartTime(event.target.value);
                  clearFieldError("timelineStartTime");
                }}
              />
              {errors.timelineStartTime ? (
                <p className="create-wizard-error">{errors.timelineStartTime}</p>
              ) : null}
            </div>
          </div>
          <label className="input-label" htmlFor="timeline-description">Description (optional)</label>
          <textarea
            id="timeline-description"
            className="text-input create-wizard-input create-wizard-textarea"
            value={timelineDescription}
            onChange={(event) => setTimelineDescription(event.target.value)}
            placeholder="Get coolers, chairs, and food stations ready."
          />
          <p className="input-label create-wizard-choice-label">Duration</p>
          <div className="create-wizard-timeline-duration-row">
            <div>
              <input
                className="text-input create-wizard-input"
                value={timelineDurationHours}
                onChange={(event) =>
                  setTimelineDurationHours(event.target.value.replace(/\D/g, ""))
                }
                placeholder="0"
              />
              <small>Hours</small>
            </div>
            <div>
              <input
                className="text-input create-wizard-input"
                value={timelineDurationMinutes}
                onChange={(event) =>
                  setTimelineDurationMinutes(event.target.value.replace(/\D/g, ""))
                }
                placeholder="30"
              />
              <small>Minutes</small>
            </div>
            <div>
              <input
                className="text-input create-wizard-input"
                value={timelineDurationSeconds}
                onChange={(event) =>
                  setTimelineDurationSeconds(event.target.value.replace(/\D/g, ""))
                }
                placeholder="0"
              />
              <small>Seconds</small>
            </div>
          </div>
          <div className="create-wizard-inline-actions create-wizard-timeline-actions">
            <button
              type="button"
              className="primary-button"
              onClick={handleSaveTimelineStep}
            >
              {editingTimelineId ? "Update step" : "Add step"}
            </button>
            {editingTimelineId ? (
              <button
                type="button"
                className="secondary-button"
                onClick={resetTimelineForm}
              >
                Cancel edit
              </button>
            ) : null}
          </div>
          <div className="create-wizard-timeline-list">
            {timelineSteps.length === 0 ? (
              <p className="meta-muted">No timeline steps yet.</p>
            ) : (
              timelineSteps.map((step) => {
                const baseDate = toStartDateTime(eventDate, eventTime);
                const window = baseDate
                  ? buildTimelineWindow(
                      baseDate,
                      step.startTime,
                      step.durationHours,
                      step.durationMinutes,
                      step.durationSeconds
                    )
                  : null;
                const timeUntilKickoff =
                  baseDate && window
                    ? formatDurationCountdown(baseDate.getTime() - window.end.getTime())
                    : "--:--:--";
                return (
                  <div className="create-wizard-timeline-row" key={step.id}>
                    <div>
                      <p className="create-wizard-guest-name">{step.title}</p>
                      {step.description ? (
                        <p className="create-wizard-timeline-description">{step.description}</p>
                      ) : null}
                      <p className="create-wizard-guest-phone">
                        {window
                          ? `${window.start.toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit"
                            })} - ${window.end.toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit"
                            })}`
                          : step.startTime}
                      </p>
                      <p className="create-wizard-timeline-countdown">
                        Time until kickoff: {timeUntilKickoff}
                      </p>
                    </div>
                    <div className="create-wizard-timeline-row-actions">
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
                        onClick={() => removeTimelineStep(step.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : null}

      {quizEnabled ? (
        <div className="create-wizard-card">
          <div className="create-wizard-card-header">
            <h2>
              Create Quiz - Question {currentQuizQuestionIndex + 1} / {quizQuestions.length}
            </h2>
          </div>
          <p className="section-subtitle">
            Match the mobile flow: title your quiz, then build up to 10 questions.
          </p>

          <label className="input-label" htmlFor="quiz-title">Quiz Name</label>
          <input
            id="quiz-title"
            className="text-input create-wizard-input"
            value={quizTitle}
            onChange={(event) => {
              setQuizTitle(event.target.value);
              if (quizTitleError && event.target.value.trim()) {
                setQuizTitleError("");
              }
              setQuizValidationMessage(null);
            }}
            placeholder="Ex: Steelers Pregame Trivia"
          />
          {quizTitleError ? <p className="create-wizard-error">{quizTitleError}</p> : null}
          {quizValidationMessage ? (
            <p className="create-wizard-error">{quizValidationMessage}</p>
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
                  className={`create-wizard-quiz-chip ${active ? "active" : ""} ${hasError ? "error" : ""}`}
                  onClick={() => setCurrentQuizQuestionIndex(index)}
                >
                  <span>Q{index + 1}</span>
                  {hasError ? <span className="create-wizard-quiz-chip-status">!</span> : null}
                  {!hasError && complete ? (
                    <span className="create-wizard-quiz-chip-status">✓</span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="create-wizard-inline-actions create-wizard-quiz-actions">
            {quizQuestions.length > 1 ? (
              <button
                type="button"
                className="secondary-button"
                onClick={handleDeleteCurrentQuizQuestion}
              >
                Delete question
              </button>
            ) : null}
            <button
              type="button"
              className="secondary-button"
              disabled={quizQuestions.length >= MAX_QUIZ_QUESTIONS}
              onClick={handleAddQuizQuestion}
            >
              Add question
            </button>
          </div>

          <div className="create-wizard-quiz-type-toggle">
            <button
              type="button"
              className={`secondary-button ${currentQuizQuestion.type === "multiple" ? "active" : ""}`}
              onClick={() => setQuizQuestionType("multiple")}
            >
              Multiple Choice
            </button>
            <button
              type="button"
              className={`secondary-button ${currentQuizQuestion.type === "truefalse" ? "active" : ""}`}
              onClick={() => setQuizQuestionType("truefalse")}
            >
              True / False
            </button>
          </div>

          <label className="input-label" htmlFor="quiz-question-text">Question Text</label>
          <textarea
            id="quiz-question-text"
            className="text-input create-wizard-input create-wizard-textarea"
            value={currentQuizQuestion.questionText}
            onChange={(event) => updateQuizQuestionText(event.target.value)}
            placeholder="Ask something fun..."
          />
          {currentQuizErrors.questionText ? (
            <p className="create-wizard-error">{currentQuizErrors.questionText}</p>
          ) : null}

          <p className="input-label create-wizard-choice-label">Choices</p>
          <div className="create-wizard-choice-grid">
            {currentQuizQuestion.choices.map((choice) => (
              <div key={choice.id} className="create-wizard-choice-row create-wizard-quiz-choice-row">
                <button
                  type="button"
                  className={`create-wizard-choice-radio ${currentQuizQuestion.correctChoiceId === choice.id ? "active" : ""}`}
                  onClick={() => setQuizCorrectChoice(choice.id)}
                >
                  {currentQuizQuestion.type === "truefalse"
                    ? choice.text.charAt(0).toUpperCase()
                    : choice.id.toUpperCase()}
                </button>
                <input
                  className="text-input create-wizard-input"
                  value={choice.text}
                  onChange={(event) => {
                    updateQuizChoiceText(choice.id, event.target.value);
                  }}
                  placeholder={`Choice ${choice.id.toUpperCase()}`}
                  disabled={currentQuizQuestion.type === "truefalse"}
                />
              </div>
            ))}
          </div>
          {currentQuizErrors.correctChoiceId ? (
            <p className="create-wizard-error">{currentQuizErrors.correctChoiceId}</p>
          ) : null}
          {currentQuizErrors.choices
            ? Object.entries(currentQuizErrors.choices).map(([choiceId, message]) => (
                <p key={`${choiceId}-${message}`} className="create-wizard-error">
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

          <div className="create-wizard-inline-actions create-wizard-review-jump">
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                if (!validateStep(3)) return;
                setStepIndex(4);
              }}
            >
              Review and Save
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );

  const renderStepReview = () => {
    const start = toStartDateTime(eventDate, eventTime);
    const end = toEndDateTime(eventDate, eventTime, eventEndTime);
    const invitedGuestNames = guests.map((guest, index) => {
      const trimmedName = guest.name.trim();
      return trimmedName.length > 0 ? trimmedName : `Guest ${index + 1}`;
    });
    const formattedStart = start
      ? start.toLocaleString([], { dateStyle: "short", timeStyle: "short" })
      : "Not set";
    const formattedEnd = end
      ? end.toLocaleString([], { dateStyle: "short", timeStyle: "short" })
      : "Not set";
    const enabledExpectations = expectationOptions
      .filter((option) => expectations[option.key])
      .map((option) => option.label);
    const guestPlusSummary =
      visibilityType === "private"
        ? allowGuestPlusOnInvite
          ? `Enabled | Up to ${parseGuestPlusLimit(maxAdditionalGuestsPerInvite) ?? 1} additional guest${
              (parseGuestPlusLimit(maxAdditionalGuestsPerInvite) ?? 1) === 1 ? "" : "s"
            } per invite`
          : "Disabled"
        : "Not applicable";
    const ticketSummary =
      visibilityType === "open_paid"
        ? `Paid | $${((ticketPriceCents ?? 0) / 100).toFixed(2)} | Fee ${hostPlatformFeePercent}%${
            capacityInput.trim() ? ` | Cap ${capacityInput}` : ""
          } | Sales stop ${parseTicketSalesCutoffDays(ticketSalesCutoffDaysInput) ?? 0}d before`
        : visibilityType === "open_free"
        ? "Open (Free)"
        : "Invite Only";

    return (
      <section className="create-wizard-stack">
        <div className="create-wizard-card">
          <div className="create-wizard-card-header">
            <h2>Step 5: Review and Create</h2>
          </div>

          <dl className="create-wizard-review-grid">
            <div>
              <dt>Event Name</dt>
              <dd>{eventName || "Not set"}</dd>
            </div>
            <div>
              <dt>Description</dt>
              <dd>{eventDescription || "Not set"}</dd>
            </div>
            <div>
              <dt>Start</dt>
              <dd>{formattedStart}</dd>
            </div>
            <div>
              <dt>End</dt>
              <dd>{formattedEnd}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{locationSummary || "Not set"}</dd>
            </div>
            <div>
              <dt>Tailgate Type</dt>
              <dd>{selectedVisibility?.label ?? "Invite Only"}</dd>
            </div>
            <div>
              <dt>Tickets</dt>
              <dd>{ticketSummary}</dd>
            </div>
            {guestInvitesEnabled ? (
              <div>
                <dt>Invited Guests</dt>
                <dd>
                  {guests.length > 0 ? (
                    <span className="create-wizard-guest-tooltip" tabIndex={0}>
                      <span className="create-wizard-guest-tooltip-count">{guests.length}</span>
                      <span className="create-wizard-guest-tooltip-hint">Hover to view</span>
                      <span className="create-wizard-guest-tooltip-popover" role="tooltip">
                        <strong>Invitees</strong>
                        {invitedGuestNames.map((name, index) => (
                          <span className="create-wizard-guest-tooltip-name" key={`${name}-${index}`}>
                            {name}
                          </span>
                        ))}
                      </span>
                    </span>
                  ) : (
                    "0"
                  )}
                </dd>
              </div>
            ) : null}
            {guestInvitesEnabled ? (
              <div>
                <dt>Guest Plus</dt>
                <dd>{guestPlusSummary}</dd>
              </div>
            ) : null}
            <div>
              <dt>Expectations</dt>
              <dd>
                {enabledExpectations.length > 0 ? enabledExpectations.join(", ") : "None selected"}
              </dd>
            </div>
            {quizCreationAllowed ? (
              <div>
                <dt>Quiz</dt>
                <dd>
                  {quizEnabled
                    ? quizTitle.trim()
                      ? `${quizTitle.trim()} (${filledQuizQuestions.length} questions)`
                      : `${filledQuizQuestions.length} questions`
                    : "Not added"}
                </dd>
              </div>
            ) : null}
            <div>
              <dt>Timeline Steps</dt>
              <dd>{timelineEnabled ? timelineSteps.length : "Not added"}</dd>
            </div>
            <div>
              <dt>Cover Photos</dt>
              <dd>
                {coverImageDrafts.length > 0
                  ? `${coverImageDrafts.length} selected`
                  : "None selected"}
              </dd>
            </div>
          </dl>
        </div>

        {visibilityType === "open_paid" ? renderPaidTicketSummaryCard() : null}

        <div className="create-wizard-card create-wizard-map-card">
          <div className="create-wizard-card-header">
            <h2>Map Preview</h2>
          </div>
          {mapUrl ? (
            <iframe
              title="Tailgate location review map"
              className="create-wizard-map-iframe"
              src={mapUrl}
            />
          ) : (
            <div className="create-wizard-map-placeholder">No map preview available yet.</div>
          )}
        </div>
      </section>
    );
  };

  return (
    <AppShell
      header={
        <div className="create-wizard-shell-header">
          <h1>Create Tailgate Event</h1>
          <p>Set the vibe, lock in your lot, and build a game-day setup guests will remember.</p>
        </div>
      }
    >
      <section className="create-wizard-page">
        <div className="create-wizard-progress-shell">
          <div className="create-wizard-progress-header">
            <p>{stepSubtitle}</p>
            <span>{progressLabel}</span>
          </div>
          <div className="create-wizard-progress-bars" role="progressbar" aria-valuemin={1} aria-valuemax={wizardSteps.length} aria-valuenow={stepIndex + 1}>
            {wizardSteps.map((step, index) => (
              <div
                key={step.key}
                className={`create-wizard-progress-segment ${index <= stepIndex ? "active" : ""}`}
              />
            ))}
          </div>
        </div>

        <div className="create-wizard-body">
          {stepIndex === 0 ? renderStepType() : null}
          {stepIndex === 1 ? renderStepDetails() : null}
          {stepIndex === 2 ? renderStepLocation() : null}
          {stepIndex === 3 ? renderStepInvite() : null}
          {stepIndex === 4 ? renderStepReview() : null}
        </div>

        {errors.submit ? <p className="create-wizard-error global">{errors.submit}</p> : null}
        {successMessage ? <p className="create-wizard-success">{successMessage}</p> : null}

        <div className="create-wizard-footer">
          <button
            type="button"
            className="secondary-button"
            disabled={stepIndex === 0 || saving}
            onClick={handleBack}
          >
            Back
          </button>
          {stepIndex < wizardSteps.length - 1 ? (
            <button type="button" className="primary-button" onClick={() => void handleNext()}>
              {stepIndex === 0
                ? "Next: Event Details"
                : stepIndex === 1
                ? "Next: Event Location"
                : stepIndex === 2
                ? guestInvitesEnabled
                  ? "Next: Invite + Add-ons"
                  : "Next: Optional Add-ons"
                : "Next: Review and Create"}
            </button>
          ) : (
            <button
              type="button"
              className="primary-button"
              disabled={saving}
              onClick={() => void handleCreateTailgate()}
            >
              {saving ? "Creating..." : "Create"}
            </button>
          )}
        </div>
      </section>

      {contactModalOpen && guestInvitesEnabled ? (
        <div className="create-wizard-modal-overlay" role="dialog" aria-modal="true">
          <div className="create-wizard-modal">
            <div className="create-wizard-modal-header">
              <h3>Add Guests</h3>
              <button
                type="button"
                className="link-button"
                onClick={() => setContactModalOpen(false)}
              >
                Close
              </button>
            </div>
            <input
              className="text-input create-wizard-input"
              placeholder="Search contacts..."
              value={contactSearch}
              onChange={(event) => setContactSearch(event.target.value)}
            />
            <div className="create-wizard-contact-list">
              {filteredContacts.map((contact) => {
                const selected = selectedContactIds.includes(contact.id);
                return (
                  <button
                    key={contact.id}
                    type="button"
                    className={`create-wizard-contact-row ${selected ? "selected" : ""}`}
                    onClick={() => toggleContactSelection(contact.id)}
                  >
                    <div>
                      <p>{contact.name}</p>
                      <span>{contact.phone}</span>
                    </div>
                    <span className="create-wizard-contact-check">{selected ? "✓" : ""}</span>
                  </button>
                );
              })}
            </div>
            <button type="button" className="primary-button" onClick={applySelectedContacts}>
              Okay
            </button>
          </div>
        </div>
      ) : null}

      {paidFeeModalOpen ? (
        <div className="create-wizard-modal-overlay" role="dialog" aria-modal="true">
          <div className="create-wizard-modal create-wizard-payout-modal">
            <div className="create-wizard-modal-header">
              <h3>Paid tailgates include a platform fee</h3>
              <button
                type="button"
                className="link-button"
                onClick={() => setPaidFeeModalOpen(false)}
              >
                Close
              </button>
            </div>
            {hostPlatformFeePercent < STANDARD_PLATFORM_FEE_PERCENT ? (
              <>
                <div className="create-wizard-promo-celebration-card">
                  <p className="create-wizard-promo-celebration-eyebrow">
                    Early adopter unlocked
                  </p>
                  <h4 className="create-wizard-promo-celebration-title">
                    Thanks for building TailgateTime with us.
                  </h4>
                  <p className="create-wizard-promo-celebration-body">
                    Your paid-event fee is currently {hostPlatformFeePercent}%.
                  </p>
                  {hostPromoEndsLabel ? (
                    <p className="create-wizard-promo-celebration-meta">
                      Locked in through {hostPromoEndsLabel}.
                    </p>
                  ) : null}
                </div>
                <p className="create-wizard-payout-copy">
                  You are currently on the early-adopter rate for paid events.
                </p>
                <p className="create-wizard-payout-status">
                  Standard host fee is {STANDARD_PLATFORM_FEE_PERCENT}%.
                </p>
              </>
            ) : (
              <>
                <p className="create-wizard-payout-copy">
                  TailgateTime charges a {STANDARD_PLATFORM_FEE_PERCENT}% platform fee on ticket
                  sales for paid events.
                </p>
                <p className="create-wizard-payout-status">
                  Your current fee for paid tailgates is {hostPlatformFeePercent}%.
                </p>
              </>
            )}
            <p className="create-wizard-payout-copy">
              That TailgateTime fee includes transaction processing, payout handling, and payment
              support, so there are no separate processing charges shown to hosts here.
            </p>
            <p className="create-wizard-payout-copy">
              Early-adopter promo: hosts who sell at least {EARLY_ADOPTER_MIN_TICKETS_SOLD} tickets
              for a qualifying event before {PROMO_CUTOFF_DISPLAY} drop to{" "}
              {EARLY_ADOPTER_PLATFORM_FEE_PERCENT}% immediately, and that rate lasts through one
              year after the qualifying event date.
            </p>
            {paidTicketEstimate ? (
              <div className="create-wizard-fee-grid create-wizard-fee-grid-modal">
                <div>
                  <span>Ticket price</span>
                  <strong>{formatUsdFromCents(ticketPriceCents ?? 0)}</strong>
                </div>
                <div>
                  <span>TailgateTime fee est.</span>
                  <strong>{formatUsdFromCents(paidTicketEstimate.totalFee)}</strong>
                </div>
                <div>
                  <span>Host gets est.</span>
                  <strong>{formatUsdFromCents(paidTicketEstimate.payout)}</strong>
                </div>
              </div>
            ) : (
              <p className="create-wizard-fee-empty">
                Enter a ticket price after continuing to preview the full fee breakdown.
              </p>
            )}
            <div className="create-wizard-payout-actions">
              <button type="button" className="primary-button" onClick={acknowledgePaidFee}>
                I understand, continue
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setPaidFeeModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {payoutModalOpen ? (
        <div className="create-wizard-modal-overlay" role="dialog" aria-modal="true">
          <div className="create-wizard-modal create-wizard-payout-modal">
            <div className="create-wizard-modal-header">
              <h3>Set up payouts for paid tailgates</h3>
              <button
                type="button"
                className="link-button"
                onClick={() => setPayoutModalOpen(false)}
                disabled={payoutSetupLoading}
              >
                Close
              </button>
            </div>
            <p className="create-wizard-payout-copy">
              Finish payout setup so you can charge for entry and receive payouts.
            </p>
            <p className="create-wizard-payout-status">
              Current status: {connectStatus.replace("_", " ")}
            </p>
            {payoutSetupError ? (
              <p className="create-wizard-error global">{payoutSetupError}</p>
            ) : null}
            <div className="create-wizard-payout-actions">
              <button
                type="button"
                className="primary-button"
                onClick={() => void handlePayoutSetup()}
                disabled={payoutSetupLoading}
              >
                {payoutSetupLoading ? "Opening payout setup..." : "Set up payouts"}
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setPayoutModalOpen(false)}
                disabled={payoutSetupLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}

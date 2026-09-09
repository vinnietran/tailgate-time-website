import { httpsCallable } from "firebase/functions";
import { functions, trackCustomEvent } from "./firebase";

export type PaidTailgateAnalyticsEventName =
  | "paid_tailgate_impression"
  | "paid_tailgate_view"
  | "ticket_type_selected"
  | "checkout_started"
  | "purchase_completed";

export type PaidTailgateAnalyticsSource =
  | "discover"
  | "search"
  | "map"
  | "host_page"
  | "game_page"
  | "direct_link"
  | "instagram"
  | "facebook"
  | "google"
  | "email"
  | "push_notification"
  | "other";

type PaidTailgateAnalyticsParams = {
  tailgateId: string;
  hostId?: string;
  ticketTypeId?: string;
  gameId?: string;
  source?: PaidTailgateAnalyticsSource;
  campaign?: string;
  medium?: string;
  platform?: string;
  price?: number;
  quantity?: number;
  purchaseId?: string;
  dedupeKey?: string;
};

const SOURCES = new Set<PaidTailgateAnalyticsSource>([
  "discover",
  "search",
  "map",
  "host_page",
  "game_page",
  "direct_link",
  "instagram",
  "facebook",
  "google",
  "email",
  "push_notification",
  "other"
]);
const ATTRIBUTION_KEY = "tt_paid_tailgate_attribution";
const VISITOR_KEY = "tt_paid_tailgate_visitor";
const EVENT_DEDUPE_PREFIX = "tt_paid_tailgate_event:";

function normalizeSource(value: string | null | undefined): PaidTailgateAnalyticsSource | null {
  const normalized = (value ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (SOURCES.has(normalized as PaidTailgateAnalyticsSource)) {
    return normalized as PaidTailgateAnalyticsSource;
  }
  if (normalized.includes("instagram")) return "instagram";
  if (normalized.includes("facebook") || normalized === "fb") return "facebook";
  if (normalized.includes("google")) return "google";
  if (normalized.includes("email") || normalized.includes("newsletter")) return "email";
  if (normalized.includes("push")) return "push_notification";
  return null;
}

function readStoredAttribution() {
  if (typeof window === "undefined") return null;
  try {
    const value = JSON.parse(window.sessionStorage.getItem(ATTRIBUTION_KEY) ?? "null") as unknown;
    return value && typeof value === "object"
      ? (value as { source?: PaidTailgateAnalyticsSource; campaign?: string; medium?: string })
      : null;
  } catch {
    return null;
  }
}

export function capturePaidTailgateAttribution(search?: string) {
  if (typeof window === "undefined") {
    return { source: "other" as const, campaign: "", medium: "" };
  }
  const params = new URLSearchParams(search ?? window.location.search);
  const utmSource = normalizeSource(params.get("utm_source"));
  const explicitSource = normalizeSource(params.get("source"));
  let referrerSource: PaidTailgateAnalyticsSource | null = null;
  if (document.referrer) {
    try {
      const referrer = new URL(document.referrer);
      if (referrer.origin !== window.location.origin) {
        referrerSource = normalizeSource(referrer.hostname) ?? "other";
      }
    } catch {
      referrerSource = null;
    }
  }
  const existing = readStoredAttribution();
  const attribution = {
    source: explicitSource ?? utmSource ?? referrerSource ?? existing?.source ?? "direct_link",
    campaign: (params.get("utm_campaign") ?? existing?.campaign ?? "").slice(0, 160),
    medium: (params.get("utm_medium") ?? existing?.medium ?? "").slice(0, 80)
  };
  try {
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
  } catch {
    // Attribution storage is best-effort and must never block the customer flow.
  }
  return attribution;
}

function getVisitorId() {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const value = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(VISITOR_KEY, value);
    return value;
  } catch {
    return "";
  }
}

function shouldSkipDuplicate(key?: string) {
  if (!key || typeof window === "undefined") return false;
  try {
    const storageKey = `${EVENT_DEDUPE_PREFIX}${key}`;
    if (window.sessionStorage.getItem(storageKey)) return true;
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    return false;
  }
  return false;
}

export function trackPaidTailgateEvent(
  eventName: PaidTailgateAnalyticsEventName,
  params: PaidTailgateAnalyticsParams
) {
  if (!params.tailgateId || shouldSkipDuplicate(params.dedupeKey)) return;
  const attribution = capturePaidTailgateAttribution();
  const payload = {
    tailgateId: params.tailgateId,
    hostId: params.hostId,
    ticketTypeId: params.ticketTypeId,
    gameId: params.gameId,
    source: params.source ?? attribution.source,
    campaign: params.campaign ?? attribution.campaign,
    medium: params.medium ?? attribution.medium,
    platform: params.platform ?? "web",
    price: params.price,
    quantity: params.quantity,
    purchaseId: params.purchaseId,
    visitorId: getVisitorId()
  };

  try {
    trackCustomEvent(eventName, payload);
  } catch (error) {
    console.warn("Firebase analytics event failed", { eventName, error });
  }

  if (!functions) return;
  try {
    const recordEvent = httpsCallable(functions, "recordPaidTailgateAnalyticsEvent");
    void recordEvent({ eventName, ...payload }).catch((error) => {
      console.warn("Paid tailgate reporting event failed", { eventName, error });
    });
  } catch (error) {
    console.warn("Paid tailgate reporting is unavailable", { eventName, error });
  }
}

export function trackPaidTailgateImpressions(
  tailgates: Array<{ id: string; hostId?: string; visibilityType: string }>,
  source: PaidTailgateAnalyticsSource
) {
  tailgates.forEach((tailgate) => {
    if (tailgate.visibilityType !== "open_paid") return;
    trackPaidTailgateEvent("paid_tailgate_impression", {
      tailgateId: tailgate.id,
      hostId: tailgate.hostId,
      source,
      dedupeKey: `impression:${source}:${tailgate.id}`
    });
  });
}

export function paidTailgateLink(tailgateId: string, source: PaidTailgateAnalyticsSource) {
  const params = new URLSearchParams({ source });
  const attribution = readStoredAttribution();
  if (attribution?.campaign) params.set("utm_campaign", attribution.campaign);
  if (attribution?.medium) params.set("utm_medium", attribution.medium);
  return `/tailgates/${encodeURIComponent(tailgateId)}?${params.toString()}`;
}

import type { VisibilityType } from "../../types";

export type PromotionChannel =
  | "host_copy_link"
  | "host_native_share"
  | "host_qr";

export type PromotionEvent = {
  id: string;
  name: string;
  hostId: string;
  hostName: string;
  coHostIds: string[];
  visibilityType: VisibilityType;
  startDateTime: Date | null;
  endDateTime: Date | null;
  locationSummary: string;
  coverImageUrl?: string;
};

export function isPromotionEligible(visibilityType: VisibilityType) {
  return visibilityType === "open_free" || visibilityType === "open_paid";
}

export function buildPromotionUrl(
  eventId: string,
  channel: PromotionChannel,
  origin = typeof window === "undefined" ? "" : window.location.origin
) {
  const path = `/tailgates/${encodeURIComponent(eventId)}`;
  const params = new URLSearchParams({
    source: "host_share",
    utm_medium: "host_promotion",
    utm_campaign: channel
  });
  return `${origin}${path}?${params.toString()}`;
}

export function buildShareText(event: PromotionEvent) {
  return event.visibilityType === "open_paid"
    ? `Join us at ${event.name}. Get tickets and event details here:`
    : `Join us at ${event.name}. See the event details here:`;
}

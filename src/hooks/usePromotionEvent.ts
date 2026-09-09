import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { mockTailgates } from "../data/mockTailgates";
import type { PromotionEvent } from "../features/promotion/promotion";
import type { VisibilityType } from "../types";
import { resolveLocationLabel } from "../utils/location";

function firstString(...values: unknown[]) {
  return values.find((value): value is string => typeof value === "string" && value.trim() !== "")?.trim();
}

function normalizeDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const timestamp = value as { toDate?: () => Date };
  return timestamp.toDate ? timestamp.toDate() : null;
}

function normalizeVisibility(value: unknown): VisibilityType {
  return value === "open_free" || value === "open_paid" ? value : "private";
}

function normalizeEvent(id: string, data: Record<string, unknown>): PromotionEvent {
  const location = resolveLocationLabel(data.location);
  const cover = data.cover as Record<string, unknown> | undefined;
  const media = data.media as Record<string, unknown> | undefined;
  return {
    id,
    name: firstString(data.eventName, data.name, data.title) ?? "Untitled Tailgate",
    hostId: firstString(data.hostId, data.hostUserId, data.ownerId) ?? "",
    hostName: firstString(data.hostName, data.displayName) ?? "TailgateTime Host",
    coHostIds: Array.isArray(data.coHostIds)
      ? data.coHostIds.filter((value): value is string => typeof value === "string")
      : [],
    visibilityType: normalizeVisibility(data.visibilityType),
    startDateTime: normalizeDate(data.startDateTime ?? data.dateTime ?? data.eventTargetTime),
    endDateTime: normalizeDate(data.endDateTime ?? data.endAt),
    locationSummary: firstString(data.locationSummary, location) ?? "Location to be announced",
    coverImageUrl: firstString(
      data.coverImageUrl,
      data.coverPhotoUrl,
      data.imageUrl,
      cover?.url,
      cover?.imageUrl,
      media?.coverImageUrl
    )
  };
}

export function usePromotionEvent(eventId?: string, fallback?: PromotionEvent | null) {
  const [event, setEvent] = useState<PromotionEvent | null>(fallback ?? null);
  const [loading, setLoading] = useState(!fallback);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      setError("Tailgate not found.");
      return;
    }
    if (!db) {
      const mock = mockTailgates.find((item) => item.id === eventId);
      if (mock) {
        setEvent({
          id: mock.id,
          name: mock.name,
          hostId: mock.hostUserId,
          hostName: "TailgateTime Host",
          coHostIds: [],
          visibilityType: mock.visibilityType,
          startDateTime: mock.startDateTime,
          endDateTime: mock.endDateTime ?? null,
          locationSummary: mock.locationSummary ?? "Location to be announced",
          coverImageUrl: mock.coverImageUrl
        });
      } else if (!fallback) {
        setError("Tailgate not found.");
      }
      setLoading(false);
      return;
    }

    setLoading(!fallback);
    return onSnapshot(
      doc(db, "tailgateEvents", eventId),
      (snapshot) => {
        if (!snapshot.exists()) {
          if (!fallback) setError("Tailgate not found.");
          setLoading(false);
          return;
        }
        setEvent(normalizeEvent(snapshot.id, snapshot.data() as Record<string, unknown>));
        setError(null);
        setLoading(false);
      },
      (snapshotError) => {
        console.error("Failed to load promotion event", snapshotError);
        if (!fallback) setError("We couldn't load this tailgate. Try again.");
        setLoading(false);
      }
    );
  }, [eventId, fallback]);

  return { event, loading, error };
}

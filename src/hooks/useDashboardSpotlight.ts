import { useEffect, useMemo, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import createWizardDetailsImage from "../../screenshots/create_wizard_details.png";
import createWizardLocationImage from "../../screenshots/create_wizard_location.png";
import { db } from "../lib/firebase";

export type DashboardSpotlightArt = "map" | "host" | "partner" | "image";
export type DashboardSpotlightCtaType = "route" | "external_url" | "none";

export type DashboardSpotlightCard = {
  id: string;
  badge?: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaType: DashboardSpotlightCtaType;
  ctaTarget?: string;
  imageSrc?: string;
  art: DashboardSpotlightArt;
  order: number;
};

const DEFAULT_SPOTLIGHT_CARDS: DashboardSpotlightCard[] = [
  {
    id: "discover",
    title: "Find open tailgates nearby",
    description: "Explore public events around your game day location and jump in with a few taps.",
    ctaLabel: "Discover now",
    ctaType: "route",
    ctaTarget: "/discover",
    imageSrc: createWizardLocationImage,
    art: "map",
    order: 0
  },
  {
    id: "host",
    title: "Host your own tailgate",
    description: "Create your event in minutes, invite your crew, and manage the full experience.",
    ctaLabel: "Start hosting",
    ctaType: "route",
    ctaTarget: "/tailgates/new",
    imageSrc: createWizardDetailsImage,
    art: "host",
    order: 1
  },
  {
    id: "sponsor",
    badge: "Sponsored",
    title: "Game day partner spotlight",
    description: "Feature sponsors and local offers right on the dashboard home experience.",
    ctaType: "none",
    art: "partner",
    order: 2
  }
];

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function asTrimmedString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function asBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function resolveTimestampMs(value: unknown): number | null {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value.getTime();
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
  }

  const timestamp = value as {
    toMillis?: () => number;
    toDate?: () => Date;
    seconds?: number;
  };
  if (typeof timestamp.toMillis === "function") return timestamp.toMillis();
  if (typeof timestamp.toDate === "function") return timestamp.toDate().getTime();
  if (typeof timestamp.seconds === "number") return timestamp.seconds * 1000;
  return null;
}

function normalizeCard(
  rawValue: unknown,
  index: number,
  nowMs: number
): DashboardSpotlightCard | null {
  const raw = asRecord(rawValue);
  if (!raw) return null;
  if (asBoolean(raw.active) === false) return null;

  const startsAtMs = resolveTimestampMs(raw.startsAt);
  if (startsAtMs !== null && nowMs < startsAtMs) return null;
  const endsAtMs = resolveTimestampMs(raw.endsAt);
  if (endsAtMs !== null && nowMs > endsAtMs) return null;

  const title = asTrimmedString(raw.title);
  const description = asTrimmedString(raw.description);
  if (!title || !description) return null;

  const artRaw = asTrimmedString(raw.artType);
  const art: DashboardSpotlightArt =
    artRaw === "map" || artRaw === "host" || artRaw === "partner" || artRaw === "image"
      ? artRaw
      : "image";

  const imageUrl = asTrimmedString(raw.imageUrl) ?? undefined;
  if (art === "image" && !imageUrl) {
    return null;
  }

  const ctaTypeRaw = asTrimmedString(raw.ctaType);
  const ctaType: DashboardSpotlightCtaType =
    ctaTypeRaw === "route" || ctaTypeRaw === "external_url" || ctaTypeRaw === "none"
      ? ctaTypeRaw
      : "none";

  return {
    id: asTrimmedString(raw.id) ?? `spotlight-${index}`,
    badge: asTrimmedString(raw.badge) ?? undefined,
    title,
    description,
    ctaLabel: asTrimmedString(raw.ctaLabel) ?? undefined,
    ctaType,
    ctaTarget: asTrimmedString(raw.ctaTarget) ?? undefined,
    imageSrc: imageUrl,
    art,
    order: asNumber(raw.order) ?? index
  };
}

function normalizeDashboardSpotlightCards(
  rawDoc: Record<string, unknown> | null,
  nowMs = Date.now()
) {
  const rawCards = Array.isArray(rawDoc?.cards) ? rawDoc.cards : [];
  const normalized = rawCards
    .map((card, index) => normalizeCard(card, index, nowMs))
    .filter((card): card is DashboardSpotlightCard => Boolean(card))
    .sort((left, right) => left.order - right.order);

  return normalized.length > 0 ? normalized : DEFAULT_SPOTLIGHT_CARDS;
}

export function useDashboardSpotlight() {
  const [rawDoc, setRawDoc] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setRawDoc(null);
      setError(null);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "appContent", "dashboardSpotlight"),
      (snapshot) => {
        setRawDoc(snapshot.exists() ? (snapshot.data() as Record<string, unknown>) : null);
        setError(null);
      },
      (snapshotError) => {
        console.error("Failed loading dashboard spotlight", snapshotError);
        setRawDoc(null);
        setError("Unable to load spotlight content right now.");
      }
    );

    return () => unsubscribe();
  }, []);

  const cards = useMemo(() => normalizeDashboardSpotlightCards(rawDoc), [rawDoc]);

  return { cards, error };
}


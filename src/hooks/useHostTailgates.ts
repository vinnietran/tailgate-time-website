import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { TailgateEvent } from "../types";
import { mockTailgates } from "../data/mockTailgates";
import { debugAuthLog } from "../utils/debug";
import { resolveLocationLabel } from "../utils/location";

function coerceNumber(value: unknown) {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return undefined;
}

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function normalizeDate(value: unknown) {
  if (!value) return new Date(0);
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  const maybeTimestamp = value as { toDate?: () => Date };
  if (maybeTimestamp?.toDate) {
    return maybeTimestamp.toDate();
  }

  return new Date(0);
}

function pickDate(data: Record<string, unknown>) {
  const candidates: unknown[] = [
    data.dateTime,
    data.eventTargetTime,
    data.startDateTime,
    data.startTime,
    data.startAt,
    data.eventStartAt,
    data.eventDateTime,
    data.tailgateStartAt,
    data.kickoffAt,
    data.kickoffTime,
    data.eventDate,
    data.date,
    data.createdAt
  ];

  for (const candidate of candidates) {
    const normalized = normalizeDate(candidate);
    if (normalized.getTime() > 0) return normalized;
  }

  return new Date(0);
}

function pickEndDate(data: Record<string, unknown>) {
  const candidates: unknown[] = [
    data.endDateTime,
    data.endAt,
    data.eventEndAt,
    data.tailgateEndAt
  ];

  for (const candidate of candidates) {
    const normalized = normalizeDate(candidate);
    if (normalized.getTime() > 0) return normalized;
  }

  return undefined;
}

function deriveVisibilityType(data: Record<string, unknown>): TailgateEvent["visibilityType"] {
  const raw = String(data.visibilityType ?? "").toLowerCase();
  if (raw === "private" || raw === "open_free" || raw === "open_paid") {
    return raw;
  }

  if (data.isPrivate === true || String(data.accessType ?? "").toLowerCase() === "invite_only") {
    return "private";
  }

  const price =
    coerceNumber(data.ticketPriceCents) ??
    coerceNumber(data.priceCents) ??
    coerceNumber(data.ticketPrice);

  if ((price ?? 0) > 0) return "open_paid";
  return "open_free";
}

function deriveLocationSummary(data: Record<string, unknown>) {
  const combined = resolveLocationLabel(data.location);
  if (combined) return combined;

  const direct = firstString(
    data.locationSummary,
    data.location,
    data.venueName,
    data.address,
    data.displayAddress,
    data.locationLabel
  );
  if (direct) return direct;

  const location = data.location as Record<string, unknown> | undefined;
  if (!location || typeof location !== "object") return undefined;

  return firstString(
    location.label,
    location.displayAddress,
    location.address,
    location.formattedAddress,
    location.formatted,
    location.description,
    location.text,
    location.name,
    location.mainText,
    location.shortAddress,
    location.secondaryText,
    location.lotName,
    location.venueName
  );
}

function deriveStatus(data: Record<string, unknown>) {
  const raw = String(data.status ?? data.eventStatus ?? "").toLowerCase();
  if (!raw) return undefined;
  if (raw === "cancelled" || raw === "canceled" || raw.startsWith("cancel")) {
    return "cancelled";
  }
  if (raw === "completed") return "past";
  if (raw === "paid") return "past";
  return raw;
}

function isCancelledStatus(status: unknown) {
  const raw = firstString(status)?.toLowerCase() ?? "";
  return raw === "cancelled" || raw === "canceled" || raw.startsWith("cancel");
}

const PAYOUT_SENT_STATUSES = new Set([
  "sent",
  "paid",
  "completed",
  "succeeded",
  "success"
]);

function isTrueFlag(value: unknown) {
  if (value === true) return true;
  if (value === 1) return true;
  if (typeof value !== "string") return false;
  const raw = value.trim().toLowerCase();
  return raw === "true" || raw === "1" || raw === "yes";
}

function hasValidDate(value: unknown) {
  return normalizeDate(value).getTime() > 0;
}

function derivePayoutStatus(data: Record<string, unknown>): TailgateEvent["payoutStatus"] {
  const payouts = asRecord(data.payouts);
  const payout = asRecord(data.payout);
  const statusCandidates = [
    firstString(data.payoutStatus),
    firstString(data.stripePayoutStatus),
    firstString(data.transferStatus),
    firstString(payouts?.status),
    firstString(payout?.status)
  ];

  for (const status of statusCandidates) {
    if (status && PAYOUT_SENT_STATUSES.has(status.toLowerCase())) {
      return "sent";
    }
  }

  const dateCandidates = [
    data.payoutSentAt,
    data.lastPayoutAt,
    data.paidOutAt,
    data.payoutCompletedAt,
    data.payoutDate,
    payouts?.sentAt,
    payouts?.paidAt,
    payout?.sentAt,
    payout?.paidAt
  ];
  if (dateCandidates.some(hasValidDate)) {
    return "sent";
  }

  const flagCandidates = [
    data.payoutSent,
    data.isPaidOut,
    payouts?.sent,
    payouts?.paid,
    payout?.sent,
    payout?.paid
  ];
  if (flagCandidates.some(isTrueFlag)) {
    return "sent";
  }

  return "pending";
}

function normalizeTailgate(id: string, data: Record<string, unknown>): TailgateEvent {
  const capacity =
    coerceNumber(data.capacity) ??
    coerceNumber(data.maxGuests) ??
    coerceNumber(data.ticketCapacity);
  const ticketsSold =
    coerceNumber(data.confirmedPaidCount) ??
    coerceNumber(data.ticketsSold) ??
    coerceNumber(data.soldCount) ??
    coerceNumber(data.ticketsPurchased) ??
    coerceNumber(data.paidAttendees) ??
    coerceNumber(data.rsvpsConfirmed) ??
    0;
  const rsvpsConfirmed =
    coerceNumber(data.rsvpsConfirmed) ??
    coerceNumber(data.confirmedCount) ??
    coerceNumber(data.rsvpConfirmedCount) ??
    coerceNumber(data.attendeeCount) ??
    0;
  const rsvpsPending =
    coerceNumber(data.rsvpsPending) ??
    coerceNumber(data.pendingCount) ??
    coerceNumber(data.rsvpPendingCount) ??
    0;

  return {
    id,
    hostUserId: String(
      data.hostUserId ?? data.hostId ?? data.ownerId ?? data.createdByUid ?? ""
    ),
    name: firstString(data.name, data.eventName, data.title) ?? "Untitled Tailgate",
    visibilityType: deriveVisibilityType(data),
    startDateTime: pickDate(data),
    endDateTime: pickEndDate(data),
    locationSummary: deriveLocationSummary(data),
    capacity,
    ticketPriceCents:
      coerceNumber(data.ticketPriceCents) ??
      coerceNumber(data.priceCents) ??
      coerceNumber(data.ticketPrice),
    ticketsSold,
    rsvpsConfirmed,
    rsvpsPending,
    status: deriveStatus(data),
    payoutStatus: derivePayoutStatus(data)
  };
}

function mergeAndSortTailgates(groups: TailgateEvent[][]) {
  const map = new Map<string, TailgateEvent>();
  groups.flat().forEach((tailgate) => {
    map.set(tailgate.id, tailgate);
  });

  return Array.from(map.values()).sort(
    (a, b) => b.startDateTime.getTime() - a.startDateTime.getTime()
  );
}

export function useHostTailgates(hostUserId?: string) {
  const [tailgates, setTailgates] = useState<TailgateEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hostUserId) {
      setTailgates([]);
      setLoading(false);
      setError(null);
      return;
    }

    if (!db) {
      if (import.meta.env.DEV) {
        setTailgates(mockTailgates.filter((tailgate) => tailgate.hostUserId === hostUserId));
      }
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    const firestore = db;

    const rawConfigs: Array<{ key: string; field: string; value?: string | null }> = [
      { key: "hostUserId", field: "hostUserId", value: hostUserId },
      { key: "hostId", field: "hostId", value: hostUserId },
      { key: "ownerId", field: "ownerId", value: hostUserId },
      { key: "createdByUid", field: "createdByUid", value: hostUserId }
    ];

    const seen = new Set<string>();
    const queryConfigs = rawConfigs.filter((config) => {
      if (!config.value) return false;
      const dedupeKey = `${config.field}:${config.value}`;
      if (seen.has(dedupeKey)) return false;
      seen.add(dedupeKey);
      return true;
    }) as Array<{ key: string; field: string; value: string }>;

    const groups = new Map<string, TailgateEvent[]>();
    const unsubscribers = queryConfigs.map((config) => {
      const tailgateQuery = query(
        collection(firestore, "tailgateEvents"),
        where(config.field, "==", config.value)
      );

      return onSnapshot(
        tailgateQuery,
        (snapshot) => {
          const next = snapshot.docs.map((doc) => normalizeTailgate(doc.id, doc.data()));
          const sample = snapshot.docs[0];
          if (sample) {
            const raw = sample.data() as Record<string, unknown>;
            debugAuthLog("tailgates:sample", {
              field: config.field,
              docId: sample.id,
              keys: Object.keys(raw).slice(0, 20),
              eventName: raw.eventName ?? raw.name ?? null,
              startHints: {
                startDateTime: raw.startDateTime ?? null,
                startAt: raw.startAt ?? null,
                eventDateTime: raw.eventDateTime ?? null,
                eventDate: raw.eventDate ?? null,
                createdAt: raw.createdAt ?? null
              }
            });
          }
          groups.set(config.key, next);
          const merged = mergeAndSortTailgates(Array.from(groups.values())).filter(
            (tailgate) => tailgate.hostUserId === hostUserId
          );
          setTailgates(merged);
          setLoading(false);
          setError(null);
          debugAuthLog("tailgates:loaded", {
            field: config.field,
            count: snapshot.size,
            total: merged.length
          });
        },
        (err) => {
          console.error("Failed to load tailgates", err);
          setError(err instanceof Error ? err.message : "Failed to load tailgates.");
          setLoading(false);
          debugAuthLog("tailgates:error", { field: config.field, message: String(err) });
        }
      );
    });

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [hostUserId]);

  const now = new Date();
  const upcomingTailgates = tailgates.filter(
    (tailgate) => tailgate.startDateTime >= now && !isCancelledStatus(tailgate.status)
  );
  const pastTailgates = tailgates.filter(
    (tailgate) => tailgate.startDateTime < now || isCancelledStatus(tailgate.status)
  );

  const totalTicketsSold = tailgates.reduce(
    (sum, tailgate) => sum + (tailgate.ticketsSold ?? 0),
    0
  );

  return {
    tailgates,
    upcomingTailgates,
    pastTailgates,
    totalTicketsSold,
    loading,
    error,
    counts: {
      upcoming: upcomingTailgates.length,
      past: pastTailgates.length,
      total: tailgates.length
    }
  };
}

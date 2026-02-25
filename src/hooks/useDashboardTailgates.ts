import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { TailgateEvent } from "../types";
import { mockTailgates } from "../data/mockTailgates";
import { debugAuthLog } from "../utils/debug";

export type DashboardRelationship = "hosting" | "attending";

export type DashboardTailgate = TailgateEvent & {
  relationship: DashboardRelationship;
};

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
    data.startDateTime,
    data.startTime,
    data.startAt,
    data.eventStartAt,
    data.eventDateTime,
    data.tailgateStartAt,
    data.kickoffAt,
    data.kickoffTime,
    data.eventDate,
    data.dateTime,
    data.date,
    data.createdAt
  ];

  for (const candidate of candidates) {
    const normalized = normalizeDate(candidate);
    if (normalized.getTime() > 0) return normalized;
  }

  return new Date(0);
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
  const direct = firstString(data.locationSummary, data.location, data.venueName);
  if (direct) return direct;

  const location = data.location as Record<string, unknown> | undefined;
  if (!location || typeof location !== "object") return undefined;

  return firstString(
    location.address,
    location.formattedAddress,
    location.name,
    location.lotName
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

function resolveRelationship(
  data: Record<string, unknown>,
  userId: string
): DashboardRelationship | null {
  const hostMatches = [
    firstString(data.hostUserId),
    firstString(data.hostId),
    firstString(data.ownerId),
    firstString(data.createdByUid)
  ].some((value) => value === userId);
  if (hostMatches) return "hosting";

  if (Array.isArray(data.coHostIds) && data.coHostIds.some((value) => value === userId)) {
    return "hosting";
  }

  const attendees = Array.isArray(data.attendees) ? data.attendees : [];
  const attendingMatch = attendees.some((attendee) => {
    const record = asRecord(attendee);
    if (!record) return false;
    const attendeeUid = firstString(record.userId, record.uid, record.id);
    if (attendeeUid !== userId) return false;
    const status = firstString(record.status)?.toLowerCase() ?? "";
    return (
      status === "attending" ||
      status === "going" ||
      status === "host" ||
      status === "hosted" ||
      status === "confirmed" ||
      status === "checked_in"
    );
  });
  if (attendingMatch) return "attending";

  const fallbackAttendingFields = [
    data.attendeeIds,
    data.attendeeUserIds,
    data.attendeesUserIds,
    data.goingUserIds,
    data.rsvpUserIds
  ];
  const fallbackMatch = fallbackAttendingFields.some(
    (value) => Array.isArray(value) && value.some((entry) => entry === userId)
  );
  if (fallbackMatch) return "attending";

  return null;
}

function sortTailgates(items: DashboardTailgate[]) {
  return [...items].sort((a, b) => b.startDateTime.getTime() - a.startDateTime.getTime());
}

function isCancelledStatus(status: unknown) {
  const raw = firstString(status)?.toLowerCase() ?? "";
  return raw === "cancelled" || raw === "canceled" || raw.startsWith("cancel");
}

function sortDashboardUpcoming(items: DashboardTailgate[]) {
  return [...items].sort((a, b) => {
    const aCancelled = isCancelledStatus(a.status);
    const bCancelled = isCancelledStatus(b.status);
    if (aCancelled !== bCancelled) return aCancelled ? 1 : -1;
    return a.startDateTime.getTime() - b.startDateTime.getTime();
  });
}

function sortDashboardPast(items: DashboardTailgate[]) {
  return [...items].sort((a, b) => {
    const aCancelled = isCancelledStatus(a.status);
    const bCancelled = isCancelledStatus(b.status);
    if (aCancelled !== bCancelled) return aCancelled ? 1 : -1;
    return b.startDateTime.getTime() - a.startDateTime.getTime();
  });
}

export function useDashboardTailgates(userId?: string) {
  const [tailgates, setTailgates] = useState<DashboardTailgate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setTailgates([]);
      setLoading(false);
      setError(null);
      return;
    }

    if (!db) {
      if (import.meta.env.DEV) {
        setTailgates(
          mockTailgates
            .filter((tailgate) => tailgate.hostUserId === userId)
            .map((tailgate) => ({ ...tailgate, relationship: "hosting" as const }))
        );
      }
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      collection(db, "tailgateEvents"),
      (snapshot) => {
        const nextTailgates: DashboardTailgate[] = snapshot.docs
          .map((snapshotDoc) => {
            const data = snapshotDoc.data() as Record<string, unknown>;
            const relationship = resolveRelationship(data, userId);
            if (!relationship) return null;

            return {
              ...normalizeTailgate(snapshotDoc.id, data),
              relationship
            } as DashboardTailgate;
          })
          .filter((event): event is DashboardTailgate => Boolean(event));

        const sorted = sortTailgates(nextTailgates);
        setTailgates(sorted);
        setLoading(false);
        setError(null);
        debugAuthLog("dashboard:tailgates-loaded", {
          uid: userId,
          total: sorted.length,
          hosting: sorted.filter((event) => event.relationship === "hosting").length,
          attending: sorted.filter((event) => event.relationship === "attending").length
        });
      },
      (snapshotError) => {
        console.error("Failed to load dashboard tailgates", snapshotError);
        setError(
          snapshotError instanceof Error
            ? snapshotError.message
            : "Failed to load tailgates."
        );
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const now = new Date();
  const upcomingTailgates = sortDashboardUpcoming(
    tailgates.filter((tailgate) => tailgate.startDateTime >= now)
  );
  const pastTailgates = sortDashboardPast(
    tailgates.filter((tailgate) => tailgate.startDateTime < now)
  );
  const hostingCount = tailgates.filter((tailgate) => tailgate.relationship === "hosting").length;
  const attendingCount = tailgates.filter(
    (tailgate) => tailgate.relationship === "attending"
  ).length;
  const paidOutCount = tailgates.filter(
    (tailgate) =>
      tailgate.relationship === "hosting" &&
      tailgate.visibilityType === "open_paid" &&
      tailgate.payoutStatus === "sent"
  ).length;

  return {
    tailgates,
    upcomingTailgates,
    pastTailgates,
    loading,
    error,
    counts: {
      upcoming: upcomingTailgates.length,
      past: pastTailgates.length,
      total: tailgates.length,
      hosting: hostingCount,
      attending: attendingCount,
      paidOut: paidOutCount
    }
  };
}

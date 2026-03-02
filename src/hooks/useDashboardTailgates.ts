import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
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

const ATTENDING_EVENT_STATUSES = new Set([
  "attending",
  "going",
  "host",
  "hosted",
  "confirmed",
  "checked_in",
  "pending",
  "invited",
  "undecided",
  "requested",
  "awaiting_response"
]);

const NON_ATTENDING_EVENT_STATUSES = new Set([
  "not_attending",
  "not attending",
  "not_going",
  "not going",
  "declined",
  "removed"
]);

const PAID_TICKET_STATUSES = new Set([
  "valid",
  "checked_in",
  "confirmed",
  "paid",
  "purchase_succeeded",
  "refunded",
  "refund_processed",
  "refund_succeeded"
]);

const NON_PAID_TICKET_STATUSES = new Set([
  "created",
  "pending",
  "processing",
  "failed",
  "canceled",
  "cancelled",
  "expired",
  "abandoned",
  "voided",
  "requires_payment_method",
  "requires_action"
]);

const SETTLED_PAYMENT_STATUSES = new Set([
  "paid",
  "succeeded",
  "complete",
  "completed",
  "captured"
]);

const DASHBOARD_TICKET_LOOKUPS = [
  { collectionName: "tickets", userField: "attendeeUserId", sourceKey: "tickets:attendeeUserId" },
  { collectionName: "tickets", userField: "userId", sourceKey: "tickets:userId" },
  { collectionName: "tickets", userField: "guestUserId", sourceKey: "tickets:guestUserId" },
  { collectionName: "tickets", userField: "purchaserUserId", sourceKey: "tickets:purchaserUserId" },
  {
    collectionName: "tailgateTickets",
    userField: "userId",
    sourceKey: "tailgateTickets:userId"
  },
  {
    collectionName: "tailgateTickets",
    userField: "attendeeUserId",
    sourceKey: "tailgateTickets:attendeeUserId"
  }
] as const;

function isTrueFlag(value: unknown) {
  if (value === true) return true;
  if (value === 1) return true;
  if (typeof value !== "string") return false;
  const raw = value.trim().toLowerCase();
  return raw === "true" || raw === "1" || raw === "yes";
}

function normalizeToken(value: unknown) {
  return firstString(value)?.toLowerCase() ?? "";
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
    const status = normalizeToken(record.status);
    if (!status) return true;
    if (NON_ATTENDING_EVENT_STATUSES.has(status)) return false;
    return ATTENDING_EVENT_STATUSES.has(status);
  });
  if (attendingMatch) return "attending";

  const fallbackAttendingFields = [
    data.attendeeIds,
    data.attendeeUserIds,
    data.attendeesUserIds,
    data.goingUserIds,
    data.rsvpUserIds,
    data.invitedUserIds,
    data.pendingUserIds,
    data.rsvpPendingUserIds
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

function resolveTicketTailgateId(data: Record<string, unknown>) {
  const event = asRecord(data.event);
  const tailgate = asRecord(data.tailgate);
  return firstString(
    data.tailgateId,
    data.eventId,
    data.tailgateEventId,
    event?.tailgateId,
    event?.id,
    tailgate?.tailgateId,
    tailgate?.id
  );
}

function isPaidTicketRecord(data: Record<string, unknown>) {
  const status = normalizeToken(data.status);
  if (status && NON_PAID_TICKET_STATUSES.has(status)) return false;
  if (status && PAID_TICKET_STATUSES.has(status)) return true;

  const paymentStatus = normalizeToken(
    data.paymentStatus ?? data.checkoutStatus ?? data.purchaseStatus ?? data.chargeStatus
  );
  if (paymentStatus && SETTLED_PAYMENT_STATUSES.has(paymentStatus)) return true;
  if (paymentStatus && NON_PAID_TICKET_STATUSES.has(paymentStatus)) return false;

  const isPaidFlag = [data.isPaid, data.paid, data.paymentComplete, data.purchaseComplete].some(
    isTrueFlag
  );
  if (isPaidFlag) return true;

  const paidCentsCandidates = [
    data.totalPaidCents,
    data.amountPaidCents,
    data.totalAmountCents,
    data.chargeAmountCents
  ];
  return paidCentsCandidates.some((value) => {
    const cents = coerceNumber(value);
    return typeof cents === "number" && cents > 0;
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

    const eventsById = new Map<string, Record<string, unknown>>();
    const ticketTailgateIdsBySource = new Map<string, Set<string>>();
    const readyTicketSources = new Set<string>();
    let hasEventSnapshot = false;

    const applySnapshotState = () => {
      if (!hasEventSnapshot) return;

      const ticketTailgateIds = new Set<string>();
      ticketTailgateIdsBySource.forEach((ids) => {
        ids.forEach((tailgateId) => ticketTailgateIds.add(tailgateId));
      });

      const nextTailgates: DashboardTailgate[] = Array.from(eventsById.entries())
        .map(([eventId, data]) => {
          const relationship = resolveRelationship(data, userId);
          const hasPaidTicket = ticketTailgateIds.has(eventId);
          const effectiveRelationship = relationship ?? (hasPaidTicket ? "attending" : null);
          if (!effectiveRelationship) return null;

          return {
            ...normalizeTailgate(eventId, data),
            relationship: effectiveRelationship
          } as DashboardTailgate;
        })
        .filter((event): event is DashboardTailgate => Boolean(event));

      const sorted = sortTailgates(nextTailgates);
      setTailgates(sorted);
      if (readyTicketSources.size >= DASHBOARD_TICKET_LOOKUPS.length) {
        setLoading(false);
      }
      setError(null);
      debugAuthLog("dashboard:tailgates-loaded", {
        uid: userId,
        total: sorted.length,
        hosting: sorted.filter((event) => event.relationship === "hosting").length,
        attending: sorted.filter((event) => event.relationship === "attending").length
      });
    };

    const unsubscribeEvents = onSnapshot(
      collection(db, "tailgateEvents"),
      (snapshot) => {
        eventsById.clear();
        snapshot.docs.forEach((snapshotDoc) => {
          eventsById.set(snapshotDoc.id, snapshotDoc.data() as Record<string, unknown>);
        });
        hasEventSnapshot = true;
        applySnapshotState();
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

    const ticketUnsubscribes = DASHBOARD_TICKET_LOOKUPS.map((lookup) =>
      onSnapshot(
        query(collection(db, lookup.collectionName), where(lookup.userField, "==", userId)),
        (snapshot) => {
          const ids = new Set<string>();
          snapshot.docs.forEach((snapshotDoc) => {
            const data = snapshotDoc.data() as Record<string, unknown>;
            if (!isPaidTicketRecord(data)) return;
            const tailgateId = resolveTicketTailgateId(data);
            if (tailgateId) ids.add(tailgateId);
          });
          ticketTailgateIdsBySource.set(lookup.sourceKey, ids);
          readyTicketSources.add(lookup.sourceKey);
          applySnapshotState();
        },
        (ticketError) => {
          console.error(
            `Failed to load dashboard ticket relationships from ${lookup.collectionName}.${lookup.userField}`,
            ticketError
          );
          ticketTailgateIdsBySource.set(lookup.sourceKey, new Set<string>());
          readyTicketSources.add(lookup.sourceKey);
          applySnapshotState();
        }
      )
    );

    return () => {
      unsubscribeEvents();
      ticketUnsubscribes.forEach((unsubscribe) => unsubscribe());
    };
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

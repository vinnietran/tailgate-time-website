import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

type OpsMetric = {
  label: string;
  value: string;
  helper: string;
  tone?: "default" | "success" | "warning" | "danger";
};

export type OpsPurchaseAlert = {
  id: string;
  tailgateId: string | null;
  tailgateName: string;
  purchaserLabel: string;
  amountCents: number;
  status: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  reason: string;
};

export type OpsPurchaseSummary = {
  id: string;
  tailgateId: string | null;
  tailgateName: string;
  purchaserLabel: string;
  amountCents: number;
  status: string;
  createdAt: Date | null;
};

export type OpsPayoutAlert = {
  tailgateId: string;
  tailgateName: string;
  hostUserId: string;
  hostLabel: string;
  startDateTime: Date;
  ticketPriceCents: number;
  connectStatus: string;
  payoutsEnabled: boolean;
  reason: string;
};

export type OpsTailgateCancellation = {
  tailgateId: string;
  tailgateName: string;
  hostLabel: string;
  visibilityType: string;
  cancelledAt: Date | null;
};

type AdminOpsDashboardData = {
  metrics: OpsMetric[];
  checkoutAlerts: OpsPurchaseAlert[];
  recentPurchases: OpsPurchaseSummary[];
  payoutAlerts: OpsPayoutAlert[];
  recentCancellations: OpsTailgateCancellation[];
  loading: boolean;
  error: string | null;
};

type UserRecord = {
  id: string;
  displayName: string;
  email: string;
  stripeConnectStatus: string;
  payoutsEnabled: boolean;
};

type TailgateRecord = {
  id: string;
  hostUserId: string;
  name: string;
  visibilityType: string;
  status: string;
  startDateTime: Date;
  ticketPriceCents: number;
  ticketsSold: number;
  cancelledAt: Date | null;
};

type PurchaseRecord = {
  id: string;
  tailgateId: string | null;
  tailgateName: string;
  purchaserLabel: string;
  amountCents: number;
  status: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

type RawPurchaseRecord = {
  id: string;
  data: Record<string, unknown>;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

function normalizeToken(value: unknown) {
  return firstString(value).toLowerCase().replace(/\s+/g, "_");
}

function coerceNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
}

function coerceBoolean(value: unknown) {
  if (value === true || value === false) {
    return value;
  }
  return null;
}

function normalizeDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  const timestamp = value as {
    toDate?: () => Date;
    seconds?: number;
  };
  if (typeof timestamp?.toDate === "function") {
    const date = timestamp.toDate();
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (typeof timestamp?.seconds === "number") {
    const date = new Date(timestamp.seconds * 1000);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

function pickTailgateDate(data: Record<string, unknown>) {
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
    const parsed = normalizeDate(candidate);
    if (parsed) return parsed;
  }

  return new Date(0);
}

function resolveTailgateId(data: Record<string, unknown>) {
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

function resolveTailgateName(data: Record<string, unknown>) {
  const event = asRecord(data.event);
  const tailgate = asRecord(data.tailgate);
  return firstString(
    data.tailgateName,
    data.eventName,
    data.name,
    event?.name,
    tailgate?.name
  );
}

function resolvePurchaseAmountCents(data: Record<string, unknown>) {
  const candidates = [
    data.totalPaidCents,
    data.amountPaidCents,
    data.totalAmountCents,
    data.chargeAmountCents,
    data.amountCents,
    data.paymentAmountCents
  ];

  for (const candidate of candidates) {
    const parsed = coerceNumber(candidate);
    if (typeof parsed === "number" && parsed >= 0) {
      return Math.round(parsed);
    }
  }

  return 0;
}

function resolvePurchaseStatus(data: Record<string, unknown>) {
  return (
    normalizeToken(data.status) ||
    normalizeToken(data.paymentStatus) ||
    normalizeToken(data.checkoutStatus) ||
    normalizeToken(data.purchaseStatus) ||
    normalizeToken(data.chargeStatus) ||
    "unknown"
  );
}

function resolvePurchaseCreatedAt(data: Record<string, unknown>) {
  return (
    normalizeDate(data.createdAt) ??
    normalizeDate(data.startedAt) ??
    normalizeDate(data.checkoutCreatedAt) ??
    normalizeDate(data.updatedAt)
  );
}

function resolvePurchaseUpdatedAt(data: Record<string, unknown>) {
  return (
    normalizeDate(data.updatedAt) ??
    normalizeDate(data.completedAt) ??
    normalizeDate(data.confirmedAt) ??
    normalizeDate(data.createdAt)
  );
}

function resolvePurchaserLabel(data: Record<string, unknown>) {
  return (
    firstString(
      data.purchaserName,
      data.displayName,
      data.customerName,
      data.userName,
      data.purchaserEmail,
      data.email,
      data.customerEmail
    ) || "Unknown purchaser"
  );
}

function isPurchaseSuccess(status: string) {
  return (
    status === "confirmed" ||
    status === "paid" ||
    status === "succeeded" ||
    status === "completed" ||
    status === "purchase_succeeded"
  );
}

function isPurchaseIssue(status: string) {
  return (
    status === "failed" ||
    status === "expired" ||
    status === "cancelled" ||
    status === "canceled" ||
    status === "refunded" ||
    status === "voided"
  );
}

function isPurchasePending(status: string) {
  return (
    status === "checkout_created" ||
    status === "created" ||
    status === "pending" ||
    status === "processing" ||
    status === "requires_action" ||
    status === "requires_payment_method"
  );
}

function formatMetricCurrency(cents: number) {
  return cents > 0 ? `$${Math.round(cents / 100)}` : "$0";
}

function normalizeTailgate(data: Record<string, unknown>, id: string): TailgateRecord {
  const visibilityType = firstString(data.visibilityType).toLowerCase() || "open_free";
  const status = normalizeToken(data.status ?? data.eventStatus) || "upcoming";
  const ticketPriceCents =
    coerceNumber(data.ticketPriceCents) ??
    coerceNumber(data.priceCents) ??
    coerceNumber(data.ticketPrice) ??
    0;
  const ticketsSold =
    coerceNumber(data.confirmedPaidCount) ??
    coerceNumber(data.ticketsSold) ??
    coerceNumber(data.soldCount) ??
    coerceNumber(data.ticketsPurchased) ??
    coerceNumber(data.paidAttendees) ??
    coerceNumber(data.rsvpsConfirmed) ??
    0;

  return {
    id,
    hostUserId: firstString(data.hostUserId, data.createdBy, data.userId),
    name: firstString(data.name, data.title) || "Untitled tailgate",
    visibilityType,
    status,
    startDateTime: pickTailgateDate(data),
    ticketPriceCents: Math.max(0, Math.round(ticketPriceCents)),
    ticketsSold: Math.max(0, Math.round(ticketsSold)),
    cancelledAt:
      normalizeDate(data.cancelledAt) ??
      (status === "cancelled" || status === "canceled" ? pickTailgateDate(data) : null)
  };
}

function normalizeUser(data: Record<string, unknown>, id: string): UserRecord {
  return {
    id,
    displayName: firstString(data.displayName),
    email: firstString(data.email),
    stripeConnectStatus: normalizeToken(data.stripeConnectStatus) || "not_started",
    payoutsEnabled: coerceBoolean(data.payoutsEnabled) === true
  };
}

function normalizePurchase(
  data: Record<string, unknown>,
  id: string,
  tailgatesById: Map<string, TailgateRecord>
): PurchaseRecord {
  const tailgateId = resolveTailgateId(data) || null;
  const linkedTailgate = tailgateId ? tailgatesById.get(tailgateId) : null;

  return {
    id,
    tailgateId,
    tailgateName: resolveTailgateName(data) || linkedTailgate?.name || "Unknown tailgate",
    purchaserLabel: resolvePurchaserLabel(data),
    amountCents: resolvePurchaseAmountCents(data),
    status: resolvePurchaseStatus(data),
    createdAt: resolvePurchaseCreatedAt(data),
    updatedAt: resolvePurchaseUpdatedAt(data)
  };
}

const EMPTY_DATA: AdminOpsDashboardData = {
  metrics: [],
  checkoutAlerts: [],
  recentPurchases: [],
  payoutAlerts: [],
  recentCancellations: [],
  loading: true,
  error: null
};

export function useAdminOpsDashboard() {
  const [tailgates, setTailgates] = useState<Map<string, TailgateRecord>>(new Map());
  const [users, setUsers] = useState<Map<string, UserRecord>>(new Map());
  const [rawPurchases, setRawPurchases] = useState<RawPurchaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      setError("Firestore is unavailable in this environment.");
      return;
    }

    setLoading(true);
    setError(null);
    let readyCount = 0;

    const markReady = () => {
      readyCount += 1;
      if (readyCount >= 3) {
        setLoading(false);
      }
    };

    const unsubscribeTailgates = onSnapshot(
      collection(db, "tailgateEvents"),
      (snapshot) => {
        const next = new Map<string, TailgateRecord>();
        snapshot.forEach((docSnapshot) => {
          const data = asRecord(docSnapshot.data());
          if (!data) return;
          next.set(docSnapshot.id, normalizeTailgate(data, docSnapshot.id));
        });
        setTailgates(next);
        markReady();
        setError(null);
      },
      (snapshotError) => {
        console.error("Failed loading ops tailgates", snapshotError);
        setError("Unable to load live tailgate operations right now.");
        setLoading(false);
      }
    );

    const unsubscribeUsers = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const next = new Map<string, UserRecord>();
        snapshot.forEach((docSnapshot) => {
          const data = asRecord(docSnapshot.data());
          if (!data) return;
          next.set(docSnapshot.id, normalizeUser(data, docSnapshot.id));
        });
        setUsers(next);
        markReady();
        setError(null);
      },
      (snapshotError) => {
        console.error("Failed loading ops users", snapshotError);
        setError("Unable to load host payout readiness right now.");
        setLoading(false);
      }
    );

    const unsubscribePurchases = onSnapshot(
      collection(db, "ticketPurchases"),
      (snapshot) => {
        const nextPurchases: RawPurchaseRecord[] = [];
        snapshot.forEach((docSnapshot) => {
          const data = asRecord(docSnapshot.data());
          if (!data) return;
          nextPurchases.push({
            id: docSnapshot.id,
            data
          });
        });
        setRawPurchases(nextPurchases);
        markReady();
        setError(null);
      },
      (snapshotError) => {
        console.error("Failed loading ops purchases", snapshotError);
        setError("Unable to load checkout activity right now.");
        setLoading(false);
      }
    );

    return () => {
      unsubscribeTailgates();
      unsubscribeUsers();
      unsubscribePurchases();
    };
  }, []);

  const data = useMemo<AdminOpsDashboardData>(() => {
    if (!db && !error) {
      return {
        ...EMPTY_DATA,
        loading
      };
    }

    const now = Date.now();
    const last24HoursMs = now - 24 * 60 * 60 * 1000;
    const last7DaysMs = now - 7 * 24 * 60 * 60 * 1000;
    const upcomingWindowMs = now + 14 * 24 * 60 * 60 * 1000;
    const stuckThresholdMs = now - 20 * 60 * 1000;
    const tailgateList = [...tailgates.values()];
    const purchases = rawPurchases.map((purchase) =>
      normalizePurchase(purchase.data, purchase.id, tailgates)
    );

    const confirmedPurchases24h = purchases.filter(
      (purchase) =>
        isPurchaseSuccess(purchase.status) &&
        purchase.createdAt &&
        purchase.createdAt.getTime() >= last24HoursMs
    );
    const revenue24hCents = confirmedPurchases24h.reduce(
      (sum, purchase) => sum + Math.max(0, purchase.amountCents),
      0
    );
    const lifetimePaidTailgates = tailgateList.filter(
      (tailgate) => tailgate.visibilityType === "open_paid" && tailgate.ticketPriceCents > 0
    );
    const lifetimeTicketsSold = lifetimePaidTailgates.reduce(
      (sum, tailgate) => sum + tailgate.ticketsSold,
      0
    );
    const revenueLifetimeCents = lifetimePaidTailgates.reduce(
      (sum, tailgate) => sum + tailgate.ticketPriceCents * tailgate.ticketsSold,
      0
    );

    const checkoutAlerts = purchases
      .filter((purchase) => {
        const createdAtMs = purchase.createdAt?.getTime() ?? 0;
        if (isPurchaseIssue(purchase.status)) {
          return createdAtMs >= last24HoursMs;
        }
        return isPurchasePending(purchase.status) && createdAtMs > 0 && createdAtMs <= stuckThresholdMs;
      })
      .map((purchase) => ({
        ...purchase,
        reason: isPurchaseIssue(purchase.status)
          ? `Checkout ended as ${purchase.status.replace(/_/g, " ")}.`
          : "Checkout appears stuck for more than 20 minutes."
      }))
      .sort(
        (left, right) =>
          (right.updatedAt?.getTime() ?? right.createdAt?.getTime() ?? 0) -
          (left.updatedAt?.getTime() ?? left.createdAt?.getTime() ?? 0)
      )
      .slice(0, 8);

    const payoutAlerts = tailgateList
      .filter((tailgate) => {
        const startsAtMs = tailgate.startDateTime.getTime();
        return (
          tailgate.visibilityType === "open_paid" &&
          tailgate.status !== "cancelled" &&
          tailgate.status !== "canceled" &&
          startsAtMs >= now &&
          startsAtMs <= upcomingWindowMs
        );
      })
      .map((tailgate) => {
        const host = users.get(tailgate.hostUserId);
        const connectStatus = host?.stripeConnectStatus ?? "missing";
        const payoutsEnabled = host?.payoutsEnabled === true;
        return {
          tailgateId: tailgate.id,
          tailgateName: tailgate.name,
          hostUserId: tailgate.hostUserId,
          hostLabel: host?.displayName || host?.email || tailgate.hostUserId || "Unknown host",
          startDateTime: tailgate.startDateTime,
          ticketPriceCents: tailgate.ticketPriceCents,
          connectStatus,
          payoutsEnabled,
          reason:
            connectStatus === "missing"
              ? "Host profile is missing payout data."
              : connectStatus !== "complete"
              ? `Stripe onboarding is ${connectStatus.replace(/_/g, " ")}.`
              : !payoutsEnabled
              ? "Stripe account is complete but payouts are not enabled."
              : ""
        };
      })
      .filter((item) => item.reason.length > 0)
      .sort((left, right) => left.startDateTime.getTime() - right.startDateTime.getTime())
      .slice(0, 8);

    const recentCancellations = tailgateList
      .filter((tailgate) => {
        const cancelledAtMs = tailgate.cancelledAt?.getTime() ?? 0;
        return cancelledAtMs >= last7DaysMs;
      })
      .map((tailgate) => {
        const host = users.get(tailgate.hostUserId);
        return {
          tailgateId: tailgate.id,
          tailgateName: tailgate.name,
          hostLabel: host?.displayName || host?.email || tailgate.hostUserId || "Unknown host",
          visibilityType: tailgate.visibilityType,
          cancelledAt: tailgate.cancelledAt
        };
      })
      .sort(
        (left, right) =>
          (right.cancelledAt?.getTime() ?? 0) - (left.cancelledAt?.getTime() ?? 0)
      )
      .slice(0, 8);

    const recentPurchases = purchases
      .filter((purchase) => isPurchaseSuccess(purchase.status))
      .sort(
        (left, right) =>
          (right.createdAt?.getTime() ?? 0) - (left.createdAt?.getTime() ?? 0)
      )
      .slice(0, 8)
      .map((purchase) => ({
        id: purchase.id,
        tailgateId: purchase.tailgateId,
        tailgateName: purchase.tailgateName,
        purchaserLabel: purchase.purchaserLabel,
        amountCents: purchase.amountCents,
        status: purchase.status,
        createdAt: purchase.createdAt
      }));

    const metrics: OpsMetric[] = [
      {
        label: "24h Revenue",
        value: formatMetricCurrency(revenue24hCents),
        helper: `${confirmedPurchases24h.length} confirmed purchases`,
        tone: confirmedPurchases24h.length > 0 ? "success" : "default"
      },
      {
        label: "Lifetime Gross Revenue",
        value: formatMetricCurrency(revenueLifetimeCents),
        helper: `${lifetimeTicketsSold} tickets sold across paid tailgates`,
        tone: revenueLifetimeCents > 0 ? "success" : "default"
      },
      {
        label: "Checkout Alerts",
        value: String(checkoutAlerts.length),
        helper: "Failed, refunded, canceled, or stuck purchases",
        tone: checkoutAlerts.length > 0 ? "danger" : "success"
      },
      {
        label: "Payout Blockers",
        value: String(payoutAlerts.length),
        helper: "Upcoming paid tailgates with host payout issues",
        tone: payoutAlerts.length > 0 ? "warning" : "success"
      },
      {
        label: "Upcoming Paid",
        value: String(
          tailgateList.filter((tailgate) => {
            const startsAtMs = tailgate.startDateTime.getTime();
            return (
              tailgate.visibilityType === "open_paid" &&
              tailgate.status !== "cancelled" &&
              tailgate.status !== "canceled" &&
              startsAtMs >= now
            );
          }).length
        ),
        helper: "Paid tailgates still on the board",
        tone: "default"
      },
      {
        label: "7d Cancellations",
        value: String(recentCancellations.length),
        helper: "Events canceled in the last week",
        tone: recentCancellations.length > 0 ? "warning" : "success"
      },
      {
        label: "Live Coverage",
        value: String(
          tailgateList.filter((tailgate) => {
            const startsAtMs = tailgate.startDateTime.getTime();
            return startsAtMs <= now && startsAtMs >= now - 8 * 60 * 60 * 1000;
          }).length
        ),
        helper: "Tailgates happening now or recently started",
        tone: "default"
      }
    ];

    return {
      metrics,
      checkoutAlerts,
      recentPurchases,
      payoutAlerts,
      recentCancellations,
      loading,
      error
    };
  }, [error, loading, rawPurchases, tailgates, users]);

  return data;
}

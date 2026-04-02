import { useEffect, useState } from "react";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query
} from "firebase/firestore";
import { useAuth } from "./useAuth";
import { db } from "../lib/firebase";

export type AdminMetricsSummary = {
  schemaVersion: number;
  totalUsers: number;
  totalTailgates: number;
  totalPrivateTailgates: number;
  totalOpenFreeTailgates: number;
  totalOpenPaidTailgates: number;
  upcomingTailgates: number;
  upcomingTailgatesWithoutEngagement: number;
  totalTicketsSold: number;
  grossRevenueCents: number;
  platformFeeRevenueCents: number;
  refundedTickets: number;
  refundedRevenueCents: number;
  totalFeedPosts: number;
  stripeConnectedHosts: number;
  pendingPayoutTailgates: number;
  failedPayoutTailgates: number;
  estimatedTailgateSizeTotal: number;
  estimatedTailgateSizeKnownCount: number;
  updatedAt: Date | null;
};

export type AdminMetricsDailyBucket = {
  id: string;
  dateKey: string;
  usersCreated: number;
  tailgatesCreated: number;
  privateTailgatesCreated: number;
  openFreeTailgatesCreated: number;
  openPaidTailgatesCreated: number;
  ticketsSold: number;
  grossRevenueCents: number;
  platformFeeRevenueCents: number;
  refundCount: number;
  refundedRevenueCents: number;
  feedPostsCreated: number;
  updatedAt: Date | null;
};

export type AdminMetricsHost = {
  id: string;
  hostUserId: string;
  displayNameSnapshot: string;
  stripeConnected: boolean | null;
  tailgatesCreated: number;
  openTailgatesCreated: number;
  paidTailgatesCreated: number;
  ticketsSold: number;
  grossRevenueCents: number;
  platformFeeRevenueCents: number;
  upcomingTailgates: number;
  lastTailgateCreatedAt: Date | null;
  updatedAt: Date | null;
};

export type AdminMetricsTailgate = {
  id: string;
  tailgateEventId: string;
  hostUserId: string;
  hostDisplayNameSnapshot: string;
  titleSnapshot: string;
  startTime: Date | null;
  visibilityType: string;
  rsvpCount: number | null;
  confirmedPaidCount: number;
  estimatedSize: number | null;
  estimatedSizeSource: string;
  grossRevenueCents: number;
  platformFeeRevenueCents: number;
  feedPostsCount: number;
  isUpcoming: boolean;
  isCancelled: boolean;
  upcomingEstimatedSize: number;
  payoutStatus: string;
  updatedAt: Date | null;
};

export type AdminMetricsActivity = {
  id: string;
  type: string;
  summary: string;
  createdAt: Date | null;
  actorUserId: string | null;
  relatedTailgateId: string | null;
  relatedUserId: string | null;
  hostUserId: string | null;
  purchaseId: string | null;
  refundId: string | null;
  postId: string | null;
  quantity: number | null;
  amountCents: number | null;
  titleSnapshot: string | null;
  updatedAt: Date | null;
};

type AdminMetricsDashboardData = {
  summary: AdminMetricsSummary;
  dailyBuckets: AdminMetricsDailyBucket[];
  topHosts: AdminMetricsHost[];
  largestUpcomingTailgates: AdminMetricsTailgate[];
  recentActivity: AdminMetricsActivity[];
  loading: boolean;
  error: string | null;
};

const EMPTY_SUMMARY: AdminMetricsSummary = {
  schemaVersion: 1,
  totalUsers: 0,
  totalTailgates: 0,
  totalPrivateTailgates: 0,
  totalOpenFreeTailgates: 0,
  totalOpenPaidTailgates: 0,
  upcomingTailgates: 0,
  upcomingTailgatesWithoutEngagement: 0,
  totalTicketsSold: 0,
  grossRevenueCents: 0,
  platformFeeRevenueCents: 0,
  refundedTickets: 0,
  refundedRevenueCents: 0,
  totalFeedPosts: 0,
  stripeConnectedHosts: 0,
  pendingPayoutTailgates: 0,
  failedPayoutTailgates: 0,
  estimatedTailgateSizeTotal: 0,
  estimatedTailgateSizeKnownCount: 0,
  updatedAt: null
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

function coerceNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.round(value);
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return Math.round(parsed);
    }
  }
  return fallback;
}

function coerceBoolean(value: unknown) {
  if (value === true) return true;
  if (value === false) return false;
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
  const timestamp = value as { toDate?: () => Date; seconds?: number };
  if (typeof timestamp?.toDate === "function") {
    const parsed = timestamp.toDate();
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (typeof timestamp?.seconds === "number") {
    const parsed = new Date(timestamp.seconds * 1000);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

function normalizeSummary(data: Record<string, unknown> | null): AdminMetricsSummary {
  if (!data) {
    return EMPTY_SUMMARY;
  }

  return {
    schemaVersion: coerceNumber(data.schemaVersion, 1),
    totalUsers: coerceNumber(data.totalUsers),
    totalTailgates: coerceNumber(data.totalTailgates),
    totalPrivateTailgates: coerceNumber(data.totalPrivateTailgates),
    totalOpenFreeTailgates: coerceNumber(data.totalOpenFreeTailgates),
    totalOpenPaidTailgates: coerceNumber(data.totalOpenPaidTailgates),
    upcomingTailgates: coerceNumber(data.upcomingTailgates),
    upcomingTailgatesWithoutEngagement: coerceNumber(data.upcomingTailgatesWithoutEngagement),
    totalTicketsSold: coerceNumber(data.totalTicketsSold),
    grossRevenueCents: coerceNumber(data.grossRevenueCents),
    platformFeeRevenueCents: coerceNumber(data.platformFeeRevenueCents),
    refundedTickets: coerceNumber(data.refundedTickets),
    refundedRevenueCents: coerceNumber(data.refundedRevenueCents),
    totalFeedPosts: coerceNumber(data.totalFeedPosts),
    stripeConnectedHosts: coerceNumber(data.stripeConnectedHosts),
    pendingPayoutTailgates: coerceNumber(data.pendingPayoutTailgates),
    failedPayoutTailgates: coerceNumber(data.failedPayoutTailgates),
    estimatedTailgateSizeTotal: coerceNumber(data.estimatedTailgateSizeTotal),
    estimatedTailgateSizeKnownCount: coerceNumber(data.estimatedTailgateSizeKnownCount),
    updatedAt: normalizeDate(data.updatedAt)
  };
}

function normalizeDailyBucket(id: string, data: Record<string, unknown>): AdminMetricsDailyBucket {
  return {
    id,
    dateKey: firstString(data.dateKey) || id,
    usersCreated: coerceNumber(data.usersCreated),
    tailgatesCreated: coerceNumber(data.tailgatesCreated),
    privateTailgatesCreated: coerceNumber(data.privateTailgatesCreated),
    openFreeTailgatesCreated: coerceNumber(data.openFreeTailgatesCreated),
    openPaidTailgatesCreated: coerceNumber(data.openPaidTailgatesCreated),
    ticketsSold: coerceNumber(data.ticketsSold),
    grossRevenueCents: coerceNumber(data.grossRevenueCents),
    platformFeeRevenueCents: coerceNumber(data.platformFeeRevenueCents),
    refundCount: coerceNumber(data.refundCount),
    refundedRevenueCents: coerceNumber(data.refundedRevenueCents),
    feedPostsCreated: coerceNumber(data.feedPostsCreated),
    updatedAt: normalizeDate(data.updatedAt)
  };
}

function normalizeHost(id: string, data: Record<string, unknown>): AdminMetricsHost {
  return {
    id,
    hostUserId: firstString(data.hostUserId) || id,
    displayNameSnapshot: firstString(data.displayNameSnapshot) || "Unknown host",
    stripeConnected: coerceBoolean(data.stripeConnected),
    tailgatesCreated: coerceNumber(data.tailgatesCreated),
    openTailgatesCreated: coerceNumber(data.openTailgatesCreated),
    paidTailgatesCreated: coerceNumber(data.paidTailgatesCreated),
    ticketsSold: coerceNumber(data.ticketsSold),
    grossRevenueCents: coerceNumber(data.grossRevenueCents),
    platformFeeRevenueCents: coerceNumber(data.platformFeeRevenueCents),
    upcomingTailgates: coerceNumber(data.upcomingTailgates),
    lastTailgateCreatedAt: normalizeDate(data.lastTailgateCreatedAt),
    updatedAt: normalizeDate(data.updatedAt)
  };
}

function normalizeTailgate(id: string, data: Record<string, unknown>): AdminMetricsTailgate {
  return {
    id,
    tailgateEventId: firstString(data.tailgateEventId) || id,
    hostUserId: firstString(data.hostUserId),
    hostDisplayNameSnapshot: firstString(data.hostDisplayNameSnapshot) || "Unknown host",
    titleSnapshot: firstString(data.titleSnapshot) || "Untitled Tailgate",
    startTime: normalizeDate(data.startTime),
    visibilityType: firstString(data.visibilityType) || "unknown",
    rsvpCount: data.rsvpCount == null ? null : coerceNumber(data.rsvpCount),
    confirmedPaidCount: coerceNumber(data.confirmedPaidCount),
    estimatedSize: data.estimatedSize == null ? null : coerceNumber(data.estimatedSize),
    estimatedSizeSource: firstString(data.estimatedSizeSource) || "unknown",
    grossRevenueCents: coerceNumber(data.grossRevenueCents),
    platformFeeRevenueCents: coerceNumber(data.platformFeeRevenueCents),
    feedPostsCount: coerceNumber(data.feedPostsCount),
    isUpcoming: coerceBoolean(data.isUpcoming) === true,
    isCancelled: coerceBoolean(data.isCancelled) === true,
    upcomingEstimatedSize: coerceNumber(data.upcomingEstimatedSize, -1),
    payoutStatus: firstString(data.payoutStatus) || "unknown",
    updatedAt: normalizeDate(data.updatedAt)
  };
}

function normalizeActivity(id: string, data: Record<string, unknown>): AdminMetricsActivity {
  return {
    id,
    type: firstString(data.type) || "unknown",
    summary: firstString(data.summary) || "Activity recorded",
    createdAt: normalizeDate(data.createdAt),
    actorUserId: firstString(data.actorUserId) || null,
    relatedTailgateId: firstString(data.relatedTailgateId) || null,
    relatedUserId: firstString(data.relatedUserId) || null,
    hostUserId: firstString(data.hostUserId) || null,
    purchaseId: firstString(data.purchaseId) || null,
    refundId: firstString(data.refundId) || null,
    postId: firstString(data.postId) || null,
    quantity: data.quantity == null ? null : coerceNumber(data.quantity),
    amountCents: data.amountCents == null ? null : coerceNumber(data.amountCents),
    titleSnapshot: firstString(data.titleSnapshot) || null,
    updatedAt: normalizeDate(data.updatedAt)
  };
}

const EMPTY_DATA: AdminMetricsDashboardData = {
  summary: EMPTY_SUMMARY,
  dailyBuckets: [],
  topHosts: [],
  largestUpcomingTailgates: [],
  recentActivity: [],
  loading: true,
  error: null
};

export function useAdminMetricsDashboard(): AdminMetricsDashboardData {
  const { isAdmin, adminLoading } = useAuth();
  const [summary, setSummary] = useState<AdminMetricsSummary>(EMPTY_SUMMARY);
  const [dailyBuckets, setDailyBuckets] = useState<AdminMetricsDailyBucket[]>([]);
  const [topHosts, setTopHosts] = useState<AdminMetricsHost[]>([]);
  const [largestUpcomingTailgates, setLargestUpcomingTailgates] = useState<AdminMetricsTailgate[]>([]);
  const [recentActivity, setRecentActivity] = useState<AdminMetricsActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (adminLoading) {
      return;
    }

    if (!db) {
      setLoading(false);
      setError("Firestore is unavailable in this environment.");
      return;
    }

    if (!isAdmin) {
      setSummary(EMPTY_SUMMARY);
      setDailyBuckets([]);
      setTopHosts([]);
      setLargestUpcomingTailgates([]);
      setRecentActivity([]);
      setLoading(false);
      setError("Admin access is required to view platform metrics.");
      return;
    }

    setLoading(true);
    setError(null);
    const readyKeys = new Set<string>();
    const markReady = (key: string) => {
      if (readyKeys.has(key)) {
        return;
      }
      readyKeys.add(key);
      if (readyKeys.size >= 5) {
        setLoading(false);
      }
    };

    const summaryRef = doc(db, "adminMetrics", "global");
    const dailyQuery = query(
      collection(db, "adminMetrics", "global", "daily"),
      orderBy("dateKey", "desc"),
      limit(30)
    );
    const hostsQuery = query(
      collection(db, "adminMetrics", "global", "hosts"),
      orderBy("tailgatesCreated", "desc"),
      limit(6)
    );
    const tailgatesQuery = query(
      collection(db, "adminMetrics", "global", "tailgates"),
      orderBy("upcomingEstimatedSize", "desc"),
      limit(16)
    );
    const activityQuery = query(
      collection(db, "adminMetrics", "global", "activity"),
      orderBy("createdAt", "desc"),
      limit(12)
    );

    const unsubscribeSummary = onSnapshot(
      summaryRef,
      (snapshot) => {
        setSummary(normalizeSummary(asRecord(snapshot.data())));
        setError(null);
        markReady("summary");
      },
      (snapshotError) => {
        console.error("Failed loading admin metrics summary", snapshotError);
        setError("Unable to load the admin metrics summary.");
        setLoading(false);
      }
    );

    const unsubscribeDaily = onSnapshot(
      dailyQuery,
      (snapshot) => {
        const next = snapshot.docs
          .map((docSnapshot) => {
            const data = asRecord(docSnapshot.data());
            return data ? normalizeDailyBucket(docSnapshot.id, data) : null;
          })
          .filter((item): item is AdminMetricsDailyBucket => item !== null)
          .sort((left, right) => left.dateKey.localeCompare(right.dateKey));
        setDailyBuckets(next);
        setError(null);
        markReady("daily");
      },
      (snapshotError) => {
        console.error("Failed loading admin metrics trends", snapshotError);
        setError("Unable to load trend data right now.");
        setLoading(false);
      }
    );

    const unsubscribeHosts = onSnapshot(
      hostsQuery,
      (snapshot) => {
        const next = snapshot.docs
          .map((docSnapshot) => {
            const data = asRecord(docSnapshot.data());
            return data ? normalizeHost(docSnapshot.id, data) : null;
          })
          .filter((item): item is AdminMetricsHost => item !== null);
        setTopHosts(next);
        setError(null);
        markReady("hosts");
      },
      (snapshotError) => {
        console.error("Failed loading admin metrics hosts", snapshotError);
        setError("Unable to load host leaderboard data.");
        setLoading(false);
      }
    );

    const unsubscribeTailgates = onSnapshot(
      tailgatesQuery,
      (snapshot) => {
        const now = Date.now();
        const next = snapshot.docs
          .map((docSnapshot) => {
            const data = asRecord(docSnapshot.data());
            return data ? normalizeTailgate(docSnapshot.id, data) : null;
          })
          .filter((item): item is AdminMetricsTailgate => item !== null)
          .filter((item) => !item.isCancelled)
          .filter((item) => !item.startTime || item.startTime.getTime() >= now)
          .sort((left, right) => {
            const leftSize = left.estimatedSize ?? -1;
            const rightSize = right.estimatedSize ?? -1;
            return rightSize - leftSize;
          })
          .slice(0, 6);
        setLargestUpcomingTailgates(next);
        setError(null);
        markReady("tailgates");
      },
      (snapshotError) => {
        console.error("Failed loading admin metrics tailgates", snapshotError);
        setError("Unable to load upcoming tailgate leaderboard data.");
        setLoading(false);
      }
    );

    const unsubscribeActivity = onSnapshot(
      activityQuery,
      (snapshot) => {
        const next = snapshot.docs
          .map((docSnapshot) => {
            const data = asRecord(docSnapshot.data());
            return data ? normalizeActivity(docSnapshot.id, data) : null;
          })
          .filter((item): item is AdminMetricsActivity => item !== null);
        setRecentActivity(next);
        setError(null);
        markReady("activity");
      },
      (snapshotError) => {
        console.error("Failed loading admin metrics activity", snapshotError);
        setError("Unable to load recent platform activity.");
        setLoading(false);
      }
    );

    return () => {
      unsubscribeSummary();
      unsubscribeDaily();
      unsubscribeHosts();
      unsubscribeTailgates();
      unsubscribeActivity();
    };
  }, [adminLoading, isAdmin]);

  if (!db && !error) {
    return {
      ...EMPTY_DATA,
      loading
    };
  }

  return {
    summary,
    dailyBuckets,
    topHosts,
    largestUpcomingTailgates,
    recentActivity,
    loading,
    error
  };
}

import { useCallback, useEffect, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../lib/firebase";
import { useAuth } from "./useAuth";

export type AnalyticsRangePreset = "last_7_days" | "last_30_days" | "this_season" | "custom";

export type PaidAnalyticsSummary = {
  views: number;
  checkoutStarts: number;
  completedOrders: number;
  ticketsSold: number;
  grossRevenueCents: number;
  platformFeeRevenueCents: number;
  viewConversionRate: number | null;
  checkoutConversionRate: number | null;
};

export type PaidAnalyticsFunnelStage = {
  name: string;
  eventCount: number;
  uniqueUsers: number;
  nextStageRate: number | null;
  dropOffRate: number | null;
};

export type PaidAnalyticsSource = {
  source: string;
  views: number;
  checkoutStarts: number;
  purchases: number;
  revenueCents: number;
  conversionRate: number | null;
};

export type PaidAnalyticsTicketType = {
  ticketTypeId: string;
  name: string;
  priceCents: number;
  ticketsSold: number;
  revenueCents: number;
  salesShare: number | null;
};

export type PaidAnalyticsEvent = {
  id: string;
  eventName: string;
  gameContext: string;
  hostId: string;
  hostName: string;
  eventDate: string | null;
  impressions: number;
  views: number;
  ticketSelections: number;
  checkoutStarts: number;
  completedOrders: number;
  ticketsSold: number;
  grossRevenueCents: number;
  platformFeeRevenueCents: number;
  conversionRate: number | null;
  checkoutConversionRate: number | null;
  ticketTypePerformance: PaidAnalyticsTicketType[];
  sources: PaidAnalyticsSource[];
};

export type PaidAnalyticsHost = {
  hostId: string;
  hostName: string;
  paidEvents: number;
  views: number;
  checkoutStarts: number;
  orders: number;
  ticketsSold: number;
  grossRevenueCents: number;
  conversionRate: number | null;
};

export type PaidAnalyticsTrend = {
  date: string;
  views: number;
  checkoutStarts: number;
  purchases: number;
  grossRevenueCents: number;
};

export type PaidTailgateAnalyticsDashboard = {
  range: { preset: AnalyticsRangePreset; start: string; end: string };
  analyticsStartedAt: string | null;
  summary: PaidAnalyticsSummary;
  funnel: PaidAnalyticsFunnelStage[];
  events: PaidAnalyticsEvent[];
  hosts: PaidAnalyticsHost[];
  sources: PaidAnalyticsSource[];
  trends: PaidAnalyticsTrend[];
  truncated: boolean;
};

type RangeInput = { preset: AnalyticsRangePreset; start?: string; end?: string };

export function usePaidTailgateAnalyticsDashboard(range: RangeInput) {
  const { isAdmin, adminLoading } = useAuth();
  const [data, setData] = useState<PaidTailgateAnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);

  const refresh = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    if (adminLoading) return;
    if (!isAdmin) {
      setData(null);
      setLoading(false);
      setError("Administrator access is required.");
      return;
    }
    if (!functions) {
      setData(null);
      setLoading(false);
      setError("Paid-event analytics are unavailable in this environment.");
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);
    const loadDashboard = httpsCallable<RangeInput, PaidTailgateAnalyticsDashboard>(
      functions,
      "getPaidTailgateAnalyticsDashboard"
    );
    void loadDashboard(range)
      .then((result) => {
        if (!active) return;
        setData(result.data);
      })
      .catch((reason) => {
        console.error("Failed loading paid tailgate analytics dashboard", reason);
        if (active) setError("Unable to load paid-event analytics right now.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [adminLoading, isAdmin, range, revision]);

  return { data, loading, error, refresh };
}

import { useCallback, useEffect, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions as firebaseFunctions } from "../lib/firebase";

export type HostPayoutHistoryItem = {
  payoutId: string;
  tailgateId: string | null;
  eventName: string;
  amountCents: number;
  currency: string;
  status: string;
  ticketCount: number;
  createdAtIso: string | null;
  processedAtIso: string | null;
  stripeTransferId: string | null;
};

const EMPTY_HISTORY: HostPayoutHistoryItem[] = [];

function parseNonNegativeInteger(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.round(parsed));
}

function parseNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function useHostPayoutHistory(hostUserId?: string | null) {
  const [items, setItems] = useState<HostPayoutHistoryItem[]>(EMPTY_HISTORY);
  const [loading, setLoading] = useState<boolean>(Boolean(hostUserId));
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!hostUserId || !firebaseFunctions) {
      setItems(EMPTY_HISTORY);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const getHostPayoutHistoryFn = httpsCallable(
        firebaseFunctions,
        "getHostPayoutHistory"
      );
      const result = await getHostPayoutHistoryFn({ hostUserId });
      const rawItems =
        (result.data as { items?: unknown[] } | undefined)?.items ?? [];

      const normalized = rawItems
        .map((entry): HostPayoutHistoryItem | null => {
          if (!entry || typeof entry !== "object") {
            return null;
          }

          const row = entry as Record<string, unknown>;
          const payoutId = parseNonEmptyString(row.payoutId);
          if (!payoutId) {
            return null;
          }

          return {
            payoutId,
            tailgateId: parseNonEmptyString(row.tailgateId),
            eventName: parseNonEmptyString(row.eventName) ?? "Unknown tailgate",
            amountCents: parseNonNegativeInteger(row.amountCents),
            currency: parseNonEmptyString(row.currency)?.toUpperCase() ?? "USD",
            status: parseNonEmptyString(row.status)?.toLowerCase() ?? "unknown",
            ticketCount: parseNonNegativeInteger(row.ticketCount),
            createdAtIso: parseNonEmptyString(row.createdAtIso),
            processedAtIso: parseNonEmptyString(row.processedAtIso),
            stripeTransferId: parseNonEmptyString(row.stripeTransferId)
          };
        })
        .filter((row): row is HostPayoutHistoryItem => row !== null);

      setItems(normalized);
    } catch (fetchError) {
      console.error("[useHostPayoutHistory] Failed to load payout history", fetchError);
      setItems(EMPTY_HISTORY);
      setError("Unable to load payout history right now.");
    } finally {
      setLoading(false);
    }
  }, [hostUserId]);

  useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  return {
    items,
    loading,
    error,
    refetch: () => {
      void fetchHistory();
    }
  };
}

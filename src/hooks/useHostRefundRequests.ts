import { useCallback, useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit as firestoreLimit,
  query,
  where
} from "firebase/firestore";
import {
  HostRefundRequest,
  ListHostRefundRequestsInput,
  getRefundErrorMessage,
  listHostRefundRequests
} from "../services/refunds";
import { db } from "../lib/firebase";

type UseHostRefundRequestsFilters = ListHostRefundRequestsInput & {
  enabled?: boolean;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function coerceNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function coerceDollarsToCents(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    if (!Number.isInteger(value)) return Math.round(value * 100);
    return undefined;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const normalized = trimmed.replace(/[$,\s]/g, "");
    if (!normalized.includes(".")) return undefined;
    const parsed = Number(normalized);
    if (!Number.isFinite(parsed)) return undefined;
    return Math.round(parsed * 100);
  }
  return undefined;
}

function resolveAmountFromTicketRecord(raw: Record<string, unknown>) {
  const refundRecord = asRecord(raw.refund);
  const quantityRaw = coerceNumber(raw.quantity) ?? 1;
  const quantity =
    Number.isFinite(quantityRaw) && quantityRaw > 0 ? Math.max(1, Math.floor(quantityRaw)) : 1;

  const centsCandidates = [
    raw.refundAmountCentsApproved,
    raw.refundAmountCentsRequested,
    raw.refundAmountCents,
    raw.amountCents,
    raw.ticketAmountCents,
    raw.totalPaidCents,
    raw.amountPaidCents,
    raw.totalAmountCents,
    raw.chargeAmountCents,
    refundRecord?.amountCents,
    refundRecord?.refundAmountCents,
    refundRecord?.refundAmountCentsApproved,
    refundRecord?.refundAmountCentsRequested
  ];
  const cents = centsCandidates
    .map((value) => coerceNumber(value))
    .find((value): value is number => typeof value === "number");
  if (typeof cents === "number") return cents;

  const dollarCandidates = [
    raw.refundAmount,
    raw.amount,
    raw.ticketAmount,
    raw.totalPaid,
    raw.amountPaid,
    raw.totalAmount,
    refundRecord?.amount,
    refundRecord?.refundAmount
  ];
  const centsFromDollars = dollarCandidates
    .map((value) => coerceDollarsToCents(value))
    .find((value): value is number => typeof value === "number");
  if (typeof centsFromDollars === "number") return centsFromDollars;

  const ticketPriceCents = coerceNumber(raw.ticketPriceCents);
  if (typeof ticketPriceCents === "number") {
    return ticketPriceCents * quantity;
  }

  return undefined;
}

async function findTicketAmountCents(ticketId: string): Promise<number | undefined> {
  if (!db) return undefined;

  const collectionsToCheck = ["tickets", "tailgateTickets"] as const;

  for (const collectionName of collectionsToCheck) {
    const direct = await getDoc(doc(db, collectionName, ticketId));
    if (direct.exists()) {
      const data = direct.data() as Record<string, unknown>;
      const amount = resolveAmountFromTicketRecord(data);
      if (typeof amount === "number") return amount;
    }

    const byTicketIdQuery = query(
      collection(db, collectionName),
      where("ticketId", "==", ticketId),
      firestoreLimit(1)
    );
    const byTicketIdSnapshot = await getDocs(byTicketIdQuery);
    if (!byTicketIdSnapshot.empty) {
      const data = byTicketIdSnapshot.docs[0].data() as Record<string, unknown>;
      const amount = resolveAmountFromTicketRecord(data);
      if (typeof amount === "number") return amount;
    }
  }

  return undefined;
}

async function enrichMissingAmounts(requests: HostRefundRequest[]): Promise<HostRefundRequest[]> {
  if (!db) return requests;
  const missing = requests.filter((request) => typeof request.amountCents !== "number");
  if (missing.length === 0) return requests;

  const cache: Record<string, number | null> = {};
  await Promise.all(
    missing.map(async (request) => {
      if (request.ticketId in cache) return;
      const amount = await findTicketAmountCents(request.ticketId);
      cache[request.ticketId] = typeof amount === "number" ? amount : null;
    })
  );

  return requests.map((request) => {
    if (typeof request.amountCents === "number") return request;
    const fallbackAmount = cache[request.ticketId];
    if (typeof fallbackAmount !== "number") return request;
    return {
      ...request,
      amountCents: fallbackAmount
    };
  });
}

export function useHostRefundRequests(filters: UseHostRefundRequestsFilters) {
  const [requests, setRequests] = useState<HostRefundRequest[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const status = filters.status;
  const tailgateId = filters.tailgateId;
  const limit = filters.limit;
  const cursor = filters.cursor;
  const enabled = filters.enabled ?? true;

  const refresh = useCallback(() => {
    setRefreshKey((previous) => previous + 1);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setRequests([]);
      setNextCursor(undefined);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    void (async () => {
      try {
        const result = await listHostRefundRequests({
          status,
          tailgateId,
          limit,
          cursor
        });
        if (cancelled) return;
        console.log("[refunds] listHostRefundRequests raw", {
          filters: { status, tailgateId, limit, cursor },
          raw: result.raw,
          requests: result.requests
        });
        const enrichedRequests = await enrichMissingAmounts(result.requests);
        if (cancelled) return;
        console.log("[refunds] host refund requests enriched", {
          filters: { status, tailgateId, limit, cursor },
          requests: enrichedRequests
        });
        setRequests(enrichedRequests);
        setNextCursor(result.nextCursor);
        setLoading(false);
        setError(null);
      } catch (requestError) {
        if (cancelled) return;
        setRequests([]);
        setNextCursor(undefined);
        setLoading(false);
        setError(getRefundErrorMessage(requestError));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [cursor, enabled, limit, refreshKey, status, tailgateId]);

  return {
    requests,
    nextCursor,
    loading,
    error,
    refresh
  };
}

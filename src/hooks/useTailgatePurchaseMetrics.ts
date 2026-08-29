import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  isSuccessfulTicketPurchase,
  resolveTailgatePurchaseTailgateId,
  resolveTicketPurchaseAmountCents,
  resolveTicketPurchaseQuantity,
  resolveTicketPurchaseStatus,
  resolveTicketPurchaseTicketTypeId
} from "../utils/ticketPurchases";

export type TailgatePurchaseMetrics = {
  grossRevenueCents: number;
  purchaseCount: number;
  quantitySold: number;
  quantitySoldByTicketType: Record<string, number>;
};

type RawPurchaseRecord = {
  id: string;
  data: Record<string, unknown>;
};

const EMPTY_METRICS = new Map<string, TailgatePurchaseMetrics>();

const chunkValues = (values: string[], chunkSize: number) => {
  const chunks: string[][] = [];
  for (let index = 0; index < values.length; index += chunkSize) {
    chunks.push(values.slice(index, index + chunkSize));
  }
  return chunks;
};

export function useTailgatePurchaseMetrics(tailgateIds?: string[]) {
  const [metricsByTailgate, setMetricsByTailgate] =
    useState<Map<string, TailgatePurchaseMetrics>>(EMPTY_METRICS);

  const normalizedIds = useMemo(
    () =>
      Array.from(
        new Set((tailgateIds ?? []).filter((value): value is string => typeof value === "string" && value.trim().length > 0))
      ).sort(),
    [tailgateIds]
  );

  useEffect(() => {
    if (!db || normalizedIds.length === 0) {
      setMetricsByTailgate(EMPTY_METRICS);
      return;
    }

    const idSet = new Set(normalizedIds);
    const snapshots = new Map<string, RawPurchaseRecord[]>();
    const recomputeMetrics = () => {
      const dedupedPurchases = new Map<string, RawPurchaseRecord>();
      snapshots.forEach((rows) => {
        rows.forEach((row) => {
          dedupedPurchases.set(row.id, row);
        });
      });

      const next = new Map<string, TailgatePurchaseMetrics>();
      dedupedPurchases.forEach((row) => {
        const tailgateId = resolveTailgatePurchaseTailgateId(row.data);
        if (!tailgateId || !idSet.has(tailgateId)) {
          return;
        }
        const status = resolveTicketPurchaseStatus(row.data);
        if (!isSuccessfulTicketPurchase(status)) {
          return;
        }

        const current = next.get(tailgateId) ?? {
          grossRevenueCents: 0,
          purchaseCount: 0,
          quantitySold: 0,
          quantitySoldByTicketType: {}
        };
        const quantity = resolveTicketPurchaseQuantity(row.data);
        current.grossRevenueCents += resolveTicketPurchaseAmountCents(row.data);
        current.purchaseCount += 1;
        current.quantitySold += quantity;
        const ticketTypeId = resolveTicketPurchaseTicketTypeId(row.data);
        if (ticketTypeId) {
          current.quantitySoldByTicketType[ticketTypeId] =
            (current.quantitySoldByTicketType[ticketTypeId] ?? 0) + quantity;
        }
        next.set(tailgateId, current);
      });

      setMetricsByTailgate(next);
    };

    const purchaseFields = ["tailgateId", "tailgateEventId"] as const;
    const unsubscribers = purchaseFields.flatMap((field) =>
      chunkValues(normalizedIds, 10).map((chunk, index) => {
        const purchaseQuery =
          chunk.length === 1
            ? query(collection(db, "ticketPurchases"), where(field, "==", chunk[0]))
            : query(collection(db, "ticketPurchases"), where(field, "in", chunk));
        const snapshotKey = `${field}:${index}`;

        return onSnapshot(
          purchaseQuery,
          (snapshot) => {
            snapshots.set(
              snapshotKey,
              snapshot.docs.map((docSnapshot) => ({
                id: docSnapshot.id,
                data: docSnapshot.data() as Record<string, unknown>
              }))
            );
            recomputeMetrics();
          },
          (snapshotError) => {
            console.error("Failed loading tailgate purchase metrics", snapshotError);
            snapshots.set(snapshotKey, []);
            recomputeMetrics();
          }
        );
      })
    );

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [normalizedIds]);

  return metricsByTailgate;
}

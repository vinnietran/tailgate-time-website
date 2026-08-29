import {
  summarizeTicketPricing,
  type EventTicketType,
  type TicketPricingSummary
} from "../features/ticketing/ticketTypes";
import { TailgateEvent, TailgateStatus, VisibilityType } from "../types";
import { formatCurrencyFromCents } from "./format";

export function getVisibilityLabel(type: VisibilityType) {
  switch (type) {
    case "private":
      return "Invite Only";
    case "open_free":
      return "Open • Free";
    case "open_paid":
      return "Open • Paid";
    default:
      return "Invite Only";
  }
}

export function getEventStatus(event: TailgateEvent, now = new Date()): TailgateStatus {
  const status = ((event.status ?? "") as string).toLowerCase();

  if (status === "cancelled" || status === "canceled" || status.startsWith("cancel")) {
    return "cancelled";
  }

  if (status === "live") {
    return "live";
  }

  if (event.startDateTime.getTime() < now.getTime()) {
    return "past";
  }

  return "upcoming";
}

export function getTailgateCrowdTag(count: number): string {
  const safeCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;

  if (safeCount <= 4) {
    return "Small • Tight Crew";
  }
  if (safeCount <= 19) {
    return "Medium • Lot Buzz";
  }
  if (safeCount <= 49) {
    return "Large • Full Tailgate";
  }
  return "XL • Packed House";
}

export function buildEventSizeSummary(input: {
  visibilityType: VisibilityType;
  confirmedCount: number;
  ticketPriceCents?: number | null;
  ticketTypes?: EventTicketType[];
}) {
  const summary = `Event size: ${getTailgateCrowdTag(input.confirmedCount)}`;
  if (input.visibilityType !== "open_paid") {
    return summary;
  }
  const pricingSummary = summarizeTicketPricing(input.ticketTypes ?? [], input.ticketPriceCents);
  const pricingLabel = formatTicketPricingLabel(pricingSummary, "from");
  return pricingLabel ? `${summary} · ${pricingLabel}` : summary;
}

export function estimateHostPayout({
  ticketsSold,
  ticketPriceCents,
  grossRevenueCents,
  purchaseCount,
  platformFeeCents,
  platformFeeRate = 0.1,
  stripeFeePercent = 0.029,
  stripeFeeFixed = 30
}: {
  ticketsSold?: number;
  ticketPriceCents?: number;
  grossRevenueCents?: number;
  purchaseCount?: number;
  platformFeeCents?: number;
  platformFeeRate?: number;
  stripeFeePercent?: number;
  stripeFeeFixed?: number;
}) {
  const sold = ticketsSold ?? 0;
  const price = ticketPriceCents ?? 0;
  const gross =
    typeof grossRevenueCents === "number" && Number.isFinite(grossRevenueCents) && grossRevenueCents >= 0
      ? Math.round(grossRevenueCents)
      : sold * price;
  const transactionCount =
    typeof purchaseCount === "number" && Number.isFinite(purchaseCount) && purchaseCount > 0
      ? Math.max(0, Math.round(purchaseCount))
      : sold > 0
      ? 1
      : 0;
  const platformFee =
    typeof platformFeeCents === "number" && Number.isFinite(platformFeeCents) && platformFeeCents >= 0
      ? Math.round(platformFeeCents)
      : gross * platformFeeRate;
  const stripeFee = transactionCount > 0 ? gross * stripeFeePercent + transactionCount * stripeFeeFixed : 0;
  const payout = Math.max(gross - platformFee - stripeFee, 0);

  return {
    gross,
    platformFee,
    stripeFee,
    payout
  };
}

export function formatTicketPricingLabel(
  pricingSummary: TicketPricingSummary | null,
  variant: "from" | "range" | "single" = "single"
) {
  if (!pricingSummary) {
    return null;
  }

  if (!pricingSummary.hasVariablePricing) {
    return `${formatCurrencyFromCents(pricingSummary.minPriceCents)} per person`;
  }

  if (variant === "from") {
    return `From ${formatCurrencyFromCents(pricingSummary.minPriceCents)}`;
  }

  if (variant === "range") {
    return `${formatCurrencyFromCents(pricingSummary.minPriceCents)}-${formatCurrencyFromCents(
      pricingSummary.maxPriceCents
    )} ticket tiers`;
  }

  return `${formatCurrencyFromCents(pricingSummary.minPriceCents)} per person`;
}

export function buildTailgatePricingSummary(event: Pick<TailgateEvent, "ticketTypes" | "ticketPriceCents">) {
  return summarizeTicketPricing(
    Array.isArray(event.ticketTypes) ? (event.ticketTypes as EventTicketType[]) : [],
    event.ticketPriceCents
  );
}

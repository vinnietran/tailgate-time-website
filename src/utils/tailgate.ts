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
}) {
  const summary = `Event size: ${getTailgateCrowdTag(input.confirmedCount)}`;
  if (input.visibilityType !== "open_paid" || typeof input.ticketPriceCents !== "number") {
    return summary;
  }
  return `${summary} · ${formatCurrencyFromCents(input.ticketPriceCents)} per person`;
}

export function estimateHostPayout({
  ticketsSold,
  ticketPriceCents,
  platformFeeRate = 0.1,
  stripeFeePercent = 0.029,
  stripeFeeFixed = 30
}: {
  ticketsSold?: number;
  ticketPriceCents?: number;
  platformFeeRate?: number;
  stripeFeePercent?: number;
  stripeFeeFixed?: number;
}) {
  const sold = ticketsSold ?? 0;
  const price = ticketPriceCents ?? 0;
  const gross = sold * price;
  const platformFee = gross * platformFeeRate;
  const stripeFee = sold > 0 ? gross * stripeFeePercent + stripeFeeFixed : 0;
  const payout = Math.max(gross - platformFee - stripeFee, 0);

  return {
    gross,
    platformFee,
    stripeFee,
    payout
  };
}

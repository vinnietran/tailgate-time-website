import { TailgateEvent, TailgateStatus, VisibilityType } from "../types";

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

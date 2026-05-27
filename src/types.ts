export type VisibilityType = "private" | "open_free" | "open_paid";

export type TailgateStatus = "upcoming" | "past" | "live" | "cancelled";

export type TailgateEvent = {
  id: string;
  hostUserId: string;
  name: string;
  visibilityType: VisibilityType;
  startDateTime: Date;
  endDateTime?: Date | null;
  coverImageUrl?: string;
  locationSummary?: string;
  capacity?: number;
  ticketPriceCents?: number;
  ticketsSold?: number;
  grossRevenueCents?: number;
  platformFeeRevenueCents?: number;
  purchaseCount?: number;
  rsvpsConfirmed?: number;
  rsvpsPending?: number;
  currency?: string;
  ticketTypes?: unknown;
  status?: TailgateStatus | string;
  payoutStatus?: "pending" | "sent";
};

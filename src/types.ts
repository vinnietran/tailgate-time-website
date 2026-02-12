export type VisibilityType = "private" | "open_free" | "open_paid";

export type TailgateStatus = "upcoming" | "past" | "live" | "cancelled";

export type TailgateEvent = {
  id: string;
  hostUserId: string;
  name: string;
  visibilityType: VisibilityType;
  startDateTime: Date;
  coverImageUrl?: string;
  locationSummary?: string;
  capacity?: number;
  ticketPriceCents?: number;
  ticketsSold?: number;
  rsvpsConfirmed?: number;
  rsvpsPending?: number;
  status?: TailgateStatus | string;
  payoutStatus?: "pending" | "sent";
};

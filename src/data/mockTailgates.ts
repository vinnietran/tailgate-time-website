import { TailgateEvent } from "../types";

const now = new Date();
const day = 24 * 60 * 60 * 1000;

export const mockTailgates: TailgateEvent[] = [
  {
    id: "tg-001",
    hostUserId: "dev-host-001",
    name: "Sunday Tailgate vs. Chiefs",
    visibilityType: "open_paid",
    startDateTime: new Date(now.getTime() + day * 6),
    locationSummary: "Gold Lot 1, Chuck Noll Way, Pittsburgh, PA",
    capacity: 120,
    ticketPriceCents: 3500,
    ticketsSold: 84,
    rsvpsConfirmed: 84,
    rsvpsPending: 12,
    status: "upcoming",
    payoutStatus: "pending"
  },
  {
    id: "tg-002",
    hostUserId: "dev-host-001",
    name: "Thursday Night Pre-Game Social",
    visibilityType: "open_free",
    startDateTime: new Date(now.getTime() + day * 2),
    locationSummary: "Riverside Lot B, North Shore, Pittsburgh, PA",
    capacity: 80,
    rsvpsConfirmed: 56,
    rsvpsPending: 9,
    status: "upcoming"
  },
  {
    id: "tg-003",
    hostUserId: "dev-host-001",
    name: "Classic Rivalry Tailgate",
    visibilityType: "private",
    startDateTime: new Date(now.getTime() - day * 12),
    locationSummary: "Lot 4, Stadium Drive, Pittsburgh, PA",
    capacity: 50,
    rsvpsConfirmed: 42,
    rsvpsPending: 0,
    status: "past"
  }
];

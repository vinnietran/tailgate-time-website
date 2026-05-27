import { VisibilityType } from "../../types";

export type StripeConnectStatus =
  | "not_started"
  | "pending"
  | "complete"
  | "restricted";

export const MIN_TICKET_PRICE_CENTS = 2500;

export function resolveVisibilityType(raw: unknown): VisibilityType {
  if (raw === "open_free" || raw === "open_paid" || raw === "private") {
    return raw;
  }
  return "private";
}

export function resolveStripeConnectStatus(
  data: Record<string, unknown> | null
): StripeConnectStatus {
  const raw = data?.stripeConnectStatus;
  if (raw === "pending" || raw === "complete" || raw === "restricted") {
    return raw;
  }
  return "not_started";
}

export function isPayoutReady(data: Record<string, unknown> | null): boolean {
  if (!data) return false;
  return (
    typeof data.stripeConnectAccountId === "string" &&
    data.stripeConnectAccountId.length > 0 &&
    data.stripeConnectStatus === "complete" &&
    data.payoutsEnabled === true
  );
}

export function parsePriceInputToCents(value: string): number | null {
  const normalized = value.replace(/[^0-9.]/g, "");
  if (!normalized) return null;
  const parts = normalized.split(".");
  if (parts.length > 2) return null;
  const dollarsPart = parts[0] ?? "";
  const centsPart = parts[1] ?? "";
  const dollars = dollarsPart ? parseInt(dollarsPart, 10) : 0;
  if (!Number.isFinite(dollars)) return null;
  if (centsPart.length > 2) return null;
  const centsNormalized = centsPart.padEnd(2, "0");
  const cents = centsNormalized ? parseInt(centsNormalized, 10) : 0;
  if (!Number.isFinite(cents)) return null;
  return dollars * 100 + cents;
}

export function formatPriceInput(priceCents: number): string {
  if (!Number.isFinite(priceCents)) return "";
  if (priceCents % 100 === 0) return String(priceCents / 100);
  return (priceCents / 100).toFixed(2);
}

export function parseCapacityInput(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d+$/.test(trimmed)) return null;
  const parsed = parseInt(trimmed, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseTicketSalesCutoffDaysInput(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  if (!/^\d+$/.test(trimmed)) return null;
  const parsed = parseInt(trimmed, 10);
  if (!Number.isFinite(parsed)) return null;
  if (parsed < 0 || parsed > 365) return null;
  return parsed;
}

export function parseGuestPlusLimitInput(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d+$/.test(trimmed)) return null;
  const parsed = parseInt(trimmed, 10);
  if (!Number.isFinite(parsed)) return null;
  return Math.max(1, Math.min(parsed, 12));
}

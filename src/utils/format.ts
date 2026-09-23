import { validTimeZone } from "./eventTimeZone";

function isValidDate(value: Date | null | undefined): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

function formatDateLabel(date: Date, timeZone?: string) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "short", day: "numeric", timeZone }).format(date);
}

function formatTimeLabel(date: Date, timeZone?: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric", minute: "2-digit", timeZone, ...(timeZone ? { timeZoneName: "short" as const } : {})
  }).format(date);
}

export function formatDateTime(date: Date, timeZone?: string) {
  const zone = validTimeZone(timeZone);
  return `${formatDateLabel(date, zone)} · ${formatTimeLabel(date, zone)}`;
}

export function formatTimeRange(startDate: Date | null | undefined, endDate?: Date | null, timeZone?: string) {
  if (!isValidDate(startDate)) return "TBD";
  const zone = validTimeZone(timeZone);
  if (!isValidDate(endDate) || startDate.getTime() === endDate.getTime()) return formatTimeLabel(startDate, zone);
  return `${formatTimeLabel(startDate, zone)} - ${formatTimeLabel(endDate, zone)}`;
}

export function formatDateTimeRange(startDate: Date | null | undefined, endDate?: Date | null, timeZone?: string) {
  if (!isValidDate(startDate)) return "Date TBD";
  const zone = validTimeZone(timeZone);
  if (!isValidDate(endDate) || startDate.getTime() === endDate.getTime()) return formatDateTime(startDate, zone);
  const dayFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "numeric", day: "numeric", timeZone: zone });
  if (dayFormatter.format(startDate) === dayFormatter.format(endDate)) {
    return `${formatDateLabel(startDate, zone)} · ${formatTimeRange(startDate, endDate, zone)}`;
  }
  return `${formatDateTime(startDate, zone)} - ${formatDateTime(endDate, zone)}`;
}

export function formatCurrencyFromCents(valueCents?: number) {
  const value = (valueCents ?? 0) / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatCurrencyFromCentsExact(valueCents?: number) {
  const value = (valueCents ?? 0) / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function getFirstName(nameOrEmail?: string | null) {
  if (!nameOrEmail) return "Host";
  const trimmed = nameOrEmail.trim();
  if (!trimmed) return "Host";
  if (trimmed.includes("@")) {
    return trimmed.split("@")[0];
  }
  return trimmed.split(" ")[0];
}

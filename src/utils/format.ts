function isValidDate(value: Date | null | undefined): value is Date {
  return Boolean(value) && !Number.isNaN(value.getTime());
}

function isSameDay(start: Date, end: Date) {
  return (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate()
  );
}

function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric"
  }).format(date);
}

function formatTimeLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

export function formatDateTime(date: Date) {
  return `${formatDateLabel(date)} · ${formatTimeLabel(date)}`;
}

export function formatTimeRange(startDate: Date | null | undefined, endDate?: Date | null) {
  if (!isValidDate(startDate)) return "TBD";
  if (!isValidDate(endDate) || startDate.getTime() === endDate.getTime()) {
    return formatTimeLabel(startDate);
  }
  return `${formatTimeLabel(startDate)} - ${formatTimeLabel(endDate)}`;
}

export function formatDateTimeRange(startDate: Date | null | undefined, endDate?: Date | null) {
  if (!isValidDate(startDate)) return "Date TBD";
  if (!isValidDate(endDate) || startDate.getTime() === endDate.getTime()) {
    return formatDateTime(startDate);
  }
  if (isSameDay(startDate, endDate)) {
    return `${formatDateLabel(startDate)} · ${formatTimeRange(startDate, endDate)}`;
  }
  return `${formatDateTime(startDate)} - ${formatDateTime(endDate)}`;
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

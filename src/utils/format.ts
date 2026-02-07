export function formatDateTime(date: Date) {
  const datePart = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric"
  }).format(date);

  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);

  return `${datePart} · ${timePart}`;
}

export function formatCurrencyFromCents(valueCents?: number) {
  const value = (valueCents ?? 0) / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
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

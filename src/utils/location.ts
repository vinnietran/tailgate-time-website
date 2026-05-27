const PIN_DROPPED_LOCATION_MESSAGE =
  "Precise Tailgate Location Dropped! Use your phone's map for easy navigation directly to the spot!";

function normalizeText(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.replace(/\s+/g, " ").trim();
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function firstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

function joinLocationLabel(name: string, address: string): string {
  if (!name) {
    return address;
  }
  if (!address) {
    return name;
  }
  if (name === address) {
    return name;
  }
  return `${name} · ${address}`;
}

export function resolveLocationLabel(raw: unknown): string {
  if (!raw) {
    return "";
  }

  if (typeof raw === "string") {
    return normalizeText(raw);
  }

  const record = asRecord(raw);
  if (!record) {
    return "";
  }

  const pin = asRecord(record.pin);
  if (
    typeof pin?.lat === "number" &&
    typeof pin?.lng === "number"
  ) {
    return PIN_DROPPED_LOCATION_MESSAGE;
  }

  const name = firstString(
    record.businessName,
    record.placeName,
    record.locationName,
    record.siteName,
    record.venueName,
    record.lotName,
    record.mainText,
    record.displayName,
    record.primaryText,
    record.name
  );
  const address = firstString(
    record.addressLine1,
    record.address1,
    record.displayAddress,
    record.shortFormattedAddress,
    record.formattedAddress,
    record.formatted,
    record.description,
    record.text,
    record.secondaryText,
    record.locality,
    record.address
  );
  const combined = joinLocationLabel(name ?? "", address ?? "");
  if (combined) {
    return combined;
  }

  const fallback = firstString(
    record.locationSummary,
    record.locationLabel,
    record.label
  );
  return fallback ?? "";
}

export { PIN_DROPPED_LOCATION_MESSAGE };

export const DEFAULT_TICKET_TYPE_ID = "default-ticket-type";
export const DEFAULT_TICKET_TYPE_NAME = "General Admission";
export const MAX_TICKET_TYPES = 10;
export const MIN_TICKET_TYPES = 1;

export type EventTicketType = {
  id: string;
  name: string;
  description?: string;
  priceCents: number;
  currency: string;
  quantityAvailable?: number | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: unknown;
  updatedAt: unknown;
};

export type TicketPricingSummary = {
  activeTypeCount: number;
  distinctPriceCount: number;
  minPriceCents: number;
  maxPriceCents: number;
  hasVariablePricing: boolean;
};

type TicketTypeLike = Partial<EventTicketType> & {
  priceCents?: unknown;
  currency?: unknown;
  quantityAvailable?: unknown;
  availableQuantity?: unknown;
  capacity?: unknown;
  quantity?: unknown;
  ticketCapacity?: unknown;
  maxTickets?: unknown;
  totalAvailable?: unknown;
  sortOrder?: unknown;
  isActive?: unknown;
};

type ResolveTicketTypesOptions = {
  visibilityType?: unknown;
  eventId?: string | null;
  priceCents?: unknown;
  currency?: unknown;
  capacity?: unknown;
  ticketTypes?: unknown;
};

const normalizeText = (value: unknown): string =>
  typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";

const limitInputText = (value: unknown, maxLength: number): string =>
  typeof value === "string" ? value.slice(0, maxLength) : "";

const coercePositiveInteger = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.floor(value);
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      return Math.floor(parsed);
    }
  }
  return null;
};

const coerceCurrency = (value: unknown, fallback = "USD"): string => {
  const normalized = normalizeText(value).toUpperCase();
  return normalized || fallback;
};

const resolveTicketTypeId = (rawId: unknown, fallbackId: string, index: number): string => {
  const normalized = normalizeText(rawId);
  if (normalized) {
    return normalized;
  }
  return index === 0 ? fallbackId : `${fallbackId}-${index + 1}`;
};

export const sanitizeTicketTypeName = (value: unknown): string =>
  normalizeText(value).slice(0, 60);

export const sanitizeTicketTypeDescription = (value: unknown): string =>
  normalizeText(value).slice(0, 240);

export const limitTicketTypeNameInput = (value: unknown): string =>
  limitInputText(value, 60);

export const limitTicketTypeDescriptionInput = (value: unknown): string =>
  limitInputText(value, 240);

export const createDefaultTicketType = (input?: {
  eventId?: string | null;
  priceCents?: unknown;
  currency?: unknown;
  capacity?: unknown;
  now?: unknown;
}): EventTicketType => {
  const now = input?.now ?? new Date();
  return {
    id: input?.eventId
      ? `${DEFAULT_TICKET_TYPE_ID}-${normalizeText(input.eventId)}`
      : DEFAULT_TICKET_TYPE_ID,
    name: DEFAULT_TICKET_TYPE_NAME,
    description: "",
    priceCents: coercePositiveInteger(input?.priceCents) ?? 0,
    currency: coerceCurrency(input?.currency, "USD"),
    quantityAvailable: coercePositiveInteger(input?.capacity),
    sortOrder: 0,
    isActive: true,
    createdAt: now,
    updatedAt: now
  };
};

export const normalizeTicketTypeRecord = (
  raw: TicketTypeLike,
  index: number,
  fallback: EventTicketType
): EventTicketType => {
  const priceCents =
    coercePositiveInteger(raw.priceCents) ??
    coercePositiveInteger(fallback.priceCents) ??
    0;
  const quantityCandidates = [
    raw.quantityAvailable,
    raw.availableQuantity,
    raw.capacity,
    raw.quantity,
    raw.ticketCapacity,
    raw.maxTickets,
    raw.totalAvailable
  ];
  const quantityAvailable =
    quantityCandidates.some((value) => value === null)
      ? null
      : quantityCandidates
            .map((value) => coercePositiveInteger(value))
            .find((value): value is number => typeof value === "number") ??
        fallback.quantityAvailable ??
        null;
  return {
    id: resolveTicketTypeId(raw.id, fallback.id, index),
    name: sanitizeTicketTypeName(raw.name) || fallback.name,
    description:
      sanitizeTicketTypeDescription(raw.description) || fallback.description || "",
    priceCents,
    currency: coerceCurrency(raw.currency, fallback.currency),
    quantityAvailable,
    sortOrder:
      typeof raw.sortOrder === "number" && Number.isFinite(raw.sortOrder)
        ? Math.max(0, Math.floor(raw.sortOrder))
        : index,
    isActive: raw.isActive !== false,
    createdAt: raw.createdAt ?? fallback.createdAt,
    updatedAt: raw.updatedAt ?? fallback.updatedAt
  };
};

export const resolveEventTicketTypes = (input: ResolveTicketTypesOptions): EventTicketType[] => {
  const visibilityType = normalizeText(input.visibilityType).toLowerCase();
  if (visibilityType !== "open_paid") {
    return [];
  }

  const fallback = createDefaultTicketType({
    eventId: typeof input.eventId === "string" ? input.eventId : null,
    priceCents: input.priceCents,
    currency: input.currency,
    capacity: input.capacity
  });

  if (!Array.isArray(input.ticketTypes) || input.ticketTypes.length === 0) {
    return [fallback];
  }

  return input.ticketTypes
    .slice(0, MAX_TICKET_TYPES)
    .map((entry, index) =>
      normalizeTicketTypeRecord(
        (entry && typeof entry === "object" ? entry : {}) as TicketTypeLike,
        index,
        {
          ...fallback,
          id: index === 0 ? fallback.id : `${fallback.id}-${index + 1}`,
          sortOrder: index
        }
      )
    )
    .sort((a, b) => a.sortOrder - b.sortOrder);
};

export const getActiveEventTicketTypes = (input: ResolveTicketTypesOptions): EventTicketType[] =>
  resolveEventTicketTypes(input).filter((ticketType) => ticketType.isActive !== false);

export const resolveLowestTicketTypePriceCents = (
  ticketTypes: EventTicketType[]
): number | null => {
  const prices = ticketTypes
    .filter((ticketType) => ticketType.isActive !== false)
    .map((ticketType) => ticketType.priceCents)
    .filter((price): price is number => Number.isFinite(price) && price >= 0);
  if (prices.length === 0) {
    return null;
  }
  return Math.min(...prices);
};

export const summarizeTicketPricing = (
  ticketTypes: EventTicketType[],
  fallbackPriceCents?: number | null
): TicketPricingSummary | null => {
  const prices = ticketTypes
    .filter((ticketType) => ticketType.isActive !== false)
    .map((ticketType) => ticketType.priceCents)
    .filter((price): price is number => Number.isFinite(price) && price >= 0);

  if (prices.length === 0) {
    if (typeof fallbackPriceCents !== "number" || !Number.isFinite(fallbackPriceCents)) {
      return null;
    }
    return {
      activeTypeCount: fallbackPriceCents > 0 ? 1 : 0,
      distinctPriceCount: 1,
      minPriceCents: fallbackPriceCents,
      maxPriceCents: fallbackPriceCents,
      hasVariablePricing: false
    };
  }

  const distinctPrices = Array.from(new Set(prices)).sort((left, right) => left - right);
  return {
    activeTypeCount: prices.length,
    distinctPriceCount: distinctPrices.length,
    minPriceCents: distinctPrices[0] ?? 0,
    maxPriceCents: distinctPrices[distinctPrices.length - 1] ?? distinctPrices[0] ?? 0,
    hasVariablePricing: distinctPrices.length > 1
  };
};

export const hasRequiredTicketTypes = (ticketTypes: EventTicketType[]): boolean =>
  ticketTypes.filter((ticketType) => ticketType.isActive !== false).length >= MIN_TICKET_TYPES;

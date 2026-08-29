export const STANDARD_PLATFORM_FEE_PERCENT = 10;
export const EARLY_ADOPTER_PLATFORM_FEE_PERCENT = 8;
export const EARLY_ADOPTER_MIN_TICKETS_SOLD = 10;
export const EARLY_ADOPTER_PROMO_CUTOFF_ISO = "2026-10-01T00:00:00.000Z";
export const EARLY_ADOPTER_PROMO_CUTOFF_MS = Date.parse(
  EARLY_ADOPTER_PROMO_CUTOFF_ISO
);

type TimestampLike = {
  toDate?: () => Date;
  seconds?: number;
};

type PromoEligibilityLike = {
  qualifyingEventId?: unknown;
  qualifyingEventDate?: unknown;
  startsAt?: unknown;
  endsAt?: unknown;
  reducedFeePercent?: unknown;
  status?: unknown;
  revokedAt?: unknown;
  revokedReason?: unknown;
};

type UserLike = {
  promoTailgateFeeEligibility?: PromoEligibilityLike;
};

export type PromoEligibilityStatus = "provisional" | "active" | "revoked";

function toMillis(value: unknown): number | null {
  if (!value) return null;
  if (value instanceof Date) {
    const ms = value.getTime();
    return Number.isFinite(ms) ? ms : null;
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string") {
    const ms = Date.parse(value);
    return Number.isFinite(ms) ? ms : null;
  }
  if (typeof value === "object") {
    const record = value as TimestampLike;
    if (typeof record.toDate === "function") {
      const date = record.toDate();
      const ms = date.getTime();
      return Number.isFinite(ms) ? ms : null;
    }
    if (typeof record.seconds === "number") {
      return Math.round(record.seconds * 1000);
    }
  }
  return null;
}

export function normalizePromoEligibilityStatus(
  value: unknown
): PromoEligibilityStatus | null {
  if (typeof value !== "string") {
    return null;
  }
  const normalized = value.trim().toLowerCase();
  if (
    normalized === "provisional" ||
    normalized === "active" ||
    normalized === "revoked"
  ) {
    return normalized;
  }
  return null;
}

export function hasUsablePromoEligibility(
  userData: UserLike | null | undefined,
  atMs = Date.now()
) {
  const eligibility = userData?.promoTailgateFeeEligibility;
  if (!eligibility) {
    return false;
  }
  if (normalizePromoEligibilityStatus(eligibility.status) === "revoked") {
    return false;
  }
  const endsAtMs = toMillis(eligibility.endsAt);
  if (endsAtMs !== null && atMs >= endsAtMs) {
    return false;
  }
  return true;
}

export function resolveHostPlatformFeeSummary(
  userData: UserLike | null | undefined,
  atMs = Date.now()
) {
  const eligibility = userData?.promoTailgateFeeEligibility;
  if (!eligibility || !hasUsablePromoEligibility(userData, atMs)) {
    return {
      feePercent: STANDARD_PLATFORM_FEE_PERCENT,
      promoActive: false,
      promoEndsAtMs: null
    };
  }

  const startsAtMs = toMillis(eligibility.startsAt);
  const endsAtMs = toMillis(eligibility.endsAt);
  const reducedPercent = Number(eligibility.reducedFeePercent);
  const promoFeePercent =
    Number.isFinite(reducedPercent) && reducedPercent > 0
      ? reducedPercent
      : EARLY_ADOPTER_PLATFORM_FEE_PERCENT;
  const promoActive =
    startsAtMs !== null && endsAtMs !== null && atMs >= startsAtMs && atMs < endsAtMs;

  return {
    feePercent: promoActive ? promoFeePercent : STANDARD_PLATFORM_FEE_PERCENT,
    promoActive,
    promoEndsAtMs: endsAtMs
  };
}

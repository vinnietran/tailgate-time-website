function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

function coerceNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

export function resolveTailgatePurchaseTailgateId(data: Record<string, unknown>) {
  return (
    firstString(
      data.tailgateId,
      data.tailgateEventId,
      asRecord(data.event)?.tailgateId,
      asRecord(data.tailgate)?.tailgateId
    ) || null
  );
}

export function resolveTicketPurchaseTicketTypeId(data: Record<string, unknown>) {
  return (
    firstString(
      data.ticketTypeId,
      data.ticket_type_id,
      asRecord(data.ticketType)?.id,
      asRecord(data.ticketType)?.ticketTypeId,
      asRecord(data.ticket)?.ticketTypeId,
      asRecord(data.event)?.ticketTypeId,
      asRecord(data.checkout)?.ticketTypeId,
      asRecord(data.metadata)?.ticketTypeId,
      asRecord(data.lineItem)?.ticketTypeId,
      asRecord(data.purchase)?.ticketTypeId
    ) || null
  );
}

export function resolveTicketPurchaseStatus(data: Record<string, unknown>) {
  return (
    firstString(
      data.status,
      data.paymentStatus,
      data.checkoutStatus,
      data.purchaseStatus,
      data.chargeStatus
    )
      .toLowerCase()
      .replace(/\s+/g, "_") || "unknown"
  );
}

export function isSuccessfulTicketPurchase(status: string) {
  return (
    status === "confirmed" ||
    status === "paid" ||
    status === "succeeded" ||
    status === "completed" ||
    status === "purchase_succeeded"
  );
}

export function resolveTicketPurchaseAmountCents(data: Record<string, unknown>) {
  const candidates = [
    data.totalPaidCents,
    data.amountPaidCents,
    data.totalAmountCents,
    data.chargeAmountCents,
    data.amountCents,
    data.paymentAmountCents
  ];

  for (const candidate of candidates) {
    const parsed = coerceNumber(candidate);
    if (typeof parsed === "number" && parsed >= 0) {
      return Math.round(parsed);
    }
  }

  return 0;
}

export function resolveTicketPurchaseQuantity(data: Record<string, unknown>) {
  const parsed = coerceNumber(data.quantity);
  if (typeof parsed === "number" && parsed > 0) {
    return Math.max(1, Math.round(parsed));
  }
  return 1;
}

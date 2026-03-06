import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../lib/firebase";

export type RefundRequestStatus = "pending" | "approved" | "denied" | string;

export type CreateRefundRequestInput = {
  ticketId: string;
  guestReason?: string;
};

export type ListHostRefundRequestsInput = {
  status?: RefundRequestStatus;
  tailgateId?: string;
  limit?: number;
  cursor?: string;
};

export type DenyRefundRequestInput = {
  refundRequestId: string;
  hostDecisionReason?: string;
};

export type ProcessTicketRefundInput = {
  ticketId: string;
  refundRequestId?: string;
  hostDecisionReason?: string;
};

export type HostRefundRequest = {
  refundRequestId: string;
  ticketId: string;
  tailgateId?: string;
  eventName?: string;
  guestName?: string;
  amountCents?: number;
  guestReason?: string;
  hostDecisionReason?: string;
  status: RefundRequestStatus;
  requestedAt?: Date | null;
  decidedAt?: Date | null;
  raw: Record<string, unknown>;
};

export type CreateRefundRequestResult = {
  refundRequestId?: string;
  status?: RefundRequestStatus;
  raw: Record<string, unknown>;
};

export type DenyRefundRequestResult = {
  status?: RefundRequestStatus;
  raw: Record<string, unknown>;
};

export type ProcessTicketRefundResult = {
  refunded?: boolean;
  status?: string;
  raw: Record<string, unknown>;
};

export type ListHostRefundRequestsResult = {
  requests: HostRefundRequest[];
  nextCursor?: string;
  raw: Record<string, unknown>;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function firstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function coerceNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function coerceDollarsToCents(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    if (!Number.isInteger(value)) {
      return Math.round(value * 100);
    }
    return undefined;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const normalized = trimmed.replace(/[$,\s]/g, "");
    if (!normalized || !normalized.includes(".")) return undefined;
    const parsed = Number(normalized);
    if (!Number.isFinite(parsed)) return undefined;
    return Math.round(parsed * 100);
  }
  return undefined;
}

function normalizeDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  const record = value as {
    toDate?: () => Date;
    seconds?: number | string;
    _seconds?: number | string;
    nanoseconds?: number | string;
    _nanoseconds?: number | string;
    toMillis?: () => number;
  };
  if (typeof record.toDate === "function") {
    try {
      const parsed = record.toDate();
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    } catch {
      return null;
    }
  }
  if (typeof record.toMillis === "function") {
    const parsed = new Date(record.toMillis());
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  const secondsValue =
    typeof record.seconds === "number" || typeof record.seconds === "string"
      ? Number(record.seconds)
      : typeof record._seconds === "number" || typeof record._seconds === "string"
      ? Number(record._seconds)
      : null;
  const nanosValue =
    typeof record.nanoseconds === "number" || typeof record.nanoseconds === "string"
      ? Number(record.nanoseconds)
      : typeof record._nanoseconds === "number" || typeof record._nanoseconds === "string"
      ? Number(record._nanoseconds)
      : 0;
  if (typeof secondsValue === "number" && Number.isFinite(secondsValue)) {
    const millis = secondsValue * 1000 + (Number.isFinite(nanosValue) ? nanosValue / 1_000_000 : 0);
    const parsed = new Date(millis);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

function normalizeRefundStatus(raw: unknown): RefundRequestStatus {
  const value = String(raw ?? "").trim().toLowerCase();
  if (!value) return "pending";
  if (
    value === "requested" ||
    value === "open" ||
    value === "awaiting_host" ||
    value === "pending_review"
  ) {
    return "pending";
  }
  if (
    value === "refunded" ||
    value === "processed" ||
    value === "completed" ||
    value === "succeeded"
  ) {
    return "approved";
  }
  if (value === "rejected" || value === "declined") {
    return "denied";
  }
  return value;
}

function normalizeResponseRecord(value: unknown): Record<string, unknown> {
  if (Array.isArray(value)) {
    return { items: value };
  }
  return asRecord(value) ?? {};
}

function resolveFunctions() {
  if (!app) {
    throw new Error("Functions are not configured in this environment.");
  }
  return getFunctions(app);
}

function normalizeHostRefundRequest(value: unknown): HostRefundRequest | null {
  const record = asRecord(value);
  if (!record) return null;

  const eventRecord = asRecord(record.event);
  const ticketRecord = asRecord(record.ticket);
  const guestRecord = asRecord(record.guest);
  const refundRecord = asRecord(record.refund);
  const timestampsRecord = asRecord(record.timestamps);

  const refundRequestId = firstString(
    record.refundRequestId,
    record.requestId,
    record.id
  );
  const ticketId = firstString(record.ticketId, ticketRecord?.ticketId, ticketRecord?.id);
  if (!refundRequestId || !ticketId) {
    return null;
  }

  const quantity =
    coerceNumber(record.quantity) ??
    coerceNumber(ticketRecord?.quantity) ??
    1;
  const normalizedQuantity =
    Number.isFinite(quantity) && quantity > 0 ? Math.max(1, Math.floor(quantity)) : 1;
  const ticketPriceCents =
    coerceNumber(record.ticketPriceCents) ??
    coerceNumber(ticketRecord?.ticketPriceCents);

  const status = normalizeRefundStatus(
    firstString(record.status, record.requestStatus, record.refundStatus)
  );

  const requestedAmountCentsCandidates = [
    record.amountRequestedCents,
    record.refundAmountCentsRequested,
    record.requestedAmountCents,
    refundRecord?.amountCentsRequested,
    refundRecord?.refundAmountCentsRequested,
    ticketRecord?.refundAmountCentsRequested
  ];
  const approvedAmountCentsCandidates = [
    record.amountApprovedCents,
    record.refundAmountCentsApproved,
    record.approvedAmountCents,
    refundRecord?.amountCentsApproved,
    refundRecord?.refundAmountCentsApproved,
    ticketRecord?.refundAmountCentsApproved
  ];
  const fallbackAmountCentsCandidates = [
    record.refundAmountCents,
    record.amountCents,
    record.ticketAmountCents,
    record.totalPaidCents,
    record.amountPaidCents,
    record.totalAmountCents,
    record.chargeAmountCents,
    refundRecord?.amountCents,
    refundRecord?.refundAmountCents,
    ticketRecord?.refundAmountCents,
    ticketRecord?.amountCents,
    ticketRecord?.ticketAmountCents,
    ticketRecord?.totalPaidCents,
    ticketRecord?.amountPaidCents,
    ticketRecord?.totalAmountCents,
    ticketRecord?.chargeAmountCents
  ];

  const amountCentsCandidates =
    status === "pending"
      ? [
          ...requestedAmountCentsCandidates,
          ...approvedAmountCentsCandidates,
          ...fallbackAmountCentsCandidates
        ]
      : status === "approved"
      ? [
          ...approvedAmountCentsCandidates,
          ...requestedAmountCentsCandidates,
          ...fallbackAmountCentsCandidates
        ]
      : [
          ...requestedAmountCentsCandidates,
          ...approvedAmountCentsCandidates,
          ...fallbackAmountCentsCandidates
        ];
  const amountCentsFromKnownCents = amountCentsCandidates
    .map((candidate) => coerceNumber(candidate))
    .find((candidate): candidate is number => typeof candidate === "number");

  const requestedAmountDollarCandidates = [
    record.amountRequested,
    record.requestedAmount,
    record.refundAmountRequested,
    refundRecord?.amountRequested,
    refundRecord?.refundAmountRequested
  ];
  const approvedAmountDollarCandidates = [
    record.amountApproved,
    record.approvedAmount,
    record.refundAmountApproved,
    refundRecord?.amountApproved,
    refundRecord?.refundAmountApproved
  ];
  const fallbackAmountDollarCandidates = [
    record.refundAmount,
    record.amount,
    record.ticketAmount,
    record.totalPaid,
    record.amountPaid,
    record.totalAmount,
    refundRecord?.amount,
    refundRecord?.refundAmount,
    ticketRecord?.refundAmount,
    ticketRecord?.amount,
    ticketRecord?.ticketAmount,
    ticketRecord?.totalPaid,
    ticketRecord?.amountPaid,
    ticketRecord?.totalAmount
  ];
  const amountDollarCandidates =
    status === "pending"
      ? [
          ...requestedAmountDollarCandidates,
          ...approvedAmountDollarCandidates,
          ...fallbackAmountDollarCandidates
        ]
      : status === "approved"
      ? [
          ...approvedAmountDollarCandidates,
          ...requestedAmountDollarCandidates,
          ...fallbackAmountDollarCandidates
        ]
      : [
          ...requestedAmountDollarCandidates,
          ...approvedAmountDollarCandidates,
          ...fallbackAmountDollarCandidates
        ];

  const amountCentsFromDollars = amountDollarCandidates
    .map((candidate) => coerceDollarsToCents(candidate))
    .find((candidate): candidate is number => typeof candidate === "number");

  const amountCentsFromTicketMath =
    typeof ticketPriceCents === "number" ? ticketPriceCents * normalizedQuantity : undefined;

  const amountCents =
    amountCentsFromKnownCents ??
    amountCentsFromDollars ??
    amountCentsFromTicketMath;

  return {
    refundRequestId,
    ticketId,
    tailgateId: firstString(record.tailgateId, record.eventId, eventRecord?.tailgateId, eventRecord?.id),
    eventName: firstString(record.eventName, record.tailgateName, eventRecord?.name, eventRecord?.eventName),
    guestName: firstString(record.guestName, record.userName, guestRecord?.name, guestRecord?.displayName),
    amountCents,
    guestReason: firstString(record.guestReason, record.reason, record.requestReason),
    hostDecisionReason: firstString(record.hostDecisionReason, record.decisionReason),
    status,
    requestedAt: normalizeDate(
      record.createdAtMs ??
      record.requestedAt ??
      record.createdAt ??
      record.submittedAt ??
        record.requestCreatedAt ??
        record.requestTimestamp ??
        timestampsRecord?.requestedAt ??
        timestampsRecord?.createdAt
    ),
    decidedAt: normalizeDate(
      record.decidedAtMs ??
      record.decidedAt ??
      record.decisionAt ??
      record.decisionedAt ??
        record.hostDecidedAt ??
        record.approvedAt ??
        record.processedAt ??
        record.refundProcessedAt ??
        record.resolvedAt ??
        record.updatedAt ??
        timestampsRecord?.decidedAt ??
        timestampsRecord?.decisionAt ??
        timestampsRecord?.approvedAt ??
        timestampsRecord?.processedAt
    ),
    raw: record
  };
}

export function getRefundErrorMessage(error: unknown, fallback = "Unable to process refund. Try again.") {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  const record = asRecord(error);
  if (!record) return fallback;
  const message = firstString(record.message, record.details);
  return message ?? fallback;
}

export async function createRefundRequest(
  input: CreateRefundRequestInput
): Promise<CreateRefundRequestResult> {
  const callable = httpsCallable(resolveFunctions(), "createRefundRequest");
  const payload: Record<string, unknown> = {
    ticketId: input.ticketId
  };
  if (input.guestReason?.trim()) {
    payload.guestReason = input.guestReason.trim();
    payload.reason = input.guestReason.trim();
  }
  const result = await callable(payload);
  const raw = normalizeResponseRecord(result.data);
  return {
    refundRequestId: firstString(raw.refundRequestId, raw.requestId, raw.id),
    status: firstString(raw.status, raw.requestStatus, raw.refundStatus),
    raw
  };
}

export async function listHostRefundRequests(
  input: ListHostRefundRequestsInput
): Promise<ListHostRefundRequestsResult> {
  const callable = httpsCallable(resolveFunctions(), "listHostRefundRequests");
  const payload: Record<string, unknown> = {};
  if (input.status) payload.status = input.status;
  if (input.tailgateId) {
    payload.tailgateId = input.tailgateId;
    payload.eventId = input.tailgateId;
  }
  if (typeof input.limit === "number") payload.limit = input.limit;
  if (input.cursor) payload.cursor = input.cursor;

  const result = await callable(payload);
  const raw = normalizeResponseRecord(result.data);
  const listSource = Array.isArray(result.data)
    ? result.data
    : Array.isArray(raw.refundRequests)
    ? raw.refundRequests
    : Array.isArray(raw.requests)
    ? raw.requests
    : Array.isArray(raw.items)
    ? raw.items
    : [];

  const requests = listSource
    .map((item) => normalizeHostRefundRequest(item))
    .filter((item): item is HostRefundRequest => Boolean(item));

  return {
    requests,
    nextCursor: firstString(raw.nextCursor, raw.cursor),
    raw
  };
}

export async function denyRefundRequest(
  input: DenyRefundRequestInput
): Promise<DenyRefundRequestResult> {
  const callable = httpsCallable(resolveFunctions(), "denyRefundRequest");
  const payload: Record<string, unknown> = {
    refundRequestId: input.refundRequestId
  };
  if (input.hostDecisionReason?.trim()) {
    payload.hostDecisionReason = input.hostDecisionReason.trim();
    payload.reason = input.hostDecisionReason.trim();
  }
  const result = await callable(payload);
  const raw = normalizeResponseRecord(result.data);
  return {
    status: firstString(raw.status, raw.requestStatus, raw.refundStatus),
    raw
  };
}

export async function processTicketRefund(
  input: ProcessTicketRefundInput
): Promise<ProcessTicketRefundResult> {
  const callable = httpsCallable(resolveFunctions(), "processTicketRefund");
  const payload: Record<string, unknown> = {
    ticketId: input.ticketId
  };
  if (input.refundRequestId) payload.refundRequestId = input.refundRequestId;
  if (input.hostDecisionReason?.trim()) {
    payload.hostDecisionReason = input.hostDecisionReason.trim();
    payload.reason = input.hostDecisionReason.trim();
  }

  const result = await callable(payload);
  const raw = normalizeResponseRecord(result.data);
  const refundedFlag = raw.refunded;
  return {
    refunded:
      refundedFlag === true ||
      refundedFlag === 1 ||
      firstString(raw.status, raw.ticketStatus)?.toLowerCase() === "refunded",
    status: firstString(raw.status, raw.ticketStatus),
    raw
  };
}

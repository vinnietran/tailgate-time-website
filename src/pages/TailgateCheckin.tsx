import { useCallback, useEffect, useMemo, useState } from "react";
import { httpsCallable } from "firebase/functions";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import { useAuth } from "../hooks/useAuth";
import { db, functions as firebaseFunctions } from "../lib/firebase";
import { mockTailgates } from "../data/mockTailgates";
import { VisibilityType } from "../types";
import { formatDateTimeRange } from "../utils/format";

type CheckInResponse = {
  ticketId: string;
  ticketCode: string;
  quantity: number;
  checkedInCount: number;
};

type CheckedInTicketRow = {
  ticketId: string;
  ticketCode: string;
  quantity: number;
  checkedInCount: number;
  remaining: number;
  lastCheckInAtMs: number;
};

type CheckinEventDetail = {
  id: string;
  eventName: string;
  startDateTime: Date | null;
  endDateTime?: Date | null;
  hostId: string;
  coHostIds: string[];
  visibilityType: VisibilityType;
  ticketPriceCents?: number;
  status: string;
};

function normalizeTicketCode(value: string): string {
  return value.trim().toUpperCase();
}

function firstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function resolveVisibilityType(raw: unknown): VisibilityType {
  if (raw === "private" || raw === "open_free" || raw === "open_paid") {
    return raw;
  }
  return "private";
}

function normalizeEventStatus(value: unknown): string {
  const raw = String(value ?? "").trim().toLowerCase();
  if (raw === "cancelled" || raw === "canceled" || raw.startsWith("cancel")) {
    return "cancelled";
  }
  return raw;
}

function resolveDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const maybeTimestamp = value as { toDate?: () => Date; seconds?: number };
  if (typeof maybeTimestamp.toDate === "function") {
    try {
      const parsed = maybeTimestamp.toDate();
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    } catch {
      return null;
    }
  }

  if (typeof maybeTimestamp.seconds === "number") {
    const parsed = new Date(maybeTimestamp.seconds * 1000);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

function resolveTimestampMs(value: unknown): number {
  if (!value) return 0;
  if (value instanceof Date) return value.getTime();
  if (typeof value === "object" && value && "toMillis" in value) {
    const timestamp = value as { toMillis?: () => number };
    if (typeof timestamp.toMillis === "function") {
      return timestamp.toMillis();
    }
  }
  if (typeof value === "object" && value && "seconds" in value) {
    const timestamp = value as { seconds?: number };
    if (typeof timestamp.seconds === "number") {
      return timestamp.seconds * 1000;
    }
  }
  return 0;
}

function coercePositiveInteger(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.floor(value);
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      return Math.floor(parsed);
    }
  }
  return null;
}

function coerceNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

function toCheckinDetailFromFirestore(
  id: string,
  data: Record<string, unknown>
): CheckinEventDetail {
  const hostId =
    firstString(data.hostId, data.hostUserId, data.ownerId, data.createdByUid) ?? "";

  return {
    id,
    eventName: firstString(data.eventName, data.name, data.title) ?? "Untitled Tailgate",
    startDateTime:
      resolveDate(data.dateTime) ??
      resolveDate(data.eventTargetTime) ??
      resolveDate(data.startDateTime) ??
      resolveDate(data.startAt) ??
      resolveDate(data.eventDateTime) ??
      null,
    endDateTime:
      resolveDate(data.endDateTime) ??
      resolveDate(data.endAt) ??
      resolveDate(data.eventEndAt) ??
      resolveDate(data.tailgateEndAt) ??
      null,
    hostId,
    coHostIds: Array.isArray(data.coHostIds)
      ? data.coHostIds.filter((value): value is string => typeof value === "string")
      : [],
    visibilityType: resolveVisibilityType(data.visibilityType),
    ticketPriceCents:
      coerceNumber(data.ticketPriceCents) ??
      coerceNumber(data.priceCents) ??
      coerceNumber(data.price),
    status: normalizeEventStatus(firstString(data.status, data.eventStatus))
  };
}

function toCheckinDetailFromMock(id: string): CheckinEventDetail | null {
  const mock = mockTailgates.find((event) => event.id === id);
  if (!mock) return null;
  return {
    id: mock.id,
    eventName: mock.name,
    startDateTime: mock.startDateTime,
    endDateTime: mock.endDateTime,
    hostId: mock.hostUserId,
    coHostIds: [],
    visibilityType: mock.visibilityType,
    ticketPriceCents: mock.ticketPriceCents,
    status: normalizeEventStatus(mock.status)
  };
}

export default function TailgateCheckin() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<CheckinEventDetail | null>(null);
  const [ticketCode, setTicketCode] = useState("");
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkinMessage, setCheckinMessage] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);
  const [highlightedTicketCode, setHighlightedTicketCode] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<CheckInResponse | null>(null);
  const [checkedInTickets, setCheckedInTickets] = useState<CheckedInTicketRow[]>([]);
  const [newCheckedInTickets, setNewCheckedInTickets] = useState<CheckedInTicketRow[]>([]);
  const [legacyCheckedInTickets, setLegacyCheckedInTickets] = useState<CheckedInTicketRow[]>([]);
  const [checkedInLoading, setCheckedInLoading] = useState(false);
  const [checkedInError, setCheckedInError] = useState<string | null>(null);
  const [hasNewSnapshot, setHasNewSnapshot] = useState(false);
  const [hasLegacySnapshot, setHasLegacySnapshot] = useState(false);

  const checkInByCode = useMemo(() => {
    if (!firebaseFunctions) return null;
    return httpsCallable(firebaseFunctions, "checkInByTicketCode");
  }, []);

  const isHostUser = useMemo(() => {
    if (!detail || !user?.uid) return false;
    return detail.hostId === user.uid || detail.coHostIds.includes(user.uid);
  }, [detail, user?.uid]);

  const isCancelledEvent = detail?.status === "cancelled";
  const canCheckIn = isHostUser && detail?.visibilityType === "open_paid" && !isCancelledEvent;

  useEffect(() => {
    if (!id) {
      setError("Missing tailgate ID.");
      setLoading(false);
      return;
    }

    if (!db) {
      const fallback = toCheckinDetailFromMock(id);
      setDetail(fallback);
      setError(fallback ? null : "Tailgate not found.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const eventRef = doc(db, "tailgateEvents", id);
    const unsubscribe = onSnapshot(
      eventRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setDetail(null);
          setError("Tailgate not found.");
          setLoading(false);
          return;
        }
        setDetail(toCheckinDetailFromFirestore(snapshot.id, snapshot.data() as Record<string, unknown>));
        setLoading(false);
        setError(null);
      },
      (snapshotError) => {
        console.error("Failed to load check-in event", snapshotError);
        setDetail(null);
        setError(
          snapshotError instanceof Error
            ? snapshotError.message
            : "Failed to load check-in event."
        );
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    if (!id || !canCheckIn || !db) {
      setCheckedInTickets([]);
      setNewCheckedInTickets([]);
      setLegacyCheckedInTickets([]);
      setCheckedInLoading(false);
      setCheckedInError(null);
      setHasNewSnapshot(false);
      setHasLegacySnapshot(false);
      return;
    }

    setCheckedInLoading(true);
    setCheckedInError(null);
    setHasNewSnapshot(false);
    setHasLegacySnapshot(false);

    const newTicketsQuery = query(
      collection(db, "tickets"),
      where("tailgateId", "==", id),
      where("status", "==", "checked_in")
    );
    const legacyTicketsQuery = query(
      collection(db, "tailgateTickets"),
      where("tailgateId", "==", id),
      where("status", "==", "confirmed")
    );

    const unsubscribeNew = onSnapshot(
      newTicketsQuery,
      (snapshot) => {
        const rows = snapshot.docs
          .map((docSnap) => {
            const data = docSnap.data() as Record<string, unknown>;
            const quantity = coercePositiveInteger(data.quantity) ?? 1;
            const checkedInCount =
              coercePositiveInteger(data.checkedInCount) ??
              (String(data.status ?? "").toLowerCase() === "checked_in" ? 1 : 0);
            const ticketCodeValue = firstString(data.ticketCode) ?? "—";

            return {
              ticketId: docSnap.id,
              ticketCode: ticketCodeValue,
              quantity,
              checkedInCount,
              remaining: Math.max(0, quantity - checkedInCount),
              lastCheckInAtMs: resolveTimestampMs(data.checkedInAt ?? data.lastCheckInAt)
            } as CheckedInTicketRow;
          })
          .filter((row) => row.checkedInCount > 0)
          .sort((a, b) => b.lastCheckInAtMs - a.lastCheckInAtMs);

        setNewCheckedInTickets(rows);
        setHasNewSnapshot(true);
      },
      (snapshotError) => {
        console.error("Failed to load checked-in tickets", snapshotError);
        setCheckedInError("Unable to load checked-in tickets.");
        setHasNewSnapshot(true);
      }
    );

    const unsubscribeLegacy = onSnapshot(
      legacyTicketsQuery,
      (snapshot) => {
        const rows = snapshot.docs
          .map((docSnap) => {
            const data = docSnap.data() as Record<string, unknown>;
            const quantity = coercePositiveInteger(data.quantity) ?? 1;
            const checkedInCount = coercePositiveInteger(data.checkedInCount) ?? 0;
            const ticketCodeValue = firstString(data.ticketCode) ?? "—";

            return {
              ticketId: docSnap.id,
              ticketCode: ticketCodeValue,
              quantity,
              checkedInCount,
              remaining: Math.max(0, quantity - checkedInCount),
              lastCheckInAtMs: resolveTimestampMs(data.lastCheckInAt ?? data.checkedInAt)
            } as CheckedInTicketRow;
          })
          .filter((row) => row.checkedInCount > 0)
          .sort((a, b) => b.lastCheckInAtMs - a.lastCheckInAtMs);

        setLegacyCheckedInTickets(rows);
        setHasLegacySnapshot(true);
      },
      (snapshotError) => {
        console.error("Failed to load legacy checked-in tickets", snapshotError);
        setCheckedInError("Unable to load checked-in tickets.");
        setHasLegacySnapshot(true);
      }
    );

    return () => {
      unsubscribeNew();
      unsubscribeLegacy();
    };
  }, [canCheckIn, id]);

  useEffect(() => {
    if (!hasNewSnapshot || !hasLegacySnapshot) {
      return;
    }
    const useNewModel = newCheckedInTickets.length > 0;
    setCheckedInTickets(useNewModel ? newCheckedInTickets : legacyCheckedInTickets);
    setCheckedInLoading(false);
  }, [hasLegacySnapshot, hasNewSnapshot, legacyCheckedInTickets, newCheckedInTickets]);

  const handleCheckIn = useCallback(async () => {
    if (!id || !canCheckIn || isCheckingIn) return;

    const normalizedCode = normalizeTicketCode(ticketCode);
    if (!normalizedCode) {
      setCheckinMessage({
        tone: "error",
        text: "Enter a ticket code."
      });
      return;
    }
    if (!checkInByCode) {
      setCheckinMessage({
        tone: "error",
        text: "Check-in is unavailable right now."
      });
      return;
    }

    setIsCheckingIn(true);
    setCheckinMessage(null);
    try {
      const result = await checkInByCode({
        tailgateId: id,
        ticketCode: normalizedCode,
        checkInCount: 1
      });
      const data = result.data as CheckInResponse;
      setLastResult(data);
      setTicketCode("");
      setHighlightedTicketCode(null);
      setCheckinMessage({
        tone: "success",
        text: `Ticket checked in. Total ${data.checkedInCount}/${data.quantity}.`
      });
    } catch (checkInError) {
      const message =
        checkInError instanceof Error ? checkInError.message : "Check-in failed.";

      if (message.includes("NOT_AUTHORIZED")) {
        setCheckinMessage({
          tone: "error",
          text: "Only the host or a co-host can check in tickets."
        });
      } else if (message.includes("INVALID_TICKET_CODE")) {
        setCheckinMessage({
          tone: "error",
          text: "Invalid ticket code."
        });
      } else if (message.includes("TICKET_NOT_CONFIRMED")) {
        setCheckinMessage({
          tone: "error",
          text: "Ticket is not confirmed yet."
        });
      } else if (message.includes("CHECKIN_EXCEEDS_QUANTITY")) {
        setHighlightedTicketCode(normalizedCode);
        setCheckinMessage({
          tone: "error",
          text: "This ticket is already checked in."
        });
      } else {
        setCheckinMessage({
          tone: "error",
          text: "Unable to check in ticket. Please try again."
        });
      }
    } finally {
      setIsCheckingIn(false);
    }
  }, [canCheckIn, checkInByCode, id, isCheckingIn, ticketCode]);

  const resetForm = () => {
    setTicketCode("");
    setCheckinMessage(null);
    setHighlightedTicketCode(null);
    setLastResult(null);
  };

  const remaining = lastResult
    ? Math.max(0, lastResult.quantity - lastResult.checkedInCount)
    : null;

  return (
    <AppShell header={<div className="simple-header"><h1>Check-in Guests</h1></div>}>
      {loading ? (
        <section className="tailgate-checkin-stack">
          <div className="tailgate-card skeleton" />
          <div className="tailgate-card skeleton" />
        </section>
      ) : error ? (
        <section className="error-banner">{error}</section>
      ) : !detail ? (
        <section className="empty-state">
          <p>Tailgate {id} was not found.</p>
        </section>
      ) : (
        <section className="tailgate-checkin-stack">
          <article className="tailgate-checkin-card">
            <div className="tailgate-checkin-header">
              <div>
                <h2>Check-in by code</h2>
                <p className="section-subtitle">Enter ticket codes from your host list.</p>
              </div>
              <button type="button" className="secondary-button" onClick={() => navigate(-1)}>
                Done
              </button>
            </div>
            <div className="tailgate-checkin-event-meta">
              <strong>{detail.eventName}</strong>
              <span>{formatDateTimeRange(detail.startDateTime, detail.endDateTime)}</span>
            </div>
            {!isHostUser ? (
              <div className="error-banner">
                Only the event host or a co-host can check in tickets.
              </div>
            ) : isCancelledEvent ? (
              <div className="tailgate-checkin-note">
                Check-in is unavailable for cancelled events.
              </div>
            ) : detail.visibilityType !== "open_paid" ? (
              <div className="tailgate-checkin-note">
                Ticket check-in by code is available for Open Paid tailgates only.
              </div>
            ) : (
              <>
                <form
                  className="tailgate-checkin-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void handleCheckIn();
                  }}
                >
                  <div className="input-group">
                    <label className="input-label" htmlFor="checkin-ticket-code">Ticket Code</label>
                    <input
                      id="checkin-ticket-code"
                      className="text-input tailgate-checkin-code-input"
                      placeholder="TG-XXXXXX"
                      value={ticketCode}
                      onChange={(event) => {
                        setTicketCode(event.target.value.toUpperCase());
                        if (highlightedTicketCode) {
                          setHighlightedTicketCode(null);
                        }
                      }}
                      autoCapitalize="characters"
                      autoComplete="off"
                    />
                  </div>

                  <div className="tailgate-checkin-form-actions">
                    <button type="submit" className="primary-button" disabled={isCheckingIn}>
                      {isCheckingIn ? "Checking in..." : "Check in"}
                    </button>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={resetForm}
                      disabled={isCheckingIn}
                    >
                      Reset
                    </button>
                  </div>
                </form>

                {checkinMessage ? (
                  <p
                    className={`tailgate-checkin-feedback ${
                      checkinMessage.tone === "success"
                        ? "tailgate-checkin-feedback-success"
                        : "tailgate-checkin-feedback-error"
                    }`}
                  >
                    {checkinMessage.text}
                  </p>
                ) : null}

                {lastResult ? (
                  <div className="tailgate-checkin-result-card">
                    <p className="tailgate-checkin-result-title">Ticket {lastResult.ticketCode}</p>
                    <p className="tailgate-checkin-result-copy">
                      {lastResult.checkedInCount} checked in of {lastResult.quantity}
                    </p>
                    {remaining !== null ? (
                      <p className="tailgate-checkin-result-copy tailgate-checkin-result-highlight">
                        Remaining: {remaining}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </>
            )}
          </article>

          {canCheckIn ? (
            <article className="tailgate-checkin-card">
              <div className="section-header">
                <div>
                  <h2>Checked-in tickets</h2>
                  <p className="section-subtitle">Codes already checked in.</p>
                </div>
              </div>
              {checkedInLoading ? (
                <p className="meta-muted">Loading check-ins...</p>
              ) : checkedInError ? (
                <p className="tailgate-checkin-feedback tailgate-checkin-feedback-error">
                  {checkedInError}
                </p>
              ) : checkedInTickets.length === 0 ? (
                <p className="meta-muted">No checked-in tickets yet.</p>
              ) : (
                <div className="tailgate-checkin-table">
                  <div className="tailgate-checkin-table-row tailgate-checkin-table-head">
                    <span>Code</span>
                    <span>Checked In</span>
                    <span>Remaining</span>
                  </div>
                  {checkedInTickets.map((ticket) => (
                    <div
                      key={ticket.ticketId}
                      className={`tailgate-checkin-table-row${
                        highlightedTicketCode &&
                        normalizeTicketCode(ticket.ticketCode) === highlightedTicketCode
                          ? " tailgate-checkin-table-row-highlight"
                          : ""
                      }`}
                    >
                      <span>{ticket.ticketCode}</span>
                      <span>
                        {ticket.checkedInCount}/{ticket.quantity}
                      </span>
                      <span>{ticket.remaining}</span>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ) : null}
        </section>
      )}
    </AppShell>
  );
}

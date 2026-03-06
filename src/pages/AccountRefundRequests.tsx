import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import { useAuth } from "../hooks/useAuth";
import { useDenyRefundRequest } from "../hooks/useDenyRefundRequest";
import { useHostRefundRequests } from "../hooks/useHostRefundRequests";
import { useHostTailgates } from "../hooks/useHostTailgates";
import { useProcessTicketRefund } from "../hooks/useProcessTicketRefund";
import { HostRefundRequest } from "../services/refunds";
import { formatCurrencyFromCents, formatDateTime } from "../utils/format";

type RefundDecisionFilter = "pending" | "approved" | "denied";
type RefundActionType = "approve" | "deny";

type RefundActionDraft = {
  type: RefundActionType;
  request: HostRefundRequest;
};

function refundStatusLabel(status: string) {
  if (status === "pending") return "Pending";
  if (status === "approved") return "Approved";
  if (status === "denied") return "Denied";
  return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending";
}

function refundStatusChipClass(status: string) {
  if (status === "approved") return "chip-live";
  if (status === "cancelled") return "chip-cancelled";
  if (status === "denied") return "chip-cancelled";
  return "chip-upcoming";
}

export default function AccountRefundRequests() {
  const { user } = useAuth();
  const [refundFilter, setRefundFilter] = useState<RefundDecisionFilter>("pending");
  const [refundActionDraft, setRefundActionDraft] = useState<RefundActionDraft | null>(null);
  const [refundActionReason, setRefundActionReason] = useState("");
  const [refundActionFeedback, setRefundActionFeedback] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);

  const {
    tailgates,
    loading: tailgatesLoading,
    error: tailgatesError
  } = useHostTailgates(user?.uid);

  const paidTailgatesCount = useMemo(
    () =>
      tailgates.filter(
        (tailgate) =>
          tailgate.hostUserId === user?.uid &&
          tailgate.visibilityType === "open_paid"
      ).length,
    [tailgates, user?.uid]
  );

  const showRefundRequestsSection = paidTailgatesCount > 0;

  const {
    requests: hostRefundRequests,
    loading: hostRefundRequestsLoading,
    error: hostRefundRequestsError,
    refresh: refreshHostRefundRequests
  } = useHostRefundRequests({
    status: refundFilter,
    limit: 50,
    enabled: Boolean(user?.uid) && showRefundRequestsSection
  });

  const {
    processTicketRefund,
    loading: approveRefundLoading,
    error: approveRefundError,
    clearError: clearApproveRefundError
  } = useProcessTicketRefund();

  const {
    denyRefundRequest,
    loading: denyRefundLoading,
    error: denyRefundError,
    clearError: clearDenyRefundError
  } = useDenyRefundRequest();

  const refundActionLoading = approveRefundLoading || denyRefundLoading;
  const refundActionError = approveRefundError ?? denyRefundError;

  useEffect(() => {
    if (!refundActionFeedback) return;
    const timer = setTimeout(() => setRefundActionFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [refundActionFeedback]);

  const openRefundActionModal = (type: RefundActionType, request: HostRefundRequest) => {
    setRefundActionDraft({ type, request });
    setRefundActionReason("");
    setRefundActionFeedback(null);
    clearApproveRefundError();
    clearDenyRefundError();
  };

  const closeRefundActionModal = () => {
    if (refundActionLoading) return;
    setRefundActionDraft(null);
    setRefundActionReason("");
    clearApproveRefundError();
    clearDenyRefundError();
  };

  const submitRefundAction = async () => {
    if (!refundActionDraft || refundActionLoading) return;
    const note = refundActionReason.trim() || undefined;
    setRefundActionFeedback(null);

    try {
      if (refundActionDraft.type === "approve") {
        await processTicketRefund({
          ticketId: refundActionDraft.request.ticketId,
          refundRequestId: refundActionDraft.request.refundRequestId,
          hostDecisionReason: note
        });
        setRefundActionFeedback({
          tone: "success",
          text: "Purchase refunded."
        });
      } else {
        await denyRefundRequest({
          refundRequestId: refundActionDraft.request.refundRequestId,
          hostDecisionReason: note
        });
        setRefundActionFeedback({
          tone: "success",
          text: "Refund request denied."
        });
      }
      setRefundActionDraft(null);
      setRefundActionReason("");
      refreshHostRefundRequests();
    } catch (actionError) {
      console.error("Refund action failed", actionError);
      setRefundActionFeedback({
        tone: "error",
        text: "Unable to process refund. Try again."
      });
    }
  };

  return (
    <AppShell header={<div className="simple-header"><h1>Refund Requests</h1></div>}>
      <section className="payouts-page">
        <article className="payouts-card">
          <div className="section-header">
            <div>
              <h2>Refund requests</h2>
              <p className="section-subtitle">
                Review purchase-level requests and approve or deny.
              </p>
            </div>
            <Link className="secondary-button" to="/account">
              Back to account
            </Link>
          </div>

          {tailgatesLoading ? (
            <p className="meta-muted">Checking paid tailgates...</p>
          ) : tailgatesError ? (
            <p className="error-banner">{tailgatesError}</p>
          ) : !showRefundRequestsSection ? (
            <div className="empty-state">
              <p>No paid tailgates yet.</p>
              <Link className="primary-button" to="/tailgates/new">
                Create a paid tailgate
              </Link>
            </div>
          ) : (
            <>
              <div
                className="filter-tabs payouts-refund-filter-tabs"
                role="tablist"
                aria-label="Refund request status"
              >
                {(["pending", "approved", "denied"] as RefundDecisionFilter[]).map((filterValue) => (
                  <button
                    key={filterValue}
                    type="button"
                    role="tab"
                    aria-selected={refundFilter === filterValue}
                    className={`filter-tab ${refundFilter === filterValue ? "active" : ""}`}
                    onClick={() => setRefundFilter(filterValue)}
                  >
                    {refundStatusLabel(filterValue)}
                  </button>
                ))}
              </div>

              {hostRefundRequestsLoading ? (
                <p className="meta-muted">Loading refund requests...</p>
              ) : hostRefundRequestsError ? (
                <p className="error-banner">{hostRefundRequestsError}</p>
              ) : hostRefundRequests.length === 0 ? (
                <p className="meta-muted">No refund requests in this status.</p>
              ) : (
                <div className="payouts-refund-list">
                  {hostRefundRequests.map((request) => (
                    <div className="payouts-refund-row" key={request.refundRequestId}>
                      <div>
                        <p className="payouts-tailgate-name">{request.eventName ?? "Tailgate event"}</p>
                        <p className="payouts-tailgate-meta">
                          {request.requestedAt
                            ? formatDateTime(request.requestedAt)
                            : "Requested recently"}
                        </p>
                        {request.status === "approved" ? (
                          <p className="payouts-refund-decision-date">
                            {request.decidedAt
                              ? `Approved ${formatDateTime(request.decidedAt)}`
                              : "Approved recently"}
                          </p>
                        ) : null}
                      </div>
                      <div className="payouts-refund-meta-block">
                        <p className="payouts-tailgate-meta">
                          Guest: {request.guestName ?? "Unknown guest"}
                        </p>
                        <p className="payouts-tailgate-amount">
                          {typeof request.amountCents === "number"
                            ? formatCurrencyFromCents(request.amountCents)
                            : "Amount unavailable"}
                        </p>
                      </div>
                      <div className="payouts-refund-reason-block">
                        <p className="payouts-tailgate-meta">
                          {request.guestReason?.trim()
                            ? request.guestReason
                            : "No guest reason provided."}
                        </p>
                        {request.hostDecisionReason?.trim() ? (
                          <p className="payouts-refund-host-note">
                            Host note: {request.hostDecisionReason}
                          </p>
                        ) : null}
                      </div>
                      <div className="payouts-refund-actions">
                        <span className={`chip ${refundStatusChipClass(request.status)}`}>
                          {refundStatusLabel(request.status)}
                        </span>
                        {request.status === "pending" ? (
                          <div className="payouts-refund-action-buttons">
                            <button
                              type="button"
                              className="secondary-button"
                              disabled={refundActionLoading}
                              onClick={() => openRefundActionModal("deny", request)}
                            >
                              Deny
                            </button>
                            <button
                              type="button"
                              className="primary-button"
                              disabled={refundActionLoading}
                              onClick={() => openRefundActionModal("approve", request)}
                            >
                              Approve
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {refundActionFeedback?.tone === "success" ? (
            <p className="success-banner">{refundActionFeedback.text}</p>
          ) : null}
          {refundActionFeedback?.tone === "error" ? (
            <p className="error-banner">{refundActionFeedback.text}</p>
          ) : null}
        </article>

        {refundActionDraft ? (
          <div className="create-wizard-modal-overlay" role="dialog" aria-modal="true">
            <div className="create-wizard-modal create-wizard-refund-modal">
              <div className="create-wizard-modal-header">
                <h3>
                  {refundActionDraft.type === "approve"
                    ? `Refund this purchase for ${
                        typeof refundActionDraft.request.amountCents === "number"
                          ? formatCurrencyFromCents(refundActionDraft.request.amountCents)
                          : "the purchase amount"
                      }?`
                    : "Deny refund request?"}
                </h3>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={closeRefundActionModal}
                  disabled={refundActionLoading}
                >
                  Close
                </button>
              </div>
              <label className="input-group">
                <span className="input-label">Optional note</span>
                <textarea
                  className="text-input tailgate-details-host-broadcast-input"
                  rows={4}
                  value={refundActionReason}
                  onChange={(event) => setRefundActionReason(event.target.value)}
                  placeholder="Add context for the guest."
                />
              </label>
              {refundActionError ? (
                <p className="tailgate-details-ticket-error">
                  Unable to process refund. Try again.
                </p>
              ) : null}
              <div className="create-wizard-payout-actions">
                <button
                  type="button"
                  className="primary-button"
                  disabled={refundActionLoading}
                  onClick={() => void submitRefundAction()}
                >
                  {refundActionLoading
                    ? "Processing..."
                    : refundActionDraft.type === "approve"
                    ? "Approve refund"
                    : "Deny request"}
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  disabled={refundActionLoading}
                  onClick={closeRefundActionModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </AppShell>
  );
}

import React, { useEffect, useMemo, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { updateProfile as updateAuthProfile } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import {
  IconBell,
  IconExternal,
  IconMessage,
  IconUser
} from "../components/Icons";
import { useAuth } from "../hooks/useAuth";
import { useDenyRefundRequest } from "../hooks/useDenyRefundRequest";
import { useHostTailgates } from "../hooks/useHostTailgates";
import { useHostRefundRequests } from "../hooks/useHostRefundRequests";
import { useProcessTicketRefund } from "../hooks/useProcessTicketRefund";
import { useUserProfile } from "../hooks/useUserProfile";
import { auth, db, functions as firebaseFunctions, storage } from "../lib/firebase";
import { HostRefundRequest } from "../services/refunds";
import { formatCurrencyFromCents, formatDateTime } from "../utils/format";
import { estimateHostPayout } from "../utils/tailgate";

type StripeConnectStatus = "not_started" | "pending" | "complete" | "restricted";

type PayoutAccountState = {
  status: StripeConnectStatus;
  payoutsEnabled: boolean;
  accountId: string | null;
  requirementsDueCount: number;
  loading: boolean;
  error: string | null;
};

type RefundDecisionFilter = "pending" | "approved" | "denied";
type RefundActionType = "approve" | "deny";

type RefundActionDraft = {
  type: RefundActionType;
  request: HostRefundRequest;
};

const CONNECT_RETURN_URL =
  import.meta.env.VITE_CONNECT_RETURN_URL ?? "https://tailgate-time.com/connect-return";
const CONNECT_REFRESH_URL =
  import.meta.env.VITE_CONNECT_REFRESH_URL ?? "https://tailgate-time.com/connect-refresh";

function normalizeConnectStatus(value: unknown): StripeConnectStatus {
  if (value === "pending" || value === "complete" || value === "restricted") {
    return value;
  }
  return "not_started";
}

function statusLabel(status: StripeConnectStatus) {
  if (status === "not_started") return "Not started";
  if (status === "pending") return "Pending setup";
  if (status === "restricted") return "Restricted";
  return "Connected";
}

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

export default function AccountPayouts() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.uid);
  const displayName = profile?.displayName ?? user?.displayName ?? null;
  const email = profile?.email ?? user?.email ?? null;
  const {
    tailgates,
    loading: tailgatesLoading,
    error: tailgatesError
  } = useHostTailgates(user?.uid);

  const [account, setAccount] = useState<PayoutAccountState>({
    status: "not_started",
    payoutsEnabled: false,
    accountId: null,
    requirementsDueCount: 0,
    loading: true,
    error: null
  });
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [profileDisplayName, setProfileDisplayName] = useState(displayName ?? "");
  const [profilePhotoOverride, setProfilePhotoOverride] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [refundFilter, setRefundFilter] = useState<RefundDecisionFilter>("pending");
  const [refundActionDraft, setRefundActionDraft] = useState<RefundActionDraft | null>(null);
  const [refundActionReason, setRefundActionReason] = useState("");
  const [refundActionFeedback, setRefundActionFeedback] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setProfileDisplayName(displayName ?? "");
  }, [displayName]);

  useEffect(() => {
    setProfilePhotoOverride(null);
  }, [user?.uid]);

  const photoURL = profilePhotoOverride ?? profile?.photoURL ?? user?.photoURL ?? null;
  const profileInitial = (profileDisplayName || email || "H").slice(0, 1).toUpperCase();

  useEffect(() => {
    if (!user?.uid) {
      setAccount({
        status: "not_started",
        payoutsEnabled: false,
        accountId: null,
        requirementsDueCount: 0,
        loading: false,
        error: null
      });
      return;
    }

    if (!db) {
      setAccount((previous) => ({ ...previous, loading: false, error: null }));
      return;
    }

    const userRef = doc(db, "users", user.uid);
    setAccount((previous) => ({ ...previous, loading: true, error: null }));

    const unsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        const data = snapshot.exists()
          ? (snapshot.data() as Record<string, unknown>)
          : {};
        const requirements = data.stripeConnectRequirements as
          | { currently_due?: unknown[] }
          | undefined;

        setAccount({
          status: normalizeConnectStatus(data.stripeConnectStatus),
          payoutsEnabled: data.payoutsEnabled === true,
          accountId:
            typeof data.stripeConnectAccountId === "string"
              ? data.stripeConnectAccountId
              : null,
          requirementsDueCount: Array.isArray(requirements?.currently_due)
            ? requirements.currently_due.length
            : 0,
          loading: false,
          error: null
        });
      },
      (snapshotError) => {
        console.error("Failed to load payout account", snapshotError);
        setAccount((previous) => ({
          ...previous,
          loading: false,
          error: "Unable to load payout account."
        }));
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const payoutReady =
    account.status === "complete" &&
    account.payoutsEnabled &&
    Boolean(account.accountId);

  const paidTailgates = useMemo(
    () =>
      tailgates
        .filter(
          (tailgate) =>
            tailgate.hostUserId === user?.uid &&
            tailgate.visibilityType === "open_paid"
        )
        .sort(
          (left, right) =>
            right.startDateTime.getTime() - left.startDateTime.getTime()
        ),
    [tailgates, user?.uid]
  );

  const paidTailgatesWithSales = useMemo(
    () => paidTailgates.filter((tailgate) => (tailgate.ticketsSold ?? 0) > 0),
    [paidTailgates]
  );

  const payoutTotals = useMemo(() => {
    return paidTailgatesWithSales.reduce(
      (summary, tailgate) => {
        const sold = tailgate.ticketsSold ?? 0;
        const estimate = estimateHostPayout({
          ticketsSold: sold,
          ticketPriceCents: tailgate.ticketPriceCents
        });

        summary.ticketsSold += sold;
        summary.gross += estimate.gross;
        summary.payout += estimate.payout;

        if (tailgate.payoutStatus === "sent") {
          summary.sent += estimate.payout;
        } else {
          summary.pending += estimate.payout;
        }
        return summary;
      },
      {
        ticketsSold: 0,
        gross: 0,
        payout: 0,
        pending: 0,
        sent: 0
      }
    );
  }, [paidTailgatesWithSales]);

  const recentPaidTailgates = paidTailgatesWithSales.slice(0, 6);
  const showRefundRequestsSection = paidTailgates.length > 0;
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

  const handleLogout = async () => {
    setOptionsError(null);
    if (!auth) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (logoutFailure) {
      console.error("Failed to log out", logoutFailure);
      setOptionsError("Unable to log out right now. Please try again.");
    }
  };

  const openExternal = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  type AccountOption = {
    key: string;
    label: string;
    helper: string;
    icon: React.ReactNode;
    onClick?: () => void;
    external?: boolean;
    danger?: boolean;
    disabled?: boolean;
    quick?: boolean;
  };

  const profileOptions: AccountOption[] = [
    {
      key: "my-notifications",
      label: "My Notifications",
      helper: "Messages",
      icon: <IconMessage size={18} />,
      quick: true,
      onClick: () => navigate("/messages")
    },
    {
      key: "notification-settings",
      label: "Notification Preferences",
      helper: "Coming soon on web",
      icon: <IconBell size={18} />,
      disabled: true
    },
    {
      key: "change-password",
      label: "Change Password",
      helper: "Coming soon on web",
      icon: <IconUser size={18} />,
      disabled: true
    },
    {
      key: "my-tickets",
      label: "My Tickets",
      helper: "Coming soon on web",
      icon: <IconUser size={18} />,
      disabled: true
    },
    {
      key: "contact-support",
      label: "Contact Support",
      helper: "tailgate-time.com",
      icon: <IconExternal size={18} />,
      external: true,
      onClick: () => openExternal("https://tailgate-time.com/contact.html")
    },
    {
      key: "terms",
      label: "Terms of Service",
      helper: "tailgate-time.com",
      icon: <IconExternal size={18} />,
      external: true,
      onClick: () => openExternal("https://tailgate-time.com/terms.html")
    },
    {
      key: "privacy",
      label: "Privacy Policy",
      helper: "tailgate-time.com",
      icon: <IconExternal size={18} />,
      external: true,
      onClick: () => openExternal("https://tailgate-time.com/privacy-policy.html")
    },
    {
      key: "logout",
      label: "Logout",
      helper: "Sign out of your account",
      icon: <IconUser size={18} />,
      danger: true,
      quick: true,
      onClick: () => void handleLogout()
    },
    {
      key: "delete-account",
      label: "Delete Account",
      helper: "App-only for now",
      icon: <IconUser size={18} />,
      danger: true,
      disabled: true
    }
  ];
  const quickOptions = profileOptions.filter((option) => option.quick);
  const moreOptions = profileOptions.filter((option) => !option.quick);

  const handleSetupPayouts = async () => {
    if (!user) {
      setSetupError("Sign in to set up payouts.");
      return;
    }
    if (!firebaseFunctions) {
      setSetupError("Payout setup is unavailable in this environment.");
      return;
    }

    setSetupError(null);
    setSetupLoading(true);
    try {
      const createLink = httpsCallable(
        firebaseFunctions,
        "createConnectOnboardingLink"
      );
      const result = await createLink({
        returnUrl: CONNECT_RETURN_URL,
        refreshUrl: CONNECT_REFRESH_URL
      });
      const url = (result.data as { url?: string } | null)?.url;
      if (!url || typeof url !== "string") {
        setSetupError("Unable to open payout setup right now.");
        return;
      }
      const popup = window.open(url, "_blank", "noopener,noreferrer");
      if (!popup) {
        window.location.assign(url);
      }
    } catch (setupFailure) {
      console.error("Failed to open payout setup", setupFailure);
      setSetupError("Unable to open payout setup. Please try again.");
    } finally {
      setSetupLoading(false);
    }
  };

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
          text: "Refund processed."
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

  const handleProfileSave = async () => {
    if (!user?.uid || !db) {
      setProfileError("Profile updates are unavailable right now.");
      return;
    }

    const nextName = profileDisplayName.trim();
    if (!nextName) {
      setProfileError("Display name cannot be empty.");
      return;
    }

    setProfileError(null);
    setProfileSuccess(null);
    setProfileSaving(true);
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          displayName: nextName,
          email: user.email ?? email ?? "",
          updatedAt: new Date()
        },
        { merge: true }
      );
      try {
        await updateAuthProfile(user, { displayName: nextName });
      } catch (authProfileFailure) {
        console.warn("Auth profile display name update failed", authProfileFailure);
      }
      setProfileSuccess("Profile updated successfully.");
    } catch (saveFailure) {
      console.error("Failed to update profile", saveFailure);
      setProfileError("Unable to update profile. Please try again.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleProfilePhotoSelected = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    if (!user?.uid || !storage || !db) {
      setProfileError("Photo upload is unavailable right now.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setProfileError("Please choose an image file.");
      return;
    }

    setProfileError(null);
    setProfileSuccess(null);
    setPhotoUploading(true);
    try {
      const imageRef = ref(storage, `profilePictures/${user.uid}.jpg`);
      await uploadBytes(imageRef, file, {
        contentType: file.type
      });
      const nextPhotoURL = await getDownloadURL(imageRef);
      const nextDisplayName = profileDisplayName.trim() || displayName || "";
      await setDoc(
        doc(db, "users", user.uid),
        {
          displayName: nextDisplayName,
          email: user.email ?? email ?? "",
          photoURL: nextPhotoURL,
          profilePhotoURL: nextPhotoURL,
          updatedAt: new Date()
        },
        { merge: true }
      );
      try {
        await updateAuthProfile(user, {
          photoURL: nextPhotoURL,
          displayName: nextDisplayName || undefined
        });
      } catch (authProfileFailure) {
        console.warn("Auth profile photo update failed", authProfileFailure);
      }
      setProfilePhotoOverride(nextPhotoURL);
      setProfileSuccess("Profile photo updated.");
    } catch (uploadFailure) {
      console.error("Failed to upload profile photo", uploadFailure);
      setProfileError("Unable to upload photo. Please try again.");
    } finally {
      setPhotoUploading(false);
    }
  };

  return (
    <AppShell header={<div className="simple-header"><h1>Account & Payouts</h1></div>}>
      <section className="payouts-page">
        <article className="payouts-card">
          <div className="section-header">
            <div>
              <h2>Profile details</h2>
              <p className="section-subtitle">
                Update your display name and profile picture.
              </p>
            </div>
          </div>
          <div className="account-profile-grid">
            <div className="account-profile-avatar-stack">
              <button
                type="button"
                className="account-profile-avatar"
                disabled={photoUploading}
                onClick={() => photoInputRef.current?.click()}
              >
                {photoURL ? (
                  <img src={photoURL} alt={profileDisplayName || "Profile"} />
                ) : (
                  <span>{profileInitial}</span>
                )}
              </button>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="account-profile-file-input"
                onChange={(event) => void handleProfilePhotoSelected(event)}
              />
              <button
                type="button"
                className="secondary-button"
                disabled={photoUploading}
                onClick={() => photoInputRef.current?.click()}
              >
                {photoUploading ? "Uploading..." : "Change photo"}
              </button>
            </div>
            <div className="account-profile-fields">
              <label className="input-group">
                <span className="input-label">Email</span>
                <div className="readonly-value">{email ?? "No email available"}</div>
              </label>
              <label className="input-group">
                <span className="input-label">Display Name</span>
                <input
                  className="text-input"
                  value={profileDisplayName}
                  onChange={(event) => setProfileDisplayName(event.target.value)}
                  placeholder="Enter your display name"
                />
              </label>
              <div className="account-profile-actions">
                <button
                  type="button"
                  className="primary-button"
                  disabled={profileSaving}
                  onClick={() => void handleProfileSave()}
                >
                  {profileSaving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
          {profileError ? <p className="error-banner">{profileError}</p> : null}
          {profileSuccess ? <p className="success-banner">{profileSuccess}</p> : null}
        </article>

        <article className="payouts-card">
          <div className="section-header">
            <div>
              <h2>Payout account</h2>
              <p className="section-subtitle">
                Stripe Connect status and payout readiness.
              </p>
            </div>
            <span
              className={`chip ${
                payoutReady
                  ? "chip-live"
                  : account.status === "restricted"
                  ? "chip-cancelled"
                  : "chip-upcoming"
              }`}
            >
              {statusLabel(account.status)}
            </span>
          </div>
          {account.loading ? (
            <p className="meta-muted">Checking payout account...</p>
          ) : account.error ? (
            <p className="error-banner">{account.error}</p>
          ) : payoutReady ? (
            <p className="meta-muted">
              Payouts are active. No action is needed unless you need to update
              bank or tax details in Stripe.
            </p>
          ) : (
            <div className="payouts-setup-block">
              <p className="meta-muted">
                {account.status === "restricted"
                  ? "Your payout account needs attention before payouts can resume."
                  : account.status === "pending"
                  ? "Finish Stripe onboarding to receive payouts."
                  : "Set up Stripe to accept paid tailgate ticket purchases."}
              </p>
              <button
                type="button"
                className="primary-button"
                disabled={setupLoading}
                onClick={() => void handleSetupPayouts()}
              >
                {setupLoading ? "Opening Stripe..." : "Finish payout setup"}
              </button>
              {account.requirementsDueCount > 0 ? (
                <p className="meta-muted">
                  Stripe requires {account.requirementsDueCount} additional
                  item{account.requirementsDueCount === 1 ? "" : "s"}.
                </p>
              ) : null}
              {setupError ? (
                <p className="tailgate-details-ticket-error">{setupError}</p>
              ) : null}
            </div>
          )}
        </article>

        <article className="payouts-card">
          <div className="section-header">
            <div>
              <h2>Payout overview</h2>
              <p className="section-subtitle">
                Summary from your paid tailgates.
              </p>
            </div>
          </div>
          {tailgatesLoading ? (
            <div className="tailgate-grid">
              <div className="tailgate-card skeleton" />
            </div>
          ) : tailgatesError ? (
            <p className="error-banner">{tailgatesError}</p>
          ) : (
            <div className="payouts-metric-grid">
              <div className="tailgate-details-metric-card">
                <p>Paid Tailgates</p>
                <strong>{paidTailgatesWithSales.length}</strong>
              </div>
              <div className="tailgate-details-metric-card">
                <p>Tickets Sold</p>
                <strong>{payoutTotals.ticketsSold}</strong>
              </div>
              <div className="tailgate-details-metric-card">
                <p>Gross Revenue</p>
                <strong>{formatCurrencyFromCents(payoutTotals.gross)}</strong>
              </div>
              <div className="tailgate-details-metric-card">
                <p>Est. Payout</p>
                <strong>{formatCurrencyFromCents(payoutTotals.payout)}</strong>
              </div>
              <div className="tailgate-details-metric-card">
                <p>Pending Payout</p>
                <strong>{formatCurrencyFromCents(payoutTotals.pending)}</strong>
              </div>
              <div className="tailgate-details-metric-card">
                <p>Payout Sent</p>
                <strong>{formatCurrencyFromCents(payoutTotals.sent)}</strong>
              </div>
            </div>
          )}
        </article>

        <article className="payouts-card">
          <div className="section-header">
            <div>
              <h2>Recent paid tailgates</h2>
              <p className="section-subtitle">
                Event-level payout status and estimates.
              </p>
            </div>
          </div>
          {recentPaidTailgates.length === 0 ? (
            <div className="empty-state">
              <p>No paid ticket sales yet.</p>
              <Link className="primary-button" to="/tailgates/new">
                Create a paid tailgate
              </Link>
            </div>
          ) : (
            <div className="payouts-tailgate-list">
              {recentPaidTailgates.map((tailgate) => {
                const estimate = estimateHostPayout({
                  ticketsSold: tailgate.ticketsSold,
                  ticketPriceCents: tailgate.ticketPriceCents
                });
                return (
                  <Link
                    className="payouts-tailgate-row"
                    key={tailgate.id}
                    to={`/tailgates/${tailgate.id}`}
                  >
                    <div>
                      <p className="payouts-tailgate-name">{tailgate.name}</p>
                      <p className="payouts-tailgate-meta">
                        {formatDateTime(tailgate.startDateTime)}
                      </p>
                    </div>
                    <div className="payouts-tailgate-right">
                      <span
                        className={`chip ${
                          tailgate.payoutStatus === "sent"
                            ? "chip-live"
                            : "chip-upcoming"
                        }`}
                      >
                        {tailgate.payoutStatus === "sent"
                          ? "Payout sent"
                          : "Payout pending"}
                      </span>
                      <p className="payouts-tailgate-amount">
                        {formatCurrencyFromCents(estimate.payout)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </article>

        {showRefundRequestsSection ? (
          <article className="payouts-card">
            <div className="section-header">
              <div>
                <h2>Refund requests</h2>
                <p className="section-subtitle">
                  Review guest requests and approve or deny.
                </p>
              </div>
            </div>
            <div className="filter-tabs payouts-refund-filter-tabs" role="tablist" aria-label="Refund request status">
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
                        {request.requestedAt ? formatDateTime(request.requestedAt) : "Requested recently"}
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
                        {request.guestReason?.trim() ? request.guestReason : "No guest reason provided."}
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
            {refundActionFeedback?.tone === "success" ? (
              <p className="success-banner">{refundActionFeedback.text}</p>
            ) : null}
            {refundActionFeedback?.tone === "error" ? (
              <p className="error-banner">{refundActionFeedback.text}</p>
            ) : null}
          </article>
        ) : null}

        <article className="payouts-card">
          <div className="section-header">
            <div>
              <h2>Profile options</h2>
              <p className="section-subtitle">
                Quick actions up front, with advanced items tucked away.
              </p>
            </div>
          </div>
          <div className="account-options-quick-grid">
            {quickOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                className={`account-option-tile ${option.danger ? "danger" : ""}`}
                disabled={option.disabled}
                onClick={() => {
                  setOptionsError(null);
                  option.onClick?.();
                }}
              >
                <span className="account-option-icon" aria-hidden>
                  {option.icon}
                </span>
                <span className="account-option-copy">
                  <strong>{option.label}</strong>
                  <span>{option.helper}</span>
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="account-options-toggle"
            onClick={() => setShowMoreOptions((current) => !current)}
          >
            {showMoreOptions ? "Hide additional options" : `More options (${moreOptions.length})`}
          </button>

          {showMoreOptions ? (
            <div className="account-options-list">
              {moreOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  className={`account-option-row ${option.danger ? "danger" : ""} ${
                    option.external ? "external" : ""
                  }`}
                  disabled={option.disabled}
                  onClick={() => {
                    setOptionsError(null);
                    option.onClick?.();
                  }}
                >
                  <span className="account-option-icon" aria-hidden>
                    {option.icon}
                  </span>
                  <span className="account-option-copy">
                    <strong>{option.label}</strong>
                    <span>{option.helper}</span>
                  </span>
                  <span className="account-option-arrow" aria-hidden>
                    {option.external ? <IconExternal size={16} /> : "›"}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
          {optionsError ? <p className="error-banner">{optionsError}</p> : null}
        </article>

        {refundActionDraft ? (
          <div className="create-wizard-modal-overlay" role="dialog" aria-modal="true">
            <div className="create-wizard-modal create-wizard-refund-modal">
              <div className="create-wizard-modal-header">
                <h3>
                  {refundActionDraft.type === "approve"
                    ? `Refund this ticket for ${
                        typeof refundActionDraft.request.amountCents === "number"
                          ? formatCurrencyFromCents(refundActionDraft.request.amountCents)
                          : "the ticket amount"
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

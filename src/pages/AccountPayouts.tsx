import React, { useEffect, useMemo, useRef, useState } from "react";
import { updateProfile as updateAuthProfile } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import { useAuth } from "../hooks/useAuth";
import { useHostTailgates } from "../hooks/useHostTailgates";
import { useUserProfile } from "../hooks/useUserProfile";
import { db, functions as firebaseFunctions, storage } from "../lib/firebase";
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

export default function AccountPayouts() {
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

  const payoutTotals = useMemo(() => {
    return paidTailgates.reduce(
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
  }, [paidTailgates]);

  const recentPaidTailgates = paidTailgates.slice(0, 6);

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
                <strong>{paidTailgates.length}</strong>
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
              <p>No paid tailgates yet.</p>
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
      </section>
    </AppShell>
  );
}

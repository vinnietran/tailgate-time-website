import React, { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { updateProfile as updateAuthProfile } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import {
  IconBell,
  IconMessage,
  IconUser
} from "../components/Icons";
import { useAuth } from "../hooks/useAuth";
import { useDialog } from "../hooks/useDialog";
import { useUserProfile } from "../hooks/useUserProfile";
import { auth, db, functions as firebaseFunctions, storage } from "../lib/firebase";
import {
  DeleteAccountReauthRequiredError,
  deleteCurrentAccount
} from "../services/account";
import { buildConnectCallbackUrl } from "../utils/connectCallbacks";
import { formatCurrencyFromCents } from "../utils/format";

type StripeConnectStatus = "not_started" | "pending" | "complete" | "restricted";

type PayoutAccountState = {
  status: StripeConnectStatus;
  payoutsEnabled: boolean;
  accountId: string | null;
  requirementsDueCount: number;
  loading: boolean;
  error: string | null;
};

type HostPayoutSummary = {
  paidTailgatesCount: number;
  ticketsSoldCount: number;
  grossRevenueCents: number;
  estPayoutCents: number;
  pendingPayoutCents: number;
  payoutSentCents: number;
};

const CONNECT_RETURN_URL =
  import.meta.env.VITE_CONNECT_RETURN_URL ?? "https://tailgate-time.com/connect-return";
const CONNECT_REFRESH_URL =
  import.meta.env.VITE_CONNECT_REFRESH_URL ?? "https://tailgate-time.com/connect-refresh";

const EMPTY_PAYOUT_SUMMARY: HostPayoutSummary = {
  paidTailgatesCount: 0,
  ticketsSoldCount: 0,
  grossRevenueCents: 0,
  estPayoutCents: 0,
  pendingPayoutCents: 0,
  payoutSentCents: 0
};

function toNonNegativeWholeNumber(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.round(parsed));
}

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
  const location = useLocation();
  const navigate = useNavigate();
  const dialog = useDialog();
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.uid);
  const displayName = profile?.displayName ?? user?.displayName ?? null;
  const email = profile?.email ?? user?.email ?? null;

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
  const [payoutSummary, setPayoutSummary] = useState<HostPayoutSummary>(
    EMPTY_PAYOUT_SUMMARY
  );
  const [payoutSummaryLoading, setPayoutSummaryLoading] = useState(false);
  const [payoutSummaryError, setPayoutSummaryError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const usesPasswordProvider = user?.providerData.some(
    (provider) => provider.providerId === "password"
  );

  useEffect(() => {
    setProfileDisplayName(displayName ?? "");
  }, [displayName]);

  useEffect(() => {
    setProfilePhotoOverride(null);
  }, [user?.uid]);

  const photoURL = profilePhotoOverride ?? profile?.photoURL ?? user?.photoURL ?? null;
  const profileInitial = (profileDisplayName || email || "H").slice(0, 1).toUpperCase();
  const connectRedirectPath = `${location.pathname}${location.search}`;
  const connectReturnUrl = buildConnectCallbackUrl(CONNECT_RETURN_URL, connectRedirectPath);
  const connectRefreshUrl = buildConnectCallbackUrl(
    CONNECT_REFRESH_URL,
    connectRedirectPath
  );

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

  useEffect(() => {
    if (!user?.uid || !firebaseFunctions) {
      setPayoutSummary(EMPTY_PAYOUT_SUMMARY);
      setPayoutSummaryLoading(false);
      setPayoutSummaryError(null);
      return;
    }
    const functionsService = firebaseFunctions;

    let isMounted = true;
    const fetchSummary = async () => {
      setPayoutSummaryLoading(true);
      setPayoutSummaryError(null);
      try {
        const getHostPayoutSummaryFn = httpsCallable(
          functionsService,
          "getHostPayoutSummary"
        );
        const result = await getHostPayoutSummaryFn({ hostUserId: user.uid });
        const data = (result.data ?? {}) as Partial<HostPayoutSummary>;
        if (!isMounted) return;
        setPayoutSummary({
          paidTailgatesCount: toNonNegativeWholeNumber(data.paidTailgatesCount),
          ticketsSoldCount: toNonNegativeWholeNumber(data.ticketsSoldCount),
          grossRevenueCents: toNonNegativeWholeNumber(data.grossRevenueCents),
          estPayoutCents: toNonNegativeWholeNumber(data.estPayoutCents),
          pendingPayoutCents: toNonNegativeWholeNumber(data.pendingPayoutCents),
          payoutSentCents: toNonNegativeWholeNumber(data.payoutSentCents)
        });
      } catch (error) {
        console.error("Failed to load host payout summary", error);
        if (!isMounted) return;
        setPayoutSummary(EMPTY_PAYOUT_SUMMARY);
        setPayoutSummaryError("Unable to load payout summary right now.");
      } finally {
        if (isMounted) {
          setPayoutSummaryLoading(false);
        }
      }
    };

    void fetchSummary();
    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  const handleLogout = async () => {
    if (!auth) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (logoutFailure) {
      console.error("Failed to log out", logoutFailure);
    }
  };

  type AccountOption = {
    key: string;
    label: string;
    helper: string;
    icon: React.ReactNode;
    onClick?: () => void;
    danger?: boolean;
    disabled?: boolean;
  };

  const quickOptions: AccountOption[] = [
    {
      key: "my-notifications",
      label: "My Notifications",
      helper: "Messages",
      icon: <IconMessage size={18} />,
      onClick: () => navigate("/messages")
    },
    {
      key: "notification-settings",
      label: "Notification Preferences",
      helper: "Manage alerts",
      icon: <IconBell size={18} />,
      onClick: () => navigate("/account/notifications")
    },
    {
      key: "change-password",
      label: "Change Password",
      helper: "Update your sign-in",
      icon: <IconUser size={18} />,
      onClick: () => navigate("/account/change-password")
    },
    {
      key: "logout",
      label: "Logout",
      helper: "Sign out of your account",
      icon: <IconUser size={18} />,
      danger: true,
      onClick: () => void handleLogout()
    },
    {
      key: "delete-account",
      label: "Delete Account",
      helper: "Permanently remove your account",
      icon: <IconUser size={18} />,
      danger: true,
      onClick: () => void handleDeleteAccountStart()
    }
  ];

  const handleDeleteAccountStart = async () => {
    const confirmed = await dialog.confirm({
      title: "Delete account?",
      message:
        "This permanently removes your TailgateTime account from the web dashboard. You'll confirm once more in the next step.",
      confirmLabel: "Continue",
      cancelLabel: "Keep account",
      tone: "danger"
    });

    if (!confirmed) {
      return;
    }

    setDeleteConfirmText("");
    setDeletePassword("");
    setDeleteError(null);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleteLoading) {
      return;
    }
    setDeleteModalOpen(false);
    setDeleteConfirmText("");
    setDeletePassword("");
    setDeleteError(null);
  };

  const handleDeleteAccountSubmit = async () => {
    if (!user) {
      setDeleteError("Sign in again before deleting your account.");
      return;
    }

    if (deleteConfirmText.trim().toUpperCase() !== "DELETE") {
      setDeleteError('Type "DELETE" to continue.');
      return;
    }

    if (usesPasswordProvider && !deletePassword.trim()) {
      setDeleteError("Enter your current password to delete this account.");
      return;
    }

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      await deleteCurrentAccount({
        password: usesPasswordProvider ? deletePassword : undefined
      });
      setDeleteModalOpen(false);
      navigate("/", { replace: true });
    } catch (deleteFailure) {
      console.error("Failed to delete account", deleteFailure);
      const code =
        typeof deleteFailure === "object" && deleteFailure && "code" in deleteFailure
          ? String((deleteFailure as { code?: unknown }).code)
          : "";

      if (
        deleteFailure instanceof DeleteAccountReauthRequiredError ||
        code === "auth/requires-recent-login"
      ) {
        setDeleteError(
          usesPasswordProvider
            ? "Enter your current password to confirm this delete."
            : "Sign in again with your provider, then retry the delete."
        );
      } else if (
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential" ||
        code === "auth/invalid-login-credentials"
      ) {
        setDeleteError("Your current password is incorrect.");
      } else if (code === "auth/popup-closed-by-user") {
        setDeleteError("Reauthentication was canceled before the delete finished.");
      } else if (code === "auth/popup-blocked") {
        setDeleteError("Allow the sign-in popup to finish deleting your account.");
      } else {
        setDeleteError("Unable to delete your account right now. Please try again.");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

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
        returnUrl: connectReturnUrl,
        refreshUrl: connectRefreshUrl
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
                onChange={(inputEvent) => void handleProfilePhotoSelected(inputEvent)}
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
                  onChange={(inputEvent) => setProfileDisplayName(inputEvent.target.value)}
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
          {payoutSummaryLoading ? (
            <div className="tailgate-grid">
              <div className="tailgate-card skeleton" />
            </div>
          ) : payoutSummaryError ? (
            <p className="error-banner">{payoutSummaryError}</p>
          ) : (
            <>
              <div className="payouts-metric-grid">
                <div className="tailgate-details-metric-card">
                  <p>Paid Tailgates</p>
                  <strong>{payoutSummary.paidTailgatesCount}</strong>
                </div>
                <div className="tailgate-details-metric-card">
                  <p>Tickets Sold</p>
                  <strong>{payoutSummary.ticketsSoldCount}</strong>
                </div>
                <div className="tailgate-details-metric-card">
                  <p>Gross Revenue</p>
                  <strong>{formatCurrencyFromCents(payoutSummary.grossRevenueCents)}</strong>
                </div>
                <div className="tailgate-details-metric-card">
                  <p>Est. Payout</p>
                  <strong>{formatCurrencyFromCents(payoutSummary.estPayoutCents)}</strong>
                </div>
                <div className="tailgate-details-metric-card">
                  <p>Pending Payout</p>
                  <strong>{formatCurrencyFromCents(payoutSummary.pendingPayoutCents)}</strong>
                </div>
                <div className="tailgate-details-metric-card">
                  <p>Payout Sent</p>
                  <strong>{formatCurrencyFromCents(payoutSummary.payoutSentCents)}</strong>
                </div>
              </div>
              <div className="payouts-overview-actions">
                <Link className="secondary-button" to="/account/payout-history">
                  View payout history
                </Link>
              </div>
            </>
          )}
        </article>

        <article className="payouts-card">
          <div className="section-header">
            <div>
              <h2>Profile options</h2>
              <p className="section-subtitle">
                Quick actions for your account.
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
                onClick={() => option.onClick?.()}
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
        </article>
      </section>
      {deleteModalOpen ? (
        <div className="create-wizard-modal-overlay" role="dialog" aria-modal="true">
          <div className="create-wizard-modal account-delete-modal">
            <div className="create-wizard-modal-header">
              <h3>Final delete confirmation</h3>
              <button
                type="button"
                className="secondary-button"
                onClick={closeDeleteModal}
                disabled={deleteLoading}
              >
                ×
              </button>
            </div>
            <p className="account-delete-copy">
              Type <strong>DELETE</strong> to permanently remove your account.
            </p>
            <label className="input-group">
              <span className="input-label">Type DELETE</span>
              <input
                className="text-input account-delete-input"
                value={deleteConfirmText}
                onChange={(event) => setDeleteConfirmText(event.target.value)}
                placeholder="DELETE"
                autoFocus
              />
            </label>
            {usesPasswordProvider ? (
              <label className="input-group">
                <span className="input-label">Current Password</span>
                <input
                  className="text-input account-delete-input"
                  type="password"
                  value={deletePassword}
                  onChange={(event) => setDeletePassword(event.target.value)}
                  placeholder="Enter current password"
                />
              </label>
            ) : null}
            {deleteError ? <p className="error-banner">{deleteError}</p> : null}
            <div className="app-dialog-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={closeDeleteModal}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="primary-button app-dialog-danger"
                onClick={() => void handleDeleteAccountSubmit()}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete account"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}

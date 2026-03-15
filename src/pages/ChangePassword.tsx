import React, { useMemo, useState } from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { IconUser } from "../components/Icons";
import { auth } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";

type PasswordRule = {
  label: string;
  met: boolean;
};

function normalizePasswordError(error: unknown) {
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";

  if (code.includes("wrong-password") || code.includes("invalid-credential")) {
    return "Your current password is incorrect.";
  }
  if (code.includes("weak-password")) {
    return "Choose a stronger password.";
  }
  if (code.includes("too-many-requests")) {
    return "Too many attempts. Please wait and try again.";
  }
  return "Unable to update your password right now.";
}

export default function ChangePassword() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNextPassword, setShowNextPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const currentUser = auth?.currentUser ?? user;
  const userEmail = currentUser?.email?.trim() ?? "";
  const supportsPasswordChange = currentUser?.providerData.some(
    (provider) => provider.providerId === "password"
  );

  const passwordRules: PasswordRule[] = useMemo(
    () => [
      { label: "At least 8 characters", met: nextPassword.length >= 8 },
      { label: "One uppercase letter", met: /[A-Z]/.test(nextPassword) },
      { label: "One lowercase letter", met: /[a-z]/.test(nextPassword) },
      { label: "One number", met: /\d/.test(nextPassword) },
      { label: "One special character", met: /[^A-Za-z0-9]/.test(nextPassword) }
    ],
    [nextPassword]
  );

  const isPasswordValid = passwordRules.every((rule) => rule.met);
  const passwordsMatch = nextPassword.length > 0 && nextPassword === confirmPassword;
  const canSubmit =
    Boolean(currentUser) &&
    Boolean(userEmail) &&
    Boolean(supportsPasswordChange) &&
    currentPassword.length > 0 &&
    isPasswordValid &&
    passwordsMatch &&
    !loading;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!auth || !currentUser || !userEmail) {
      setError("Sign in again before changing your password.");
      return;
    }

    if (!supportsPasswordChange) {
      setError("This account uses Google sign-in. Update your password with Google instead.");
      return;
    }

    if (!currentPassword.trim()) {
      setError("Enter your current password.");
      return;
    }

    if (!isPasswordValid) {
      setError("Choose a stronger password.");
      return;
    }

    if (!passwordsMatch) {
      setError("Your new passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const credential = EmailAuthProvider.credential(userEmail, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, nextPassword);
      setSuccess("Your password has been updated.");
      setCurrentPassword("");
      setNextPassword("");
      setConfirmPassword("");
      navigate("/account", { replace: true });
    } catch (updateFailure) {
      console.error("Failed to update password", updateFailure);
      setError(normalizePasswordError(updateFailure));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell header={<div className="simple-header"><h1>Change Password</h1></div>}>
      <section className="payouts-page account-page-stack">
        <article className="payouts-card account-hero-card">
          <div className="account-page-badge">
            <IconUser size={16} />
            <span>Security</span>
          </div>
          <div className="account-hero-grid">
            <div>
              <h2>Keep your account secure.</h2>
              <p className="section-subtitle">
                Use a strong password you have not used before, then update it here in one step.
              </p>
            </div>
            <div className="account-hero-actions">
              <div className="tailgate-details-metric-card">
                <p>Sign-in email</p>
                <strong>{userEmail || "Unavailable"}</strong>
              </div>
              <Link className="secondary-button" to="/account">
                Back to account
              </Link>
            </div>
          </div>
        </article>

        {!currentUser ? (
          <article className="payouts-card">
            <p className="error-banner">Sign in to change your password.</p>
          </article>
        ) : !supportsPasswordChange ? (
          <article className="payouts-card">
            <p className="meta-muted">
              This account signs in with Google. Update your password through your Google account.
            </p>
          </article>
        ) : (
          <>
            <article className="payouts-card">
              <div className="section-header">
                <div>
                  <h2>Update credentials</h2>
                  <p className="section-subtitle">
                    Re-enter your current password before choosing a new one.
                  </p>
                </div>
              </div>

              <form className="login-form" onSubmit={handleSubmit}>
                <label className="input-group">
                  <span className="input-label">Current Password</span>
                  <div className="auth-password-wrap">
                    <input
                      className="text-input"
                      type={showCurrentPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="auth-password-toggle account-password-toggle"
                      onClick={() => setShowCurrentPassword((value) => !value)}
                    >
                      {showCurrentPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </label>

                <label className="input-group">
                  <span className="input-label">New Password</span>
                  <div className="auth-password-wrap">
                    <input
                      className="text-input"
                      type={showNextPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={nextPassword}
                      onChange={(event) => setNextPassword(event.target.value)}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="auth-password-toggle account-password-toggle"
                      onClick={() => setShowNextPassword((value) => !value)}
                    >
                      {showNextPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </label>

                <label className="input-group">
                  <span className="input-label">Confirm New Password</span>
                  <div className="auth-password-wrap">
                    <input
                      className="text-input"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="auth-password-toggle account-password-toggle"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </label>

                {error ? <p className="error-banner">{error}</p> : null}
                {success ? <p className="success-banner">{success}</p> : null}

                <div className="account-profile-actions">
                  <button type="submit" className="primary-button" disabled={!canSubmit}>
                    {loading ? "Updating..." : "Update password"}
                  </button>
                </div>
              </form>
            </article>

            <article className="payouts-card">
              <div className="section-header">
                <div>
                  <h2>Password checklist</h2>
                  <p className="section-subtitle">
                    Your new password should satisfy every requirement below.
                  </p>
                </div>
              </div>
              <div className="password-rule-list">
                {passwordRules.map((rule) => (
                  <div key={rule.label} className={`password-rule-row ${rule.met ? "met" : ""}`}>
                    <span className="password-rule-indicator" aria-hidden>
                      {rule.met ? "✓" : "○"}
                    </span>
                    <span>{rule.label}</span>
                  </div>
                ))}
              </div>
            </article>
          </>
        )}
      </section>
    </AppShell>
  );
}

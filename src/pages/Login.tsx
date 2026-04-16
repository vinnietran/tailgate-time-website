import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  type User
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { PublicTopNav } from "../components/PublicTopNav";
import SiteFooter from "../components/SiteFooter";
import { useAuth } from "../hooks/useAuth";
import {
  consumeClientRateLimit,
  formatRateLimitRetryAfter,
  resetClientRateLimit
} from "../utils/abuseGuard";
import { debugAuthLog } from "../utils/debug";
import tailgateTimeLogo from "../../ttnobg.png";

const AUTH_RATE_LIMIT_OPTIONS = {
  maxAttempts: 5,
  windowMs: 60 * 1000,
  blockMs: 10 * 60 * 1000
} as const;

function resolveRedirectPath(value: string | null) {
  if (!value) return "/dashboard";
  if (!value.startsWith("/")) return "/dashboard";
  if (value.startsWith("//")) return "/dashboard";
  return value;
}

function normalizeAuthError(error: unknown, isCreating: boolean) {
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";

  switch (code) {
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/email-already-in-use":
      return "That email is already in use. Try signing in instead.";
    case "auth/weak-password":
      return "Use a stronger password with at least 8 characters.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Email or password is incorrect.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was canceled.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait and try again.";
    default:
      return isCreating
        ? "Could not create account right now. Please try again."
        : "Could not sign in right now. Please try again.";
  }
}

function buildPasswordChecks(value: string) {
  return {
    length: value.length >= 8,
    lower: /[a-z]/.test(value),
    upper: /[A-Z]/.test(value),
    number: /[0-9]/.test(value),
    symbol: /[^A-Za-z0-9]/.test(value)
  };
}

function formatPhoneInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  const part1 = digits.slice(0, 3);
  const part2 = digits.slice(3, 6);
  const part3 = digits.slice(6, 10);
  if (digits.length <= 3) return part1;
  if (digits.length <= 6) return `(${part1}) ${part2}`;
  return `(${part1}) ${part2}-${part3}`;
}

function normalizePhoneE164(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 10) return null;
  return `+1${digits}`;
}

function isValidPhone(value: string) {
  return Boolean(normalizePhoneE164(value));
}

async function upsertUserProfile(params: {
  user: User;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  emailFallback?: string;
  phone?: string;
}) {
  const { user, firstName, lastName, displayName, emailFallback, phone } = params;
  if (!db) return;

  const nextDisplayName = displayName?.trim() || user.displayName?.trim() || "";
  const normalizedPhone = phone?.trim() ?? "";
  const phoneE164 = normalizedPhone ? normalizePhoneE164(normalizedPhone) : null;
  const payload: Record<string, unknown> = {
    email: user.email ?? emailFallback ?? "",
    displayName: nextDisplayName,
    updatedAt: new Date()
  };

  if (firstName?.trim()) {
    payload.firstName = firstName.trim();
  }
  if (lastName?.trim()) {
    payload.lastName = lastName.trim();
  }
  if (normalizedPhone) {
    payload.phone = normalizedPhone;
    payload.phoneNumber = normalizedPhone;
    if (phoneE164) {
      payload.phoneE164 = phoneE164;
    }
  }

  await setDoc(doc(db, "users", user.uid), payload, { merge: true });
}

export default function Login() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const signupMode = searchParams.get("mode") === "signup";
  const redirectPath = resolveRedirectPath(searchParams.get("redirect"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isCreating, setIsCreating] = useState(signupMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const passwordChecks = useMemo(() => buildPasswordChecks(password), [password]);
  const requiredPasswordChecksMet =
    passwordChecks.length &&
    passwordChecks.lower &&
    passwordChecks.upper &&
    passwordChecks.number;
  const passwordStrengthScore = [
    passwordChecks.length,
    passwordChecks.lower,
    passwordChecks.upper,
    passwordChecks.number,
    passwordChecks.symbol
  ].filter(Boolean).length;

  const passwordStrengthLabel =
    passwordStrengthScore <= 1
      ? "Weak"
      : passwordStrengthScore <= 2
      ? "Fair"
      : passwordStrengthScore <= 3
      ? "Good"
      : passwordStrengthScore <= 4
      ? "Strong"
      : "Very strong";

  useEffect(() => {
    setIsCreating(signupMode);
  }, [signupMode]);

  useEffect(() => {
    if (!isCreating) {
      setConfirmPassword("");
      setAcceptedTerms(false);
      setShowConfirmPassword(false);
      setFieldErrors({});
    }
  }, [isCreating]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (user) {
    debugAuthLog("login:already-authenticated", { uid: user.uid, redirectPath });
    return <Navigate to={redirectPath} replace />;
  }

  const updateMode = (nextMode: "login" | "signup") => {
    const nextCreating = nextMode === "signup";
    setIsCreating(nextCreating);
    setError(null);
    setFieldErrors({});

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("mode", nextMode);
    setSearchParams(nextParams, { replace: true });
  };

  const clearFieldError = (field: string) => {
    if (!fieldErrors[field]) return;
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleEmailAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!auth) {
      setError("Firebase config missing. Add env variables to enable login.");
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    const nextFieldErrors: Record<string, string> = {};

    if (!trimmedEmail) {
      nextFieldErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextFieldErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextFieldErrors.password = "Password is required.";
    }

    if (isCreating) {
      if (!firstName.trim()) nextFieldErrors.firstName = "First name is required.";
      if (!lastName.trim()) nextFieldErrors.lastName = "Last name is required.";
      if (!isValidPhone(phone)) {
        nextFieldErrors.phone = "Enter a valid phone number.";
      }
      if (!requiredPasswordChecksMet) {
        nextFieldErrors.password =
          "Use at least 8 characters with upper, lower, and a number.";
      }
      if (!confirmPassword) {
        nextFieldErrors.confirmPassword = "Confirm your password.";
      } else if (confirmPassword !== password) {
        nextFieldErrors.confirmPassword = "Passwords do not match.";
      }
      if (!acceptedTerms) {
        nextFieldErrors.terms = "You must accept the terms to create an account.";
      }
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setError("Please fix the highlighted fields and try again.");
      return;
    }

    setFieldErrors({});

    const authRateLimitKey = isCreating ? "auth-signup" : "auth-login";
    const authBudget = consumeClientRateLimit(authRateLimitKey, AUTH_RATE_LIMIT_OPTIONS);
    if (!authBudget.allowed) {
      setError(
        `Too many ${isCreating ? "sign-up" : "sign-in"} attempts from this browser. Wait ${formatRateLimitRetryAfter(authBudget.retryAfterMs)} and try again.`
      );
      return;
    }

    try {
      setLoading(true);
      debugAuthLog(isCreating ? "login:create-email" : "login:email", { email: trimmedEmail });
      if (isCreating) {
        const credentials = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
        const nextFirstName = firstName.trim();
        const nextLastName = lastName.trim();
        const displayName = `${nextFirstName} ${nextLastName}`.trim();

        if (displayName) {
          await updateProfile(credentials.user, { displayName });
        }
        await upsertUserProfile({
          user: credentials.user,
          firstName: nextFirstName,
          lastName: nextLastName,
          displayName,
          emailFallback: trimmedEmail,
          phone: phone.trim()
        });
      } else {
        const credentials = await signInWithEmailAndPassword(auth, trimmedEmail, password);
        await upsertUserProfile({
          user: credentials.user,
          emailFallback: trimmedEmail
        });
      }
      resetClientRateLimit(authRateLimitKey);
    } catch (err) {
      setError(normalizeAuthError(err, isCreating));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-page">
      <PublicTopNav />
      <div className="login-page">
        <div className={`login-card ${isCreating ? "signup" : "signin"}`}>
          <div className="logo">
            <img className="logo-image" src={tailgateTimeLogo} alt="TailgateTime logo" />
            <div>
              <p className="logo-title">TailgateTime</p>
              <p className="logo-subtitle">Host Dashboard</p>
            </div>
          </div>
          <div className="auth-mode-toggle" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              role="tab"
              aria-selected={!isCreating}
              className={`auth-mode-tab ${!isCreating ? "active" : ""}`}
              onClick={() => updateMode("login")}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isCreating}
              className={`auth-mode-tab ${isCreating ? "active" : ""}`}
              onClick={() => updateMode("signup")}
            >
              Sign up
            </button>
          </div>
          <h1>{isCreating ? "Create your TailgateTime account" : "Sign in to TailgateTime"}</h1>
          <p className="auth-subcopy">
            {auth
              ? isCreating
                ? "Set up your account to host, discover, and manage game-day plans."
                : "Welcome back. Sign in to continue where you left off."
              : "Add Firebase config to enable authentication."}
          </p>

          {error ? <div className="error-banner">{error}</div> : null}

          <form className="login-form" onSubmit={handleEmailAuth}>
            {isCreating ? (
              <div className="auth-name-grid">
                <label className="input-group">
                  <span className="input-label">First Name</span>
                  <input
                    className={`text-input ${fieldErrors.firstName ? "invalid" : ""}`}
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(event) => {
                      setFirstName(event.target.value);
                      clearFieldError("firstName");
                    }}
                    placeholder="First Name"
                    disabled={!auth || loading}
                  />
                  {fieldErrors.firstName ? <p className="input-error">{fieldErrors.firstName}</p> : null}
                </label>
                <label className="input-group">
                  <span className="input-label">Last Name</span>
                  <input
                    className={`text-input ${fieldErrors.lastName ? "invalid" : ""}`}
                    type="text"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(event) => {
                      setLastName(event.target.value);
                      clearFieldError("lastName");
                    }}
                    placeholder="Last Name"
                    disabled={!auth || loading}
                  />
                  {fieldErrors.lastName ? <p className="input-error">{fieldErrors.lastName}</p> : null}
                </label>
              </div>
            ) : null}

            {isCreating ? (
              <label className="input-group">
                <span className="input-label">Phone</span>
                <input
                  className={`text-input ${fieldErrors.phone ? "invalid" : ""}`}
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(event) => {
                    setPhone(formatPhoneInput(event.target.value));
                    clearFieldError("phone");
                  }}
                  placeholder="(555) 555-5555"
                  disabled={!auth || loading}
                />
                {fieldErrors.phone ? <p className="input-error">{fieldErrors.phone}</p> : null}
              </label>
            ) : null}

            <label className="input-group">
              <span className="input-label">Email</span>
              <input
                className={`text-input ${fieldErrors.email ? "invalid" : ""}`}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  clearFieldError("email");
                }}
                placeholder="you@tailgatetime.com"
                disabled={!auth || loading}
              />
              {fieldErrors.email ? <p className="input-error">{fieldErrors.email}</p> : null}
            </label>
            <label className="input-group">
              <span className="input-label">Password</span>
              <div className="auth-password-wrap">
                <input
                  className={`text-input ${fieldErrors.password ? "invalid" : ""}`}
                  type={showPassword ? "text" : "password"}
                  autoComplete={isCreating ? "new-password" : "current-password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    clearFieldError("password");
                  }}
                  placeholder="••••••••"
                  disabled={!auth || loading}
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {fieldErrors.password ? <p className="input-error">{fieldErrors.password}</p> : null}
            </label>

            {isCreating ? (
              <>
                <label className="input-group">
                  <span className="input-label">Confirm Password</span>
                  <div className="auth-password-wrap">
                    <input
                      className={`text-input ${fieldErrors.confirmPassword ? "invalid" : ""}`}
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) => {
                        setConfirmPassword(event.target.value);
                        clearFieldError("confirmPassword");
                      }}
                      placeholder="••••••••"
                      disabled={!auth || loading}
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword ? (
                    <p className="input-error">{fieldErrors.confirmPassword}</p>
                  ) : null}
                </label>

                <div className="signup-password-panel">
                  <div className="signup-password-meter">
                    <div
                      className={`signup-password-meter-bar strength-${passwordStrengthScore}`}
                      style={{
                        width: password ? `${Math.max(16, passwordStrengthScore * 20)}%` : "0%"
                      }}
                    />
                  </div>
                  <p className="signup-password-strength">Password strength: {passwordStrengthLabel}</p>
                  <ul className="signup-password-rules">
                    <li className={passwordChecks.length ? "met" : ""}>At least 8 characters</li>
                    <li className={passwordChecks.upper ? "met" : ""}>One uppercase letter</li>
                    <li className={passwordChecks.lower ? "met" : ""}>One lowercase letter</li>
                    <li className={passwordChecks.number ? "met" : ""}>One number</li>
                    <li className={passwordChecks.symbol ? "met" : ""}>One symbol (recommended)</li>
                  </ul>
                </div>

                <label className="auth-checkbox-row">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) => {
                      setAcceptedTerms(event.target.checked);
                      clearFieldError("terms");
                    }}
                    disabled={!auth || loading}
                  />
                  <span>I agree to the Terms and Privacy Policy.</span>
                </label>
                {fieldErrors.terms ? <p className="input-error">{fieldErrors.terms}</p> : null}
              </>
            ) : null}

            <button className="primary-button" type="submit" disabled={loading || !auth}>
              {loading ? "Working..." : isCreating ? "Create account" : "Sign in"}
            </button>
          </form>

          <button
            className="ghost-button"
            type="button"
            onClick={() => updateMode(isCreating ? "login" : "signup")}
          >
            {isCreating ? "Already have an account? Sign in" : "New here? Create account"}
          </button>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

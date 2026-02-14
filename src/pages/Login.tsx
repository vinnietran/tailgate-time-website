import React, { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { PublicTopNav } from "../components/PublicTopNav";
import SiteFooter from "../components/SiteFooter";
import { useAuth } from "../hooks/useAuth";
import { debugAuthLog } from "../utils/debug";
import tailgateTimeLogo from "../../ttnobg.png";

export default function Login() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const signupMode = searchParams.get("mode") === "signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCreating, setIsCreating] = useState(signupMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsCreating(signupMode);
  }, [signupMode]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (user) {
    debugAuthLog("login:already-authenticated", { uid: user.uid });
    return <Navigate to="/dashboard" replace />;
  }

  const handleEmailAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!auth) {
      setError("Firebase config missing. Add env variables to enable login.");
      return;
    }

    if (!email || !password) {
      setError("Enter an email and password to continue.");
      return;
    }

    try {
      setLoading(true);
      debugAuthLog(isCreating ? "login:create-email" : "login:email", { email });
      if (isCreating) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign-in failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);

    if (!auth) {
      setError("Firebase config missing. Add env variables to enable login.");
      return;
    }

    try {
      setLoading(true);
      debugAuthLog("login:google");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Google sign-in failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-page">
      <PublicTopNav />
      <div className="login-page">
        <div className="login-card">
          <div className="logo">
            <img className="logo-image" src={tailgateTimeLogo} alt="TailgateTime logo" />
            <div>
              <p className="logo-title">TailgateTime</p>
              <p className="logo-subtitle">Host Dashboard</p>
            </div>
          </div>
          <h1>{isCreating ? "Create host account" : "Sign in to host"}</h1>
          <p>
            {auth
              ? "Use your TailgateTime credentials to continue."
              : "Add Firebase config to enable authentication."}
          </p>

          {error ? <div className="error-banner">{error}</div> : null}

          <form className="login-form" onSubmit={handleEmailAuth}>
            <label className="input-group">
              <span className="input-label">Email</span>
              <input
                className="text-input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@tailgatetime.com"
                disabled={!auth || loading}
              />
            </label>
            <label className="input-group">
              <span className="input-label">Password</span>
              <input
                className="text-input"
                type="password"
                autoComplete={isCreating ? "new-password" : "current-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                disabled={!auth || loading}
              />
            </label>
            <button className="primary-button" type="submit" disabled={loading || !auth}>
              {loading ? "Working..." : isCreating ? "Create account" : "Sign in"}
            </button>
          </form>

          <div className="login-divider">
            <span>or</span>
          </div>

          <button
            className="secondary-button"
            onClick={handleGoogleAuth}
            disabled={loading || !auth}
          >
            Continue with Google
          </button>

          <button
            className="ghost-button"
            type="button"
            onClick={() => setIsCreating((prev) => !prev)}
          >
            {isCreating ? "Already have an account? Sign in" : "New here? Create account"}
          </button>

          <p className="login-note">
            Need SSO or magic link? We can add that next.
          </p>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

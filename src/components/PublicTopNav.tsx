import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import tailgateTimeLogo from "../../ttnobg.png";

export function PublicTopNav() {
  const { user } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;
  const currentMode = new URLSearchParams(location.search).get("mode");

  return (
    <header className="public-nav-shell">
      <div className="public-nav">
        <Link to="/" className="public-brand">
          <img src={tailgateTimeLogo} alt="TailgateTime" />
          <strong>TailgateTime</strong>
        </Link>
        <nav className="public-nav-links" aria-label="Public site">
          <Link to="/" className={pathname === "/" ? "active" : ""}>
            Home
          </Link>
          <Link to="/discover" className={pathname.startsWith("/discover") ? "active" : ""}>
            Discover
          </Link>
          <a href="/landing.html">Marketing</a>
          <a href="/contact.html">Contact</a>
        </nav>
        <div className="public-auth-actions">
          {user ? (
            <Link to="/dashboard" className="public-auth-btn signup">
              Open Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login?mode=login"
                className={`public-auth-btn login ${currentMode === "login" ? "active" : ""}`.trim()}
              >
                Login
              </Link>
              <Link
                to="/login?mode=signup"
                className={`public-auth-btn signup ${currentMode === "signup" ? "active" : ""}`.trim()}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

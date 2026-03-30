import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { IconFacebook, IconInstagram } from "./Icons";
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
          <Link to="/release-2-0" className={pathname.startsWith("/release-2-0") ? "active" : ""}>
            2.0
          </Link>
          <Link to="/discover" className={pathname.startsWith("/discover") ? "active" : ""}>
            Discover
          </Link>
          <a href="/contact.html">Contact &amp; Support</a>
          <a
            href="https://www.instagram.com/tailgatetime25/"
            target="_blank"
            rel="noopener noreferrer"
            className="public-nav-social-link"
            aria-label="TailgateTime on Instagram"
            title="Instagram"
          >
            <IconInstagram size={16} />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61577940414994"
            target="_blank"
            rel="noopener noreferrer"
            className="public-nav-social-link"
            aria-label="TailgateTime on Facebook"
            title="Facebook"
          >
            <IconFacebook size={16} />
          </a>
        </nav>
        <div className="public-auth-actions">
          {user ? (
            <Link to="/dashboard" className="public-auth-btn signup">
              My Dashboard
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

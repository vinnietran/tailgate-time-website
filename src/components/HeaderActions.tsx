import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { IconBell, IconSpark, IconUser } from "./Icons";
import { useAuth } from "../hooks/useAuth";
import { useUnreadNotificationsCount } from "../hooks/useUnreadNotificationsCount";
import { auth } from "../lib/firebase";

export default function HeaderActions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const unreadCount = useUnreadNotificationsCount(user?.uid);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const unreadBadgeLabel = unreadCount > 99 ? "99+" : String(unreadCount);
  const notificationsAriaLabel =
    unreadCount > 0
      ? `Notifications (${unreadCount} unread)`
      : "Notifications";

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    setLogoutPending(true);
    try {
      if (auth) {
        await signOut(auth);
      }
      navigate("/login", { replace: true });
    } catch (logoutFailure) {
      console.error("Failed to log out", logoutFailure);
    } finally {
      setLogoutPending(false);
      setMenuOpen(false);
    }
  };

  return (
    <div className="top-bar-actions">
      <div className="action-cluster">
        <button
          className="icon-button icon-button-with-badge"
          aria-label={notificationsAriaLabel}
          onClick={() => navigate("/messages")}
        >
          <IconBell />
          {unreadCount > 0 ? (
            <span className="icon-button-badge" aria-hidden>
              {unreadBadgeLabel}
            </span>
          ) : null}
        </button>
        <div className="account-menu" ref={accountMenuRef}>
          <button
            className="icon-button"
            aria-label="Account"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <IconUser />
          </button>
          {menuOpen ? (
            <div className="account-menu-dropdown" role="menu" aria-label="Account menu">
              <button
                type="button"
                className="account-menu-item"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/account");
                }}
              >
                View profile
              </button>
              <button
                type="button"
                className="account-menu-item danger"
                role="menuitem"
                onClick={() => void handleLogout()}
                disabled={logoutPending}
              >
                {logoutPending ? "Logging out..." : "Logout"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <button
        className="primary-button"
        onClick={() => navigate("/tailgates/new")}
      >
        <IconSpark size={16} />
        <span>Create Tailgate</span>
      </button>
    </div>
  );
}

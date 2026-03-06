import React from "react";
import { useNavigate } from "react-router-dom";
import { IconBell, IconSpark, IconUser } from "./Icons";
import { useAuth } from "../hooks/useAuth";
import { useUnreadNotificationsCount } from "../hooks/useUnreadNotificationsCount";

export default function HeaderActions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const unreadCount = useUnreadNotificationsCount(user?.uid);
  const unreadBadgeLabel = unreadCount > 99 ? "99+" : String(unreadCount);
  const notificationsAriaLabel =
    unreadCount > 0
      ? `Notifications (${unreadCount} unread)`
      : "Notifications";

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
        <button
          className="icon-button"
          aria-label="Account"
          onClick={() => navigate("/account")}
        >
          <IconUser />
        </button>
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

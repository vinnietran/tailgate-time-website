import React from "react";
import { useNavigate } from "react-router-dom";
import { IconBell, IconSpark, IconUser } from "./Icons";

export default function HeaderActions() {
  const navigate = useNavigate();

  return (
    <div className="top-bar-actions">
      <div className="action-cluster">
        <button
          className="icon-button"
          aria-label="Notifications"
          onClick={() => navigate("/messages")}
        >
          <IconBell />
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

import React from "react";
import { useNavigate } from "react-router-dom";
import { IconBell, IconSpark, IconUser } from "./Icons";

export default function TopBar({ firstName }: { firstName: string }) {
  const navigate = useNavigate();

  return (
    <div className="top-bar-inner">
      <div>
        <p className="eyebrow">Welcome back,</p>
        <h1 className="page-title">{firstName}!</h1>
        <p className="subtext">Here's your TailgateTime dashboard.</p>
      </div>
      <div className="top-bar-actions">
        <div className="action-cluster">
          <button className="icon-button" aria-label="Notifications">
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
    </div>
  );
}

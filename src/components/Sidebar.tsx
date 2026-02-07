import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useAuth } from "../hooks/useAuth";
import { useUserProfile } from "../hooks/useUserProfile";
import { auth } from "../lib/firebase";

export default function Sidebar() {
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.uid);
  const navigate = useNavigate();
  const displayName = profile?.displayName ?? user?.displayName ?? "Host";
  const email = profile?.email ?? user?.email ?? "host@tailgatetime.com";
  const photoURL = profile?.photoURL ?? user?.photoURL;
  const initial = (displayName ?? email ?? "H").slice(0, 1);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo">
          <div className="logo-mark">TT</div>
          <div>
            <p className="logo-title">TailgateTime</p>
            <p className="logo-subtitle">Host Console</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            My Tailgates
          </NavLink>
          <NavLink to="/tailgates/new" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            Create Tailgate
          </NavLink>
          <NavLink to="/account" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            Account & Payouts
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-profile">
        <div className="profile-avatar">
          {photoURL ? (
            <img src={photoURL} alt={displayName} />
          ) : (
            <span>{initial}</span>
          )}
        </div>
        <div className="profile-meta">
          <p className="profile-name">{displayName}</p>
          <p className="profile-email">{email}</p>
        </div>
        <button className="ghost-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </aside>
  );
}

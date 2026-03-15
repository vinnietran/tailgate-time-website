import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import tailgateTimeLogo from "../../ttnobg.png";
import {
  IconChevronLeft,
  IconCompass,
  IconDashboard,
  IconFacebook,
  IconInstagram,
  IconSpark,
  IconWallet
} from "./Icons";

const SIDEBAR_COLLAPSED_STORAGE_KEY = "tt.sidebar.collapsed";

type SidebarNavItem =
  {
    to: string;
    label: string;
    meta: string;
    icon: React.ReactNode;
  };

const navItems: SidebarNavItem[] = [
  {
    to: "/dashboard",
    label: "My Tailgates",
    meta: "Overview",
    icon: <IconDashboard size={18} />
  },
  {
    to: "/discover",
    label: "Discover",
    meta: "Find events",
    icon: <IconCompass size={18} />
  },
  {
    to: "/tailgates/new",
    label: "Create Tailgate",
    meta: "Host tools",
    icon: <IconSpark size={18} />
  },
  {
    to: "/account",
    label: "Account & Payouts",
    meta: "Billing",
    icon: <IconWallet size={18} />
  }
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY);
    if (saved === "1") {
      setIsCollapsed(true);
    }
  }, []);

  const toggleCollapsed = () => {
    setIsCollapsed((previous) => {
      const next = !previous;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, next ? "1" : "0");
      }
      return next;
    });
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top">
        <div className="logo">
          <img className="logo-image" src={tailgateTimeLogo} alt="TailgateTime logo" />
          <div className="logo-copy">
            <p className="logo-title">TailgateTime</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              aria-label={item.label}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            >
              <span className="nav-item-icon" aria-hidden>
                {item.icon}
              </span>
              {!isCollapsed ? (
                <span className="nav-item-content">
                  <span className="nav-item-label">{item.label}</span>
                  <span className="nav-item-meta">{item.meta}</span>
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-social-links" aria-label="Social links">
          <a
            href="https://www.instagram.com/tailgatetime25/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TailgateTime on Instagram"
            title="Instagram"
            className="sidebar-social-link"
          >
            <IconInstagram size={18} />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61577940414994"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TailgateTime on Facebook"
            title="Facebook"
            className="sidebar-social-link"
          >
            <IconFacebook size={18} />
          </a>
        </div>
      </div>
      <div className="sidebar-bottom">
        <button
          type="button"
          className="sidebar-collapse-toggle"
          onClick={toggleCollapsed}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <IconChevronLeft className={`sidebar-collapse-icon${isCollapsed ? " collapsed" : ""}`} />
        </button>
      </div>
    </aside>
  );
}

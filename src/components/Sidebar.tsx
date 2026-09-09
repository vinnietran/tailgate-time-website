import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import tailgateTimeLogo from "../../ttnobg.png";
import {
  IconChartBars,
  IconChevronLeft,
  IconCompass,
  IconDashboard,
  IconFacebook,
  IconInstagram,
  IconSpark,
  IconUser,
  IconWallet
} from "./Icons";
import { useAuth } from "../hooks/useAuth";

const SIDEBAR_COLLAPSED_STORAGE_KEY = "tt.sidebar.collapsed";

type SidebarNavItem =
  {
    to: string;
    label: string;
    icon: React.ReactNode;
  };

const navItems: SidebarNavItem[] = [
  {
    to: "/dashboard",
    label: "My Tailgates",
    icon: <IconDashboard size={18} />
  },
  {
    to: "/discover",
    label: "Discover",
    icon: <IconCompass size={18} />
  },
  {
    to: "/tailgates/new",
    label: "Create Tailgate",
    icon: <IconSpark size={18} />
  },
  {
    to: "/dashboard/host-page",
    label: "Host Page",
    icon: <IconUser size={18} />
  },
  {
    to: "/account",
    label: "Account & Payouts",
    icon: <IconWallet size={18} />
  }
];

export default function Sidebar() {
  const { isAdmin } = useAuth();
  const { pathname } = useLocation();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !active || !window.matchMedia("(max-width: 900px)").matches) return;
    nav.scrollLeft += active.getBoundingClientRect().left - nav.getBoundingClientRect().left - (nav.clientWidth - active.clientWidth) / 2;
  }, [pathname]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderedNavItems = isAdmin
    ? [
        ...navItems,
        {
          to: "/admin/metrics",
          label: "Admin Metrics",
          icon: <IconChartBars size={18} />
        }
      ]
    : navItems;

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
        <Link to="/" className="logo" aria-label="Go to homepage">
          <img className="logo-image" src={tailgateTimeLogo} alt="TailgateTime logo" />
          <div className="logo-copy">
            <p className="logo-title">TailgateTime</p>
          </div>
        </Link>

        <p className="sidebar-section-label">Workspace</p>
        <nav ref={navRef} id="workspace-navigation" className="sidebar-nav" aria-label="Workspace">
          {renderedNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              aria-label={item.label}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            >
              <span className="nav-item-icon" aria-hidden>
                {item.icon}
              </span>
                <span className="nav-item-content">
                  <span className="nav-item-label">{item.label}</span>
                </span>
            </NavLink>
          ))}
        </nav>

      </div>
      <div className="sidebar-bottom">
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
        <button
          type="button"
          className="sidebar-collapse-toggle"
          onClick={toggleCollapsed}
          aria-expanded={!isCollapsed}
          aria-controls="workspace-navigation"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <IconChevronLeft className={`sidebar-collapse-icon${isCollapsed ? " collapsed" : ""}`} />
        </button>
      </div>
    </aside>
  );
}

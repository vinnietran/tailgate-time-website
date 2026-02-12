import React from "react";
import { NavLink } from "react-router-dom";
import tailgateTimeLogo from "../../ttnobg.png";
import { IconCompass, IconDashboard, IconSpark, IconWallet } from "./Icons";

const navItems = [
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
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo">
          <img className="logo-image" src={tailgateTimeLogo} alt="TailgateTime logo" />
          <div>
            <p className="logo-title">TailgateTime</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            >
              <span className="nav-item-icon" aria-hidden>
                {item.icon}
              </span>
              <span className="nav-item-content">
                <span className="nav-item-label">{item.label}</span>
                <span className="nav-item-meta">{item.meta}</span>
              </span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}

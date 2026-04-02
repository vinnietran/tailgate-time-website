import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/admin/metrics", label: "Metrics dashboard" },
  { to: "/admin/ops", label: "Ops dashboard" },
  { to: "/admin/spotlight", label: "Spotlight editor" }
];

export default function AdminConsoleNav() {
  return (
    <div className="admin-console-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `${isActive ? "primary-button" : "secondary-button"} admin-console-nav-link`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

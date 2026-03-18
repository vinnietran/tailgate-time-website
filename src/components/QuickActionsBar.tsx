import { Link } from "react-router-dom";
import { IconCheckin, IconPayout, IconSpark } from "./Icons";

const actions = [
  {
    label: "View Payouts",
    description: "Track Stripe payouts and balances",
    to: "/account",
    icon: <IconPayout />
  },
  {
    label: "Check-in Guests",
    description: "Open today's check-in tools",
    to: "/checkin",
    icon: <IconCheckin />
  },
  {
    label: "Create Tailgate",
    description: "Start a new tailgate now",
    to: "/tailgates/new",
    icon: <IconSpark />
  }
];

export default function QuickActionsBar() {
  return (
    <section className="quick-actions">
      <div className="quick-actions-header">
        <h2>Quick Actions</h2>
        <p>Jump straight into your highest value tools.</p>
      </div>
      <div className="quick-actions-grid">
        {actions.map((action) => (
          <Link key={action.label} to={action.to} className="quick-action-card">
            <div className="quick-action-icon">{action.icon}</div>
            <div>
              <p className="quick-action-kicker">Shortcut</p>
              <p className="quick-action-title">{action.label}</p>
              <p className="quick-action-desc">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

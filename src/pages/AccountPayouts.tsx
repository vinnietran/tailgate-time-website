import React from "react";
import AppShell from "../components/AppShell";

export default function AccountPayouts() {
  return (
    <AppShell header={<div className="simple-header"><h1>Account & Payouts</h1></div>}>
      <section className="placeholder-card">
        <h2>Payout Overview</h2>
        <p>
          Connect this view to Stripe Connect and payouts data when ready.
        </p>
      </section>
    </AppShell>
  );
}

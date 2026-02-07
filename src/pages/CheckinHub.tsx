import React from "react";
import AppShell from "../components/AppShell";

export default function CheckinHub() {
  return (
    <AppShell header={<div className="simple-header"><h1>Check-in Guests</h1></div>}>
      <section className="placeholder-card">
        <h2>Today's Tailgates</h2>
        <p>List today's events and open their check-in flows from here.</p>
      </section>
    </AppShell>
  );
}

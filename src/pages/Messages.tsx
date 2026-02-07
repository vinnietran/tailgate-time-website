import React from "react";
import AppShell from "../components/AppShell";

export default function Messages() {
  return (
    <AppShell header={<div className="simple-header"><h1>Send Messages</h1></div>}>
      <section className="placeholder-card">
        <h2>Host Messaging</h2>
        <p>Build the host-to-guest messaging flow here.</p>
      </section>
    </AppShell>
  );
}

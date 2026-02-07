import React from "react";
import { useParams } from "react-router-dom";
import AppShell from "../components/AppShell";

export default function TailgateCheckin() {
  const { id } = useParams();

  return (
    <AppShell header={<div className="simple-header"><h1>Check-in Guests</h1></div>}>
      <section className="placeholder-card">
        <h2>Check-in for {id}</h2>
        <p>Hook up the guest check-in tool here.</p>
      </section>
    </AppShell>
  );
}

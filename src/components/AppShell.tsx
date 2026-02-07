import React from "react";
import Sidebar from "./Sidebar";

export default function AppShell({
  header,
  children
}: {
  header?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-area">
        {header ? <div className="top-bar">{header}</div> : null}
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}

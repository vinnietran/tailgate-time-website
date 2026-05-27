import React from "react";
import Sidebar from "./Sidebar";
import SiteFooter from "./SiteFooter";
import HeaderActions from "./HeaderActions";

export default function AppShell({
  header,
  children,
  showHeaderActions = true
}: {
  header?: React.ReactNode;
  children: React.ReactNode;
  showHeaderActions?: boolean;
}) {
  const shouldRenderTopBar = Boolean(header) || showHeaderActions;

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-area">
        {shouldRenderTopBar ? (
          <div className="top-bar">
            {header && !showHeaderActions ? (
              header
            ) : (
              <div className={`app-shell-top-row ${header ? "has-header" : "no-header"}`}>
                {header ? <div className="app-shell-top-row-header">{header}</div> : null}
                {showHeaderActions ? <HeaderActions /> : null}
              </div>
            )}
          </div>
        ) : null}
        <div className="page-content">{children}</div>
        <SiteFooter />
      </main>
    </div>
  );
}

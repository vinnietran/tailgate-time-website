import React from "react";
import HeaderActions from "./HeaderActions";

export default function TopBar({ firstName }: { firstName: string }) {
  return (
    <div className="top-bar-inner">
      <div>
        <p className="eyebrow">Welcome back,</p>
        <h1 className="page-title">{firstName}!</h1>
        <p className="subtext">Here's your TailgateTime dashboard.</p>
      </div>
      <HeaderActions />
    </div>
  );
}

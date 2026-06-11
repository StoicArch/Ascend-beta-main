import React from "react";
import "./Support.css";

export default function Support() {
  return (
    <div className="support-page app-page">
      <h1>Need Help?</h1>
      <p>If ASCEND breaks, feels confusing, or you need help, contact support.</p>

      <div className="support-card">
        <h2>Instagram</h2>
        <p>@yourhandle</p>
      </div>

      <div className="support-card">
        <h2>Email</h2>
        <p>your@email.com</p>
      </div>
    </div>
  );
}
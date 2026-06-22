import React from "react";
import "./Legal.css";

export default function CookiePolicy() {
  return (
    <div className="legal-page">
      <div className="legal-content">
        <h1>Cookie Policy</h1>
        <p>ASCEND uses browser storage to keep you signed in, remember preferences, and save app progress.</p>
        <h2>What We Store</h2>
        <ul>
          <li>Onboarding completion and profile settings.</li>
          <li>Workout, nutrition, premium, and progress data.</li>
          <li>Temporary active workout session state.</li>
        </ul>
        <h2>Managing Storage</h2>
        <p>You can remove ASCEND data by clearing site data in your browser settings.</p>
      </div>
    </div>
  );
}

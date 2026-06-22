import React from "react";
import "./Legal.css";

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <div className="legal-content">
        <h1>Privacy Policy</h1>
        <p>ASCEND stores profile, workout, nutrition, and progress data to power your training experience.</p>
        <h2>Data We Use</h2>
        <ul>
          <li>Profile details such as goals, equipment, and training schedule.</li>
          <li>Workout history, exercise performance, and nutrition logs.</li>
          <li>Premium status and app preferences.</li>
        </ul>
        <h2>Storage</h2>
        <p>Most app data is stored locally in your browser. AI scanner requests may be sent to ASCEND backend services for meal analysis.</p>
        <h2>Your Choices</h2>
        <p>You can clear local browser storage to remove locally saved ASCEND data.</p>
      </div>
    </div>
  );
}

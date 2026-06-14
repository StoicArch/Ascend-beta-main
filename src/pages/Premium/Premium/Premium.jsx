import React from "react";
import "./Premium.css";

export default function Premium() {

  const pay = () => {
    window.open(
      "https://nattyjoshua.gumroad.com/l/cqeme",
      "_blank"
    );
  };

  return (
    <div className="premium-page app-page">
      <h1>ASCEND Premium</h1>

      <p>
        Unlock premium programs, structured training systems,
        advanced progression tracking and future AI tools.
      </p>

      <div className="premium-card">
        <h2>$9.99/NAIRA 13,596/month</h2>

        <p>
          Includes all premium ASCEND programs and future premium updates.
        </p>

        <button onClick={pay}>
          Start Premium Membership
        </button>

        <small>
          Secure recurring payments powered by Gumroad.
        </small>
      </div>
    </div>
  );
}
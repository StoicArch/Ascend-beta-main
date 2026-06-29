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

  <div className="premium-hero">

    <span className="premium-tag">
      ASCEND PREMIUM
    </span>

    <h1>
      Train with a complete
      <br />
      fitness system.
    </h1>

    <p>
      Everything in Free, plus premium programs,
      adaptive AI coaching, nutrition guidance,
      recovery insights and every future premium release.
    </p>

  </div>

  <div className="premium-card">

    <div className="price-row">
      <h2>$9.99</h2>
      <span>/month</span>
    </div>

    <button
      className="premium-cta"
      onClick={pay}
    >
      Upgrade to Premium
    </button>

    <small>
      Secure payments powered by Gumroad.
      Cancel anytime.
    </small>

    <div className="premium-features">

      <div>✓ Premium Programs</div>

      <div>✓ Unlimited AI Coach</div>

      <div>✓ Adaptive Progression</div>

      <div>✓ Unlimited AI calorie Tracking</div>

      {/*<div>✓ Recovery Tracking</div> */}

      <div>✓ Weekly Reviews</div>

      <div>✓ Future Premium Features</div>

      <div>✓ Priority Updates</div>

    </div>

  </div>

</div>
  );
}
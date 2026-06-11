import React from "react";

export default function AIInsightCard({
  message
}) {

  return (

    <div className="ai-card">

      <div className="ai-top">

        <div className="ai-dot"></div>

        <div>

          <h3>
            ASCEND AI
          </h3>

          <span>
            Adaptive Training Intelligence
          </span>

        </div>

      </div>

      <p className="ai-message">
        {message}
      </p>

      <div className="ai-warning">

        <span>
          You can still freely modify
          your workout.
        </span>

        <p>
          AI suggestions are designed
          to improve recovery,
          fatigue management,
          progression,
          and exercise balance —
          not control your training.
        </p>

      </div>

    </div>
  );
}
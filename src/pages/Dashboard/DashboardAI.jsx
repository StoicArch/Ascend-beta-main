import React from "react";

export default function DashboardAI({
  recoveryScore
}) {

  return (

    <div className="ai-dashboard-card">

      <h2>AI Insight</h2>

      <p>

        {recoveryScore > 80
          ? "You are recovered. Push intensity today."
          : "You are fatigued. Reduce volume or focus on technique."}

      </p>

    </div>

  );
}
import React from "react";

export default function DashboardCards({
  workout,
  recoveryScore,
  lastSession
}) {

  return (

    <div className="stats-grid">

      <div className="stat-card">
        <h3>Today's Workout</h3>
        <p>{workout.length} exercises</p>
      </div>

      <div className="stat-card">
        <h3>Recovery Score</h3>
        <p>{recoveryScore}%</p>
      </div>

      <div className="stat-card">
        <h3>Last Session</h3>
        <p>
          {lastSession
            ? `${Math.floor(lastSession.time / 60)} min`
            : "No data"}
        </p>
      </div>

    </div>

  );
}
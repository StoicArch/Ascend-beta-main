import React from "react";

export default function GoalCard({
  title,
  active,
  onClick,
}) {
  return (
    <div
      className={`goal-card ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >
      <h2>{title}</h2>
    </div>
  );
}
import React from "react";

export default function StepHeader({
  current,
  total,
  title,
  subtitle,
}) {
  const progress = (current / total) * 100;

  return (
    <div className="step-header">

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className="step-content">
        <p className="step-count">
          Step {current} / {total}
        </p>

        <h1>{title}</h1>

        <span>{subtitle}</span>
      </div>

    </div>
  );
}
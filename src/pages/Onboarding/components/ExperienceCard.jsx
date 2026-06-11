import React from "react";

export default function ExperienceCard({
  level,
  years,
  description,
  active,
  onClick,
}) {
  return (
    <div
      className={`experience-card ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >
      <h2>{level}</h2>

      <p>{years}</p>

      <span>{description}</span>
    </div>
  );
}
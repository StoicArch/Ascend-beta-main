import React, { useState } from "react";
import "./Programs.css";
import { PROGRAMS } from "../../Data/Programs";
import { useNavigate } from "react-router-dom";
import PremiumEngine from "../../engine/PremiumEngine";
import UserProfileEngine from "../../engine/UserProfileEngine";

export default function Programs() {

  
  const navigate = useNavigate();
  const [selectedProgram, setSelectedProgram] = useState(null);

  const startProgram = (program) => {

    const profile = UserProfileEngine.getProfile();

if (
  profile.programId &&
  profile.programId !== program.id
) {
  alert(
    "You are already enrolled in a program. Leave your current program before starting another one."
  );
  return;
}
if (profile.programId === program.id) {
  alert(
    "You are already enrolled in this program."
  );
  return;
}
  if (program.status !== "available") return;

  const premium = PremiumEngine.isPremium();

  if (program.access === "premium" && !premium) {
    navigate("/premium");
    return;
  }

  navigate(`/program-setup/${program.id}`);
};


  return (
    <div className="programs-page app-page">
      <div className="programs-header">
        <span>ASCEND Programs</span>
        <h1>Choose Your Path</h1>
        <p>
          Pick the result you want. ASCEND will handle the workouts, calories,
          and progression (Your calories are modified based on the program you select).
        </p>
      </div>

      <div className="programs-grid">
        {PROGRAMS.map((program) => (
          <div className="program-card" key={program.id}>
            <div className="program-card-top">
             <span className={`access-badge ${program.access}`}>
 {program.access === "free"
  ? "Free"
  : program.id === "skinny-to-jacked"
  ? "First 3 Workouts Free"
  : program.access === "premium"
  ? "Premium Only"
  : "Premium"}
</span>
              <span className={`status-badge ${program.status}`}>
                {program.status === "available" ? "Available" : "Coming Soon"}
              </span>
            </div>

            <h2>{program.name}</h2>
            <p>{program.description}</p>

            <div className="program-info">
              <span>{program.duration}</span>
              <span>{program.goal}</span>
              <span>{program.type}</span>
            </div>

            <div className="program-actions">
              <button onClick={() => setSelectedProgram(program)}>
                View Details
              </button>

              <button
                className="start-program-btn"
                disabled={program.status !== "available"}
                onClick={() => startProgram(program)}
              >
                {program.status === "available" ? "Start Program" : "Locked"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedProgram && (
        <div
          className="program-modal-backdrop"
          onClick={() => setSelectedProgram(null)}
        >
          <div className="program-modal" onClick={(e) => e.stopPropagation()}>
            <span className="modal-eyebrow">
              {selectedProgram.access === "free"
  ? "Free Program"
  : selectedProgram.id === "skinny-to-jacked"
  ? "First 3 Workouts Free"
  : "Premium Program"}
            </span>

            <h2>{selectedProgram.name}</h2>
            <p>{selectedProgram.description}</p>

            {selectedProgram.id === "skinny-to-jacked" && (
  <div className="modal-info">
    <p><strong>Free Preview:</strong> First 3 workouts unlocked</p>
    <p><strong>Premium Unlocks:</strong> Full 24-week transformation</p>
  </div>
)}

{selectedProgram.id === "bulking-journey" && (
  <div className="modal-info">
    <p><strong>Premium Only:</strong> Full program unlock required</p>
    <p><strong>Built For:</strong> Faster size, strength, and weight gain</p>
  </div>
)}

            <div className="modal-info">
              <p>
                <strong>Duration:</strong> {selectedProgram.duration}
              </p>
              <p>
                <strong>Goal:</strong> {selectedProgram.goal}
              </p>
              <p>
                <strong>Nutrition Style:</strong> {selectedProgram.type}
              </p>
            </div>

            {selectedProgram.bestFor && (
              <>
                <h3>This is for you if:</h3>
                <ul>
                  {selectedProgram.bestFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            {selectedProgram.notFor && (
              <>
                <h3>This is not for you if:</h3>
                <ul>
                  {selectedProgram.notFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            <button
              className="modal-start-btn"
              disabled={selectedProgram.status !== "available"}
              onClick={() => startProgram(selectedProgram)}
            >
              {selectedProgram.status === "available"
                ? "Start This Program"
                : "Coming Soon"}
            </button>

            <button
              className="modal-close-btn"
              onClick={() => setSelectedProgram(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
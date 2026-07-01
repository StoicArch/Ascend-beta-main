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

  const token = localStorage.getItem("token");

if (!token) {
  localStorage.setItem(
    "pendingProgram",
    program.id
  );

  navigate("/auth");
  return;
}

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
       
        <h1>
Choose your
next physique.
</h1>

<p>
Every program adapts your training,
nutrition and progression to your goal.
Choose the physique you want to build.
</p>
      </div>

      <div className="programs-grid">
        {PROGRAMS.map((program) => (
          <div className="program-card" key={program.id}>
            <div className="program-card-top">
            <span
className={`access-badge ${program.access}`}
>

{program.access === "free" && "FREE"}

{program.id === "skinny-to-jacked" &&
"FREE PREVIEW"}

{program.access === "premium" &&
program.id !== "skinny-to-jacked" &&
"PREMIUM"}

</span>
              <span className={`status-badge ${program.status}`}>
                {program.status === "available" ? "Available" : "Coming Soon"}
              </span>
            </div>

            <h2>
  {program.name}

  {program.id === "capped-delts" && (
    <span className="specialization-badge">
      SPECIALIZATION
    </span>
  )}
</h2>


{program.status === "coming soon" && (
  <div className="coming-soon-text">
    Launching Soon
  </div>
)}

<p className="program-description">
{program.description}
</p>

<div className="program-level">

<div className="level-header">

<span className="level-label">
Difficulty
</span>

<span className="level-text">
{program.difficulty}
</span>

</div>

<div className="level-bar">

<div
className={`level-fill ${
program.difficulty === "Beginner"
? "easy"
: program.difficulty === "Intermediate"
? "medium"
: "hard"
}`}
/>

</div>

</div>
            <div className="program-meta">

<div className="program-duration">
🕒 {program.duration}
</div>

<div className="program-goal">
🎯 {program.goal}
</div>

<div className="program-type">
⚡ {program.type}
</div>

{program.id === "capped-delts" && (
  <div className="program-type">
    🎯 Shoulder Specialization
  </div>
)}

</div>

{program.id === "capped-delts" && (

<div className="program-highlight">

🔥 Shoulder specialization

</div>

)}

            <div className="program-actions">
             <button
  className="view-details-btn"
  onClick={() => setSelectedProgram(program)}
>
  View Details →
</button>

              <button
  className="start-program-btn"
  disabled={program.status !== "available"}
  onClick={() => startProgram(program)}
>
  {program.status === "available"
    ? "Begin Transformation →"
    : "Coming Soon"}
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

<div className="modal-stats">

<div>
<span>Duration</span>
<strong>{selectedProgram.duration}</strong>
</div>

<div>
<span>Difficulty</span>
<strong>{selectedProgram.difficulty}</strong>
</div>

<div>
<span>Goal</span>
<strong>{selectedProgram.goal}</strong>
</div>

</div>

<p className="program-description">
{selectedProgram.description}
</p>

{selectedProgram.id === "capped-delts" && (

<div className="modal-info">

<p><strong>Training Frequency:</strong> 2 shoulder sessions/week</p>

<p><strong>Weekly Volume:</strong> 10 hard sets</p>

<p><strong>Exercise Selection:</strong> Pick your own exercises once.</p>

<p><strong>Progression:</strong> Same exercises for all 8 weeks.</p>

<p><strong>Nutrition:</strong> Best performed while eating at maintenance or in a calorie surplus.</p>

</div>

)}


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

            {selectedProgram.id === "capped-delts" && (

<>

<h3>What You'll Build</h3>

<ul>

<li>✓ Wider shoulders</li>

<li>✓ Rounder side delts</li>

<li>✓ Better V-taper</li>

<li>✓ Stronger pressing stability</li>

<li>✓ Better progressive overload</li>

</ul>

<h3>Why ASCEND Doesn't Change Exercises</h3>

<p>

You'll use the same exercises for all 8 weeks so you can focus entirely on progressive overload instead of constantly changing movements.

</p>

</>

)}

            {selectedProgram.bestFor && (
              <>
                <h3>This is for :</h3>
                <ul>
                  {selectedProgram.bestFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            {selectedProgram.notFor && (
              <>
                <h3>This is not for :</h3>
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
Back
</button>


          </div>
        </div>
      )}
      <div className="program-disclaimer">

<strong>Disclaimer</strong>

<p>
ASCEND provides structured training, nutrition and recovery guidance. Results are never guaranteed and depend on your consistency, effort, nutrition, recovery, genetics and adherence to the program.
</p>

</div>
    </div>
    
  );
}
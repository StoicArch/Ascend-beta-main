import React from "react";
import "./Program.css";
import UserProfileEngine from "../../engine/UserProfileEngine";
import ProgramEngine from "../../engine/ProgramEngine";

export default function Program() {
  const profile = UserProfileEngine.getProfile();
  const status = ProgramEngine.getProgramStatus();

  const currentProgram = status.program;
  const nextWorkout = status.nextWorkout;

  if (!currentProgram) {
    return (
      <div className="program-page app-page">
        <div className="program-header">
          <h1>My Program</h1>
          <p>You have not selected a program yet.</p>
        </div>

        <div className="program-summary-card">
          <h2>No Program Selected</h2>
          <p>Go to Programs and choose one to begin.</p>
        </div>
      </div>
    );
  }

  const totalWeeks = currentProgram.totalWeeks || 8;
  const progressPercent = Math.round((status.week / totalWeeks) * 100);
  const workouts = ProgramEngine.getCurrentTrackWorkouts();
  const workoutDays = status.workoutDays || [];

  return (
    <div className="program-page app-page">
      <div className="program-header">
        <span className="program-eyebrow">Current Program</span>
        <h1>{currentProgram.name}</h1>
        <p>{currentProgram.description}</p>
      </div>

      <div className="program-progress-card">
        <span>Program Progress</span>
        <h2>
          Week {status.week} of {totalWeeks}
        </h2>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p>{progressPercent}% complete</p>
      </div>

      <div className="program-summary-card">
        <h2>Overview</h2>
        <p>Goal: {currentProgram.goal}</p>
        <p>Duration: {currentProgram.duration}</p>
        <p>Nutrition: {currentProgram.type}</p>
        <p>Track: {status.track} days/week</p>
        <p>Training Days: {profile.trainingDays || "Not set"}</p>
      </div>

      <div className="program-status-card">
        <span>Today</span>
        <h2>{status.today}</h2>

        {status.isRestDay ? (
          <p>
            Recovery day. Next workout:{" "}
            {nextWorkout?.day || "No upcoming workout found"}
          </p>
        ) : (
          <p>
            {status.todayTemplate?.name || "Workout"} •{" "}
            {status.todayWorkout.length} exercises scheduled today.
          </p>
        )}
      </div>

      <div className="program-section">
        <h2>Week {status.week} Schedule</h2>

        <div className="program-week">
          {workouts.map((workout, index) => (
            <div className="program-day-card" key={index}>
              <div>
                <h3>{workoutDays[index] || `Workout ${index + 1}`}</h3>
                <p>
                  {workout.name} • {workout.exercises.length} exercises
                </p>
              </div>

              <span>Workout</span>
            </div>
          ))}
        </div>
      </div>

      <div className="program-section">
        <h2>Program Overview</h2>

        <div className="program-summary-card">
          <p>
            This program is designed for people who want to{" "}
            <strong>{currentProgram.goal.toLowerCase()}</strong>.
          </p>

          <p>
            Follow the weekly workouts, track your weight, and stay consistent
            until the program is complete.
          </p>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Program.css";
import UserProfileEngine from "../../engine/UserProfileEngine";
import ProgramEngine from "../../engine/ProgramEngine";
import NutritionEngine from "../../engine/NutritionEngine";

export default function Program() {
  const navigate = useNavigate();
  const profile = UserProfileEngine.getProfile();
  const status = ProgramEngine.getProgramStatus();

  const currentProgram = status.program;
  const nextWorkout = status.nextWorkout;
  
  const [currentWeightInput, setCurrentWeightInput] = useState(profile.weight || 70);
  const [goalWeightInput, setGoalWeightInput] = useState(
    profile.goalWeight || ""
  );

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

  const saveWeightGoals = () => {
  if (!currentWeightInput || Number(currentWeightInput) <= 0) {
    alert("Please enter your current weight.");
    return;
  }

  if (!goalWeightInput || Number(goalWeightInput) <= 0) {
    alert("Please enter your goal weight.");
    return;
  }

  const nutrition = NutritionEngine.getProgramNutrition({
    programId: profile.programId,
    goal: currentProgram.goal,
    weight: currentWeightInput,
    goalWeight: goalWeightInput,
    trainingDays: profile.trainingDays,
  });

  UserProfileEngine.saveProfile({
    ...profile,
    weight: nutrition.currentWeight,
    startingWeight: profile.startingWeight || nutrition.currentWeight,
    goalWeight: nutrition.goalWeight,
    calories: nutrition.calories,
    protein: nutrition.protein,
    carbs: nutrition.carbs,
    fat: nutrition.fat,
    nutritionPhase: nutrition.nutritionPhase,
    nutritionNote: nutrition.nutritionNote,
    weeklyTargetChange: nutrition.weeklyTargetChange,
    estimatedWeeksToGoal: nutrition.estimatedWeeksToGoal,
    maintenanceCalories: nutrition.maintenanceCalories,
  });

  window.location.reload();
};

  const totalWeeks = currentProgram.totalWeeks || 8;
  const progressPercent = Math.min(
  100,
  Math.round(((status.week - 1) / totalWeeks) * 100)
);
  const workouts = ProgramEngine.getCurrentTrackWorkouts();
  const workoutDays = status.workoutDays || [];

  const needsGoalWeight =
    !profile.goalWeight || Number(profile.goalWeight) === Number(profile.weight);

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

      {!status.canAccessCurrentWeek && (
  <div className="program-summary-card">
    <h2>Premium Required 🔒</h2>

    <p>
      You have completed the free preview of this program.
      Upgrade to continue.
    </p>

    <button onClick={() => navigate("/premium")}>
      Unlock Premium
    </button>
  </div>
)}



      <div className="program-summary-card">
        <h2>Overview</h2>
        <p>Goal: {currentProgram.goal}</p>
        <p>Duration: {currentProgram.duration}</p>
        <p>Nutrition: {currentProgram.type}</p>
        <p>Track: {status.track} days/week</p>
        <p>Training Days: {profile.trainingDays || "Not set"}</p>
      </div>

      {needsGoalWeight && (
        <div className="program-summary-card">
          <h2>Set Goal Weight</h2>

          <p>
            Enter your target weight so ASCEND can calculate your calories,
            macros, and estimated timeline.
          </p>

          <input
  type="number"
  value={currentWeightInput}
  onChange={(e) => setCurrentWeightInput(e.target.value)}
  placeholder="Current Weight (kg)"
  className="goal-weight-input"
/>

<input
  type="number"
  value={goalWeightInput}
  onChange={(e) => setGoalWeightInput(e.target.value)}
  placeholder="Goal Weight (kg)"
  className="goal-weight-input"
/>


          <button className="save-goal-btn" onClick={saveWeightGoals}>
            Save Weight Goals
          </button>
        </div>
      )}

      <div className="program-summary-card">
        <h2>Nutrition Targets</h2>

        <p>Phase: {profile.nutritionPhase || "Not set"}</p>
        <p>Current Weight: {profile.weight ? `${profile.weight}kg` : "--"}</p>
        <p>
          Goal Weight: {profile.goalWeight ? `${profile.goalWeight}kg` : "--"}
        </p>
        <p>
          Total Target Change:{" "}
          {profile.goalWeight && profile.weight
            ? `${Number(profile.goalWeight - profile.weight).toFixed(1)}kg`
            : "--"}
        </p>
        <p>
          Weekly Target:{" "}
          {profile.weeklyTargetChange
            ? `${profile.weeklyTargetChange > 0 ? "+" : ""}${
                profile.weeklyTargetChange
              }kg/week`
            : "--"}
        </p>
        <p>
          Estimated Time:{" "}
          {profile.estimatedWeeksToGoal
            ? `${profile.estimatedWeeksToGoal} weeks`
            : "--"}
        </p>

        <div className="program-nutrition-grid">
          <div>
            <span>Calories</span>
            <strong>{profile.calories || "--"}</strong>
          </div>

          <div>
            <span>Protein</span>
            <strong>{profile.protein || "--"}g</strong>
          </div>

          <div>
            <span>Carbs</span>
            <strong>{profile.carbs || "--"}g</strong>
          </div>

          <div>
            <span>Fat</span>
            <strong>{profile.fat || "--"}g</strong>
          </div>
        </div>

        <p>{profile.nutritionNote}</p>
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

      <div className="program-week">
  {workouts.map((workout, index) => {
    const canAccessWorkout = ProgramEngine.canAccessWorkout(
      status.week,
      index
    );

    return (
      <div
        className={`program-day-card ${
          canAccessWorkout ? "" : "locked-program-day"
        }`}
        key={index}
      >
        <div>
          <h3>
            {workoutDays[index] || `Workout ${index + 1}`}
            {!canAccessWorkout && " 🔒"}
          </h3>

          <p>
            {workout.name} • {workout.exercises.length} exercises
          </p>
        </div>

        {canAccessWorkout ? (
          <span>Workout</span>
        ) : (
          <button
  onClick={() =>
    window.location.href = "https://nattyjoshua.gumroad.com/l/cqeme"
  }
>
  Get Full Program
</button>
        )}
      </div>
    );
  })}
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
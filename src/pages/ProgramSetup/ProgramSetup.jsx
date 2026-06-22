import React, { useState } from "react";
import "./ProgramSetup.css";
import { useNavigate, useParams } from "react-router-dom";
import { PROGRAMS } from "../../Data/Programs";
import UserProfileEngine from "../../engine/UserProfileEngine";
import NutritionEngine from "../../engine/NutritionEngine";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const FOCUS_OPTIONS = [
  "Chest",
  "Back",
  "Shoulders",
  "Quads",
  "Hamstrings",
  "Glutes",
  "Biceps",
  "Triceps",
  "Abs",
  "Conditioning",
];
export default function ProgramSetup() {
  const { id } = useParams();
  const navigate = useNavigate();

  const profile = UserProfileEngine.getProfile();

  const [track, setTrack] = useState(4);
  const [selectedDays, setSelectedDays] = useState([]);
  const [dayFocus, setDayFocus] = useState({});
  const [currentWeight, setCurrentWeight] = useState(profile.weight || 70);
  const [goalWeight, setGoalWeight] = useState(profile.goalWeight || "");

  const program = PROGRAMS.find(
    (p) => String(p.id) === String(id)
  );

  if (!program) {
    return (
      <div className="program-setup-page app-page">
        <h1>Program not found</h1>
      </div>
    );
  }

  const isHomeChestBuilder =
    program.id === "home-chest-builder";

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));

      const updatedFocus = { ...dayFocus };
      delete updatedFocus[day];
      setDayFocus(updatedFocus);

      return;
    }

    if (selectedDays.length >= track) {
      alert(`You selected the ${track}-day version. Pick only ${track} days.`);
      return;
    }

    setSelectedDays([...selectedDays, day]);
  };

  const toggleFocus = (day, focus) => {
    const currentFocus = dayFocus[day] || [];

    const updatedFocus = currentFocus.includes(focus)
      ? currentFocus.filter((item) => item !== focus)
      : [...currentFocus, focus];

    setDayFocus({
      ...dayFocus,
      [day]: updatedFocus,
    });
  };

  
 const startProgram = () => {
 const currentProfile = UserProfileEngine.getProfile();

if (
  currentProfile.programSchedule &&
  currentProfile.programSchedule.length > 0
) 
  {
alert(
"You are already enrolled in a program. Leave your current program before starting another one."
);
return;
}

if (currentProfile.programId === program.id) {
alert(
"You are already enrolled in this program."
);
return;
}

if (selectedDays.length !== track) {
alert(`Please choose exactly ${track} workout days.`);
return;
}

const missingFocus =
!isHomeChestBuilder &&
selectedDays.some(
(day) => !dayFocus[day] || dayFocus[day].length === 0
);

if (missingFocus) {
alert("Please choose at least one muscle focus for each selected day.");
return;
}

const programSchedule = selectedDays.map((day) => ({
day,
focus: isHomeChestBuilder ? ["Chest"] : dayFocus[day],
}));

const profile = UserProfileEngine.getProfile();

if (!currentWeight || Number(currentWeight) <= 0) {
alert("Please enter your current weight.");
return;
}

if (!goalWeight || Number(goalWeight) <= 0) {
alert("Please enter your goal weight.");
return;
}

const nutrition = NutritionEngine.getProgramNutrition({
programId: program.id,
goal: program.goal,
weight: currentWeight,
goalWeight,
trainingDays: track,
});
UserProfileEngine.saveProfile({
  ...profile,

  programId: program.id,

  programTotalWeeks: program.totalWeeks,
  programTrack: track,
  programWorkoutDays: selectedDays,
  programSchedule,
  currentWeek: 1,

  weight: nutrition.currentWeight,
  startingWeight:
    profile.startingWeight || nutrition.currentWeight,
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

  weeklyReview: {
    ...profile.weeklyReview,
    currentCalories: nutrition.calories,
    currentProtein: nutrition.protein,
    currentPhase: nutrition.nutritionPhase,
    aiNotes: nutrition.nutritionNote,
  },
});

localStorage.removeItem("workout");
localStorage.removeItem("workoutDate");

navigate("/program");
};
  return (
    
    <div className="program-setup-page app-page">
      <div className="program-setup-header">
        <span>Start Program</span>
        <h1>{program.name}</h1>
        <p>{program.description}</p>
      </div>

      <div className="setup-card">
  <h2>Set Your Bodyweight Goal</h2>
  <p>ASCEND will calculate your calories, protein, carbs, and fats from this.</p>

  <input
    type="number"
    placeholder="Current weight in kg"
    value={currentWeight}
    onChange={(e) => setCurrentWeight(e.target.value)}
  />

  <input
    type="number"
    placeholder="Goal weight in kg"
    value={goalWeight}
    onChange={(e) => setGoalWeight(e.target.value)}
  />
</div>

      <div className="setup-card">
  <h2>Choose Training Version</h2>

  {isHomeChestBuilder ? (
    <>
      <p>
        Home Chest Builder is fixed at 4 chest days per week because the whole
        program is built around high-frequency chest volume.
      </p>

      <div className="track-grid">
        <button className="active" type="button">
          4 Days
        </button>
      </div>
    </>
  ) : (
    <>
      <p>Pick how many days per week you can realistically train.</p>

      <div className="track-grid">
        {[3, 4, 5, 6].map((num) => (
          <button
            key={num}
            className={track === num ? "active" : ""}
            onClick={() => {
              setTrack(num);
              setSelectedDays([]);
              setDayFocus({});
            }}
          >
            {num} Days
          </button>
        ))}
      </div>
    </>
  )}
</div>

      <div className="setup-card">
        <h2>Choose Workout Days</h2>
        <p>Select exactly {track} days.</p>

        <div className="days-grid">
          {DAYS.map((day) => (
            <button
              key={day}
              className={selectedDays.includes(day) ? "active" : ""}
              onClick={() => toggleDay(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {selectedDays.length > 0 && !isHomeChestBuilder && (
  <div className="setup-card">
    <h2>Choose Muscle Focus Per Day</h2>
    <p>You can pick more than one muscle group per workout day.</p>

    {selectedDays.map((day) => (
      <div key={day} className="focus-row">
        <strong>{day}</strong>

        <div className="focus-grid">
          {FOCUS_OPTIONS.map((focus) => (
            <button
              key={focus}
              type="button"
              className={
                dayFocus[day]?.includes(focus) ? "active" : ""
              }
              onClick={() => toggleFocus(day, focus)}
            >
              {focus}
            </button>
          ))}
        </div>
      </div>
    ))}
  </div>
)}

{selectedDays.length > 0 && isHomeChestBuilder && (
  <div className="setup-card">
    <h2>Chest Focus Locked</h2>
    <p>
      Home Chest Builder is a 16-week chest specialization program. Every
      selected workout day will automatically be assigned to Chest.
    </p>

    {selectedDays.map((day) => (
      <div key={day} className="focus-row">
        <strong>{day}</strong>

        <div className="focus-grid">
          <button className="active" type="button">
            Chest
          </button>
        </div>
      </div>
    ))}
  </div>
)}


      <button className="start-setup-btn" onClick={startProgram}>
        Start {program.name}
      </button>
    </div>
  );
}